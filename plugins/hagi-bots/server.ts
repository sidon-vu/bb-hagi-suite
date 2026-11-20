import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { rpcContract } from "./features/hagi-contract";
import { createHbotStore } from "./features/bot-store";
import { legacyApply, legacyPreview } from "./features/import-legacy";
import { registerRuntime } from "./features/runtime";
import { registerMention } from "./features/mention";
import { registerCli } from "./features/cli";

const CHANGED = "hagi-bots-changed"; // channel riêng — bots-sidebar dùng project-bots-changed

export default async function plugin(bb: BbPluginApi) {
  bb.log.info("loaded");
  // Mỗi tính năng = một công tắc boolean, mặc định tắt. Ghi vào catalog/hagi-bots.md.
  // Lưu ý: slot navPanel đăng ký tĩnh nên mục "Bots" vẫn hiện trong điều hướng khi tắt;
  // công tắc chỉ điều khiển nội dung bên trong trang.
  const settings = bb.settings.define({
    botsPanel: {
      type: "boolean",
      label: "Trang Bots",
      description: "Mục Bots trong thanh điều hướng mở trang riêng: danh sách bot + hội thoại của bot. Bản vỏ UI — dữ liệu giả, chưa có tính năng thật.",
      default: false,
    },
    attentionDock: {
      type: "boolean",
      label: "Thẻ báo chờ duyệt",
      description: "Thẻ nổi góc màn hình khi có bot chờ duyệt — avatar + tên bot + việc đang chờ; bấm để tới chỗ duyệt. Cần bật cùng Trang Bots.",
      default: false,
    },
    osNotify: {
      type: "boolean",
      label: "Thông báo hệ điều hành",
      description: "Bắn toast hệ điều hành khi có bot chờ duyệt — hiện cả khi cửa sổ BB thu nhỏ (tab phải còn sống); bấm toast để quay lại BB tới chỗ duyệt. Cần bật cùng Trang Bots.",
      default: false,
    },
    botsBackend: {
      type: "boolean",
      label: "Backend bots (thật)",
      description: "Store SQLite + RPC của hagi-bots (hb_*). Chỉ dữ liệu riêng — chưa hook/claim thread nên vẫn an toàn chạy cùng Bots Sidebar.",
      default: false,
    },
    botsRuntime: {
      type: "boolean",
      label: "Runtime bots (thật)",
      description: "Inject SOUL/MEMORY/PLAYBOOK vào agent + tool hbot_read_state/hbot_update_state + thread con kế thừa bot. CHỈ bật sau khi đã TẮT plugin bots-sidebar (bật đôi = agent nhận 2 bộ instructions/tool). Cần bật Backend bots.",
      default: false,
    },
  });

  const store = createHbotStore(bb);
  const publish = () => bb.realtime.publish(CHANGED, { updatedAt: Date.now() });
  // agents.configure là đồng bộ nên cache công tắc; onChange giữ cho cache đúng.
  let runtimeOn = false;
  void settings.get().then((value) => { runtimeOn = value.botsRuntime === true && value.botsBackend === true; });
  settings.onChange((next) => { runtimeOn = next.botsRuntime === true && next.botsBackend === true; });
  registerRuntime(bb, store, () => runtimeOn, publish);
  registerMention(bb, store, () => runtimeOn);
  registerCli(bb, store, () => runtimeOn);
  const backendOn = async () => {
    if ((await settings.get()).botsBackend !== true) throw new Error("Backend hagi-bots đang tắt — bật trong cài đặt plugin");
  };

  bb.rpc.register(rpcContract, {
    hb_bots_list: async () => {
      await backendOn();
      const projects = await bb.sdk.projects.list({ includePersonal: true });
      const owners = store.legacyExtra<{ projectId: string; botId: string }[]>("legacy:project-owners") ?? [];
      const bots = store.list().map((bot) => {
        const linked = store.legacyExtra<{ linkedProjectIds?: string[] }>(bot.id)?.linkedProjectIds ?? [];
        return {
          ...bot,
          projects: linked.map((pid) => ({
            id: pid,
            name: projects.find((project) => project.id === pid)?.name ?? pid,
            role: owners.some((owner) => owner.botId === bot.id && owner.projectId === pid) ? ("owner" as const) : ("member" as const),
          })),
        };
      });
      return { bots, threadBindings: store.bindings(), userMd: store.userMd() };
    },
    hb_bot_get: async ({ botId }) => {
      await backendOn();
      return { bot: store.require(botId), threadIds: store.threadsOf(botId) };
    },
    hb_bot_create: async (input) => {
      await backendOn();
      const bot = store.create({ soul: "", memory: "", playbook: "", ...input });
      publish();
      return bot;
    },
    hb_bot_update: async ({ botId, expectedUpdatedAt, ...fields }) => {
      await backendOn();
      const bot = store.update(botId, expectedUpdatedAt, fields);
      publish();
      return bot;
    },
    hb_bot_delete: async ({ botId }) => {
      await backendOn();
      store.remove(botId);
      publish();
      return { ok: true as const };
    },
    hb_thread_bind: async ({ threadId, botId }) => {
      await backendOn();
      store.bind(threadId, botId);
      publish();
      return { ok: true as const };
    },
    hb_thread_unbind: async ({ threadId }) => {
      await backendOn();
      store.unbind(threadId);
      publish();
      return { ok: true as const };
    },
    hb_conversation_create: async ({ botId, projectId }) => {
      await backendOn();
      if (!runtimeOn) throw new Error("Cần bật Runtime bots để tạo hội thoại thật");
      const bot = store.require(botId);
      const linked = store.legacyExtra<{ linkedProjectIds?: string[] }>(botId)?.linkedProjectIds ?? [];
      const target = projectId ?? (linked.length === 1 ? linked[0] : undefined);
      if (!target) throw new Error(linked.length ? "Bot có nhiều project — chọn một project" : "Bot chưa gắn project nào");
      if (!linked.includes(target)) throw new Error("Project này không thuộc bot");
      const thread = await bb.sdk.threads.spawn({
        projectId: target,
        environment: { type: "project-default" },
        pluginMetadata: { hagiBotId: bot.id },
        prompt: `Hội thoại mới của bot ${bot.name}. Chào ngắn một câu rồi chờ yêu cầu của người dùng.`,
      });
      store.bind(thread.id, bot.id);
      publish();
      return { threadId: thread.id };
    },
    hb_user_md_set: async ({ content }) => {
      await backendOn();
      store.setUserMd(content);
      publish();
      return { ok: true as const };
    },
    hb_episode_add: async ({ botId, threadId, text }) => {
      await backendOn();
      const episode = store.addEpisode(botId, threadId ?? null, text);
      publish();
      return episode;
    },
    hb_episodes_list: async ({ botId }) => {
      await backendOn();
      return { episodes: store.episodes(botId) };
    },
    hb_import_preview: async () => {
      await backendOn();
      const scan = legacyPreview(bb, store);
      return {
        found: scan.found,
        error: scan.error,
        bots: scan.bots.map((bot) => ({
          id: bot.id,
          name: bot.name,
          role: bot.role,
          color: bot.color,
          shape: bot.shape,
          soulChars: bot.soul.length,
          memoryChars: bot.memory.length,
          threadCount: bot.threadCount,
          issues: bot.issues,
          already: bot.already,
        })),
        bindingCount: scan.bindingCount,
        sectionCount: scan.sectionCount,
        ownerCount: scan.ownerCount,
      };
    },
    hb_import_apply: async () => {
      await backendOn();
      const result = legacyApply(bb, store);
      publish();
      return result;
    },
  });
}
