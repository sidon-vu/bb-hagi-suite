import { useEffect, useMemo, useRef } from "react";
import { useBbNavigate, useSettings } from "@get-bb/plugin-sdk/app";
import { AnimatePresence, motion } from "motion/react";
import { BotAvatar } from "./bot-avatar";
import { botStatus, useBots, type MockBot, type MockThread } from "./mock-store";

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

// OS toast qua Web Notification: hiện cả khi cửa sổ BB thu nhỏ (tab còn sống).
// Mock: onclick mở trang bot; backend thật sẽ navigate.toThread(threadId).
function useOsNotify(enabled: boolean, items: WaitingItem[], navigate: ReturnType<typeof useBbNavigate>) {
  const notified = useRef(new Set<string>());
  const ids = items.map((item) => item.thread.id).join(",");

  useEffect(() => {
    if (!enabled || typeof Notification === "undefined") return;
    for (const id of notified.current) {
      if (!ids.split(",").includes(id)) notified.current.delete(id);
    }
    const fresh = items.filter((item) => !notified.current.has(item.thread.id));
    if (fresh.length === 0) return;
    if (Notification.permission === "default") {
      void Notification.requestPermission();
      return;
    }
    if (Notification.permission !== "granted") return;
    for (const { bot, thread } of fresh) {
      notified.current.add(thread.id);
      const toast = new Notification(`${bot.name} cần duyệt`, { body: thread.title, tag: `hagi-bot-${thread.id}` });
      toast.onclick = () => {
        window.focus();
        navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}/threads/${thread.id}` });
      };
    }
    // items phụ thuộc ids; navigate/toast.onclick ổn định đủ cho mock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ids]);
}

// Thẻ nổi toàn app báo bot đang chờ duyệt — ý tưởng đã chốt trong catalog.
// Mock: bấm mở trang chi tiết bot; backend thật sẽ navigate.toThread(threadId).
export function AttentionDock() {
  const { values, isLoading } = useSettings();
  const navigate = useBbNavigate();
  const bots = useBots();

  const enabled = !isLoading && values?.botsPanel === true;
  const items = useMemo<WaitingItem[]>(
    () => (enabled ? bots.flatMap((bot) => waitingThreads(bot).map((thread) => ({ bot, thread }))) : []),
    [enabled, bots],
  );
  useOsNotify(enabled && values?.osNotify === true, items, navigate);

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
            onClick={() => navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}/threads/${thread.id}` })}
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
