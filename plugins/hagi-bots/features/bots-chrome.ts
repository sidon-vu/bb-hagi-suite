import type { PluginNavPanelProps } from "@get-bb/plugin-sdk/app";
import { useBots } from "./mock-store";
import { parseSubPath } from "./routes";

// Tiêu đề cửa sổ/thanh tiêu đề của trang Bots theo subPath.
export function useBotsPageTitle({ subPath }: PluginNavPanelProps): { title: string } | null {
  const bots = useBots();
  const { botId } = parseSubPath(subPath);
  const bot = botId ? bots.find((entry) => entry.id === botId) : null;
  if (!botId) return { title: "Bots" };
  return bot ? { title: `Bots · ${bot.name}` } : null;
}

// Badge trên mục điều hướng: số bot (dữ liệu giả).
export function useBotsBadge(): { count: number; label: string } | null {
  const bots = useBots();
  if (!bots.length) return null;
  return { count: bots.length, label: `${bots.length} bot` };
}
