import { createHash } from "node:crypto";
import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { z } from "zod";
import type { HbotStore } from "./bot-store";
import type { HbotMetadata } from "./hagi-contract";

// Runtime hagi-bots (bước 4a): inject SOUL/MEMORY/PLAYBOOK/USER.md vào agent, 2 tool ghi bộ nhớ,
// kế thừa bot từ thread cha. Viết lại theo ý tưởng — KHÔNG sao chép mã bots-sidebar (repo gốc không có LICENSE).
// KHÔNG tự claim thread mới theo project (đó là chỗ 2 plugin đánh nhau) — chỉ kế thừa từ thread cha/nguồn.

export const MEMORY_LIMIT = 3000; // ký tự — cùng quy ước bản gốc
const DYNAMIC_MAX = 4096; // trần PluginAgentConfiguration.instructions
const sha = (text: string) => createHash("sha256").update(text).digest("hex");

const GUIDANCE = [
  "Danh tính và bộ nhớ của bạn do BB quản lý riêng, KHÔNG phải file trong thư mục làm việc. Đừng tạo SOUL.md/MEMORY.md trong project.",
  "Đọc bằng hbot_read_state (target: identity | memory | playbook | user). Ghi bằng hbot_update_state: memory/append (1 dòng sự thật), memory/overwrite (cần sha256 vừa đọc), playbook/overwrite, episode/add (1-2 dòng sau khi xong việc).",
  `MEMORY tối đa ${MEMORY_LIMIT} ký tự. Nếu đầy: đọc lại, cô đọng, rồi overwrite kèm sha256 mới đọc. Ghi xung đột thì đọc lại rồi gộp — không ghi đè bằng bản cũ. Không lưu mật khẩu/token.`,
  "AGENTS.md của project vẫn có hiệu lực; sở thích của bot không ghi đè yêu cầu project.",
].join("\n\n");

const readSchema = z.object({ target: z.enum(["identity", "memory", "playbook", "user"]) }).strict();
// z.union, không phải discriminatedUnion: 2 nhánh memory cùng literal "memory" làm Zod ném "Duplicate discriminator".
export const updateSchema = z.union([
  z.object({ target: z.literal("memory"), action: z.literal("append"), fact: z.string().trim().min(1).max(300).regex(/^[^\n]+$/, "một dòng") }).strict(),
  z.object({ target: z.literal("memory"), action: z.literal("overwrite"), content: z.string().max(MEMORY_LIMIT), expectedSha256: z.string() }).strict(),
  z.object({ target: z.literal("playbook"), action: z.literal("overwrite"), content: z.string().max(4096), expectedSha256: z.string() }).strict(),
  z.object({ target: z.literal("episode"), action: z.literal("add"), text: z.string().trim().min(1).max(500) }).strict(),
]);
// Tool parameters phải là object phẳng; kiểm chặt bằng updateSchema trong execute.
const updateToolSchema = z.object({
  target: z.enum(["memory", "playbook", "episode"]),
  action: z.enum(["append", "overwrite", "add"]),
  fact: z.string().optional(),
  content: z.string().optional(),
  expectedSha256: z.string().optional(),
  text: z.string().optional(),
});

const CUT = "\n[Cắt bớt — dùng hbot_read_state để xem đủ]";
const excerpt = (text: string, budget: number) => (budget <= 0 ? "" : text.length <= budget ? text : budget <= CUT.length ? text.slice(0, budget) : text.slice(0, budget - CUT.length) + CUT);

export function buildInstructions(bot: HbotMetadata, userMd: string): string {
  const head = `# Bot: ${bot.name.slice(0, 120)}\nBot ID: ${bot.id}\nVai trò: ${bot.role.slice(0, 80)}\n\n## Danh tính (SOUL)\n`;
  const memory = `\n\n## Bộ nhớ (MEMORY)\n${excerpt(bot.memory, MEMORY_LIMIT)}`;
  const rest = DYNAMIC_MAX - head.length - memory.length;
  const soul = excerpt(bot.soul, Math.min(1300, rest));
  const left = rest - soul.length;
  const extras = [
    bot.playbook && left > 120 ? `\n\n## Playbook\n${excerpt(bot.playbook, Math.min(700, left - 20))}` : "",
  ].join("");
  const user = userMd && DYNAMIC_MAX - head.length - memory.length - soul.length - extras.length > 80
    ? `\n\n## Người dùng (USER.md)\n${excerpt(userMd, DYNAMIC_MAX - head.length - memory.length - soul.length - extras.length - 30)}` : "";
  return head + soul + memory + extras + user;
}

