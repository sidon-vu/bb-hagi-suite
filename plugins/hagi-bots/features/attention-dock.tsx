import { useBbNavigate, useSettings } from "@get-bb/plugin-sdk/app";
import { AnimatePresence, motion } from "motion/react";
import { BotAvatar } from "./bot-avatar";
import { botStatus, useBots, type MockBot, type MockThread } from "./mock-store";

function waitingThreads(bot: MockBot): MockThread[] {
  return bot.threads.flatMap((thread) => [
    ...(thread.status === "waiting" ? [thread] : []),
    ...(thread.children?.filter((child) => child.status === "waiting") ?? []),
  ]);
}

// Thẻ nổi toàn app báo bot đang chờ duyệt — ý tưởng đã chốt trong catalog.
// Mock: bấm mở trang chi tiết bot; backend thật sẽ navigate.toThread(threadId).
export function AttentionDock() {
  const { values, isLoading } = useSettings();
  const navigate = useBbNavigate();
  const bots = useBots();

  if (isLoading || values?.botsPanel !== true || values?.attentionDock !== true) return null;

  const items = bots.flatMap((bot) => waitingThreads(bot).map((thread) => ({ bot, thread })));
  if (items.length === 0) return null;

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
