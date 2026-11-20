import { useEffect, useMemo, useRef } from "react";
import { useBbNavigate, useSettings } from "@get-bb/plugin-sdk/app";
import { AnimatePresence, motion } from "motion/react";
import { BotAvatar } from "./bot-avatar";
import { botStatus, type MockBot, type MockThread } from "./mock-store";
import { useDataBots } from "./live-store";

interface WaitingItem {
  bot: MockBot;
  thread: MockThread;
}

function waitingThreads(bot: MockBot): MockThread[] {
  return bot.threads.flatMap((thread) => [
    ...(thread.status === "waiting" ? [thread] : []),
    ...(thread.children?.filter((child) => child.status === "waiting") ?? []),
  ]);
}

// Icon OS toast = avatar bot render sang PNG (SVG -> canvas), cache theo bot+trạng thái.
const FACE_PATHS: Record<string, string> = {
  working: '<circle cx="8" cy="10" r="1.6" fill="#fff" stroke="none"/><circle cx="16" cy="10" r="1.6" fill="#fff" stroke="none"/><path d="M8 16h8"/>',
  waiting: '<circle cx="8" cy="9.5" r="1.8"/><circle cx="16" cy="9.5" r="1.8"/><circle cx="12" cy="16.5" r="1.4" fill="#fff" stroke="none"/>',
  idle: '<path d="M6.4 10c.8 1.3 2.4 1.3 3.2 0"/><path d="M14.4 10c.8 1.3 2.4 1.3 3.2 0"/><circle cx="12" cy="15.5" r="1" fill="#fff" stroke="none"/>',
};
const SHAPE_CLIP: Record<MockBot["shape"], string> = {
  round: '<circle cx="64" cy="64" r="64"/>',
  square: '<rect width="128" height="128" rx="27"/>',
  hex: '<polygon points="32,6.4 96,6.4 128,64 96,121.6 32,121.6 0,64"/>',
};
const iconCache = new Map<string, Promise<string | undefined>>();

function avatarIconUrl(bot: MockBot): Promise<string | undefined> {
  const status = botStatus(bot);
  const key = `${bot.id}:${bot.color}:${bot.shape}:${status}`;
  const cached = iconCache.get(key);
  if (cached) return cached;
  const task = (async () => {
    try {
      const ring = status === "waiting" ? `<g fill="none" stroke="#fbbf24" stroke-width="8">${SHAPE_CLIP[bot.shape]}</g>` : "";
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
        `<defs><clipPath id="c">${SHAPE_CLIP[bot.shape]}</clipPath></defs>` +
        `<rect width="128" height="128" fill="${bot.color}" clip-path="url(#c)"/>` +
        `<g clip-path="url(#c)">${ring}</g>` +
        `<g transform="translate(19.2 19.2) scale(3.733)" clip-path="url(#c)">` +
        `<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">${FACE_PATHS[status]}</g></g></svg>`;
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("avatar icon"));
        image.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      canvas.getContext("2d")!.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);
      return canvas.toDataURL("image/png");
    } catch {
      return undefined;
    }
  })();
  iconCache.set(key, task);
  return task;
}

// OS toast qua Web Notification: hiện cả khi cửa sổ BB thu nhỏ (tab còn sống).
// Live → navigate.toThread(threadId) tới chỗ duyệt thật; mock → trang chi tiết bot.
function useOsNotify(enabled: boolean, live: boolean, items: WaitingItem[], navigate: ReturnType<typeof useBbNavigate>) {
  const notified = useRef(new Set<string>());
  const ids = items.map((item) => item.thread.id).join(",");

  const fire = (bot: MockBot, thread: MockThread) => {
    void avatarIconUrl(bot).then((icon) => {
      const toast = new Notification(`${bot.name} cần duyệt`, { body: thread.title, tag: `hagi-bot-${thread.id}`, ...(icon ? { icon } : {}) });
      toast.onclick = () => {
        window.focus();
        if (live) navigate.toThread(thread.id);
        else navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}/threads/${thread.id}` });
      };
    });
  };

  useEffect(() => {
    if (!enabled || typeof Notification === "undefined") return;
    for (const id of notified.current) {
      if (!ids.split(",").includes(id)) notified.current.delete(id);
    }
    const fresh = items.filter((item) => !notified.current.has(item.thread.id));
    if (fresh.length === 0) return;
    if (Notification.permission === "default") {
      void Notification.requestPermission().then((permission) => {
        if (permission !== "granted") return;
        for (const { bot, thread } of fresh) {
          notified.current.add(thread.id);
          fire(bot, thread);
        }
      });
      return;
    }
    if (Notification.permission !== "granted") return;
    for (const { bot, thread } of fresh) {
      notified.current.add(thread.id);
      fire(bot, thread);
    }
    // items phụ thuộc ids; navigate/toast.onclick ổn định đủ cho mock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ids]);
}

// Thẻ nổi toàn app báo bot đang chờ duyệt — ý tưởng đã chốt trong catalog.
// Live → toThread(threadId); mock → trang chi tiết bot.
export function AttentionDock() {
  const { values, isLoading } = useSettings();
  const navigate = useBbNavigate();
  const { bots, live } = useDataBots();

  const enabled = !isLoading && values?.botsPanel === true;
  const items = useMemo<WaitingItem[]>(
    () => (enabled ? bots.flatMap((bot) => waitingThreads(bot).map((thread) => ({ bot, thread }))) : []),
    [enabled, bots],
  );
  useOsNotify(enabled && values?.osNotify === true, live, items, navigate);

  if (!enabled || values?.attentionDock !== true || items.length === 0) return null;

  return (
    <div className="hagi-attention">
      <AnimatePresence>
        {items.map(({ bot, thread }) => (
          <motion.button
            key={thread.id}
            type="button"
            className="hagi-attention__card"
            data-status={botStatus(bot)}
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            onClick={() =>
              live ? navigate.toThread(thread.id) : navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}/threads/${thread.id}` })
            }
          >
            <BotAvatar bot={bot} size={32} />
            <span className="hagi-attention__text">
              <strong>{bot.name}</strong>
              <small>{thread.title}</small>
            </span>
            <span className="hagi-attention__cta">Cần duyệt</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
