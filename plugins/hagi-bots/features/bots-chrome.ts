import type { PluginNavPanelProps } from "@get-bb/plugin-sdk/app";
import { countWaitingThreads, useBots } from "./mock-store";
import { parseSubPath } from "./routes";

// Tiêu đề cửa sổ/thanh tiêu đề của trang Bots theo subPath.
export function useBotsPageTitle({ subPath }: PluginNavPanelProps): { title: string } | null {
  const bots = useBots();
  const { botId } = parseSubPath(subPath);
  const bot = botId ? bots.find((entry) => entry.id === botId) : null;
  if (!botId) return { title: "Bots" };
  return bot ? { title: `Bots · ${bot.name}` } : null;
}

// Badge trên mục điều hướng: số thread đang CHỜ input — con số đáng hành động.
export function useBotsBadge(): { count: number; label: string; tone: "warning" } | null {
  const bots = useBots();
  const waiting = countWaitingThreads(bots);
  if (!waiting) return null;
  return { count: waiting, tone: "warning", label: `${waiting} thread chờ input` };
}