export function registerRuntime(bb: BbPluginApi, store: HbotStore, isOn: () => boolean, publish: () => void) {
  const inherited = (ctx: { id: string; parentThreadId?: string | null; sourceThreadId?: string | null }) =>
    store.owner(ctx.id) ?? (ctx.parentThreadId && store.owner(ctx.parentThreadId)) ?? (ctx.sourceThreadId && store.owner(ctx.sourceThreadId)) ?? null;

  bb.agents.configure((ctx) => {
    if (!isOn()) return { tools: [], skills: [] };
    let botId = inherited(ctx.thread);
    // Thread do hb_conversation_create tạo: gán ngay lượt đầu (tránh chạy đua với bind sau spawn). shortcut: metadata do agent ghi được, chỉ chấp nhận khi bot tồn tại.
    const hint = ctx.pluginMetadata?.hagiBotId;
    if (!botId && typeof hint === "string" && store.get(hint)) { store.bind(ctx.thread.id, hint); botId = hint; }
    const bot = botId ? store.get(botId) : null; // hàng hỏng → null, không ném (đúng lỗi của bản cũ)
    return bot ? { tools: ["hbot_read_state", "hbot_update_state"], skills: [], instructions: buildInstructions(bot, store.userMd()) } : { tools: [], skills: [] };
  });

  const ownerOf = async (threadId: string) => {
    if (!isOn()) throw new Error("Runtime hagi-bots đang tắt");
    const thread = await bb.sdk.threads.get({ threadId });
    const botId = inherited({ id: threadId, parentThreadId: thread.parentThreadId, sourceThreadId: thread.sourceThreadId });
    if (!botId) throw new Error("Hội thoại này chưa gán cho bot nào");
    return store.require(botId);
  };

  bb.agents.registerTool({
    name: "hbot_read_state",
    description: "Đọc danh tính/bộ nhớ riêng của bot này: identity (tên, vai trò, SOUL + revision), memory (+sha256), playbook (+sha256), user (USER.md chung).",
    instructions: GUIDANCE,
    parameters: readSchema,
    execute: async ({ target }, ctx) => {
      const bot = await ownerOf(ctx.threadId);
      const doc = (content: string) => ({ content, sha256: sha(content), characters: content.length });
      if (target === "identity") return JSON.stringify({ botId: bot.id, name: bot.name, role: bot.role, soul: bot.soul, revision: bot.updatedAt });
      if (target === "memory") return JSON.stringify({ botId: bot.id, ...doc(bot.memory), maxCharacters: MEMORY_LIMIT });
      if (target === "playbook") return JSON.stringify({ botId: bot.id, ...doc(bot.playbook) });
      return JSON.stringify({ botId: bot.id, ...doc(store.userMd()) });
    },
  });

  bb.agents.registerTool({
    name: "hbot_update_state",
    description: "Ghi bền vào bộ nhớ của bot này. memory/append {fact: 1 dòng}; memory/overwrite {content, expectedSha256}; playbook/overwrite {content, expectedSha256}; episode/add {text}. Sha cũ → lỗi, đọc lại rồi gộp.",
    parameters: updateToolSchema,
    execute: async (raw, ctx) => {
      const change = updateSchema.parse(raw);
      const bot = await ownerOf(ctx.threadId);
      if (change.target === "episode") {
        const episode = store.addEpisode(bot.id, ctx.threadId, change.text);
        publish();
        return JSON.stringify({ ok: true, episodeId: episode.id });
      }
      const field = change.target; // "memory" | "playbook"
      const current = bot[field];
      let next: string;
      if (change.action === "append") {
        if (current.split("\n").includes(change.fact)) return JSON.stringify({ ok: true, changed: false });
        next = current ? `${current}\n${change.fact}` : change.fact;
        if (next.length > MEMORY_LIMIT) throw new Error(`MEMORY vượt ${MEMORY_LIMIT} ký tự — đọc, cô đọng, rồi memory/overwrite kèm sha256`);
      } else {
        if (sha(current) !== change.expectedSha256) throw new Error("Nội dung đã đổi — đọc lại bằng hbot_read_state rồi gộp trước khi ghi");
        next = change.content;
      }
      if (next === current) return JSON.stringify({ ok: true, changed: false });
      const saved = store.update(bot.id, bot.updatedAt, { [field]: next });
      publish();
      return JSON.stringify({ ok: true, changed: true, sha256: sha(saved[field]), revision: saved.updatedAt });
    },
  });

  // Chỉ kế thừa: thread con/fork của thread đã thuộc bot → gán cùng bot. Không claim theo project.
  // Ngoại lệ DUY NHẤT cho "không claim theo project": người dùng vừa bấm « Hội thoại mới » trong trang Bots
  // (mở New thread gốc của BB) → thread top-level đầu tiên của project đó trong 10 phút được gắn bot, một lần.
  // shortcut: chỉ 1 chờ mỗi project, nằm trong bộ nhớ (mất khi plugin khởi động lại), không phân biệt thread tay/thread plugin.
  const WAIT_MS = 10 * 60 * 1000;
  const pending = new Map<string, { botId: string; at: number }>();
  bb.events.on("thread.created", async ({ thread }) => {
    if (!isOn() || store.owner(thread.id)) return;
    const parentBot = (thread.parentThreadId && store.owner(thread.parentThreadId)) || (thread.sourceThreadId && store.owner(thread.sourceThreadId)) || null;
    if (parentBot && store.get(parentBot)) { store.bind(thread.id, parentBot); publish(); return; }
    if (thread.parentThreadId || thread.sourceThreadId) return;
    const wait = pending.get(thread.projectId);
    if (!wait) return;
    pending.delete(thread.projectId);
    if (Date.now() - wait.at < WAIT_MS && store.get(wait.botId)) { store.bind(thread.id, wait.botId); publish(); }
  });
  return {
    expectNewThread(botId: string, projectId: string) { pending.set(projectId, { botId, at: Date.now() }); },
  };
}
