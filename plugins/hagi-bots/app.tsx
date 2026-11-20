import { definePluginApp } from "@get-bb/plugin-sdk/app";
import { BotsPage } from "./features/bots-page";
import { BotsPanelNav } from "./features/bots-nav";
import { useBotsBadge, useBotsPageTitle } from "./features/bots-chrome";
import { AttentionDock } from "./features/attention-dock";
import "./features/bots.css";

export default definePluginApp((app) => {
  // Bên ngoài chỉ một mục "Bots" trong điều hướng; cột trái + nội dung sống trong trang.
  app.slots.navPanel({
    id: "bots",
    title: "Bots",
    icon: "Bot",
    path: "bots",
    component: BotsPage,
    experimental_sidebar: BotsPanelNav,
    experimental_usePageTitle: useBotsPageTitle,
    experimental_useBadge: useBotsBadge,
  });

  // Thẻ nổi báo bot chờ duyệt, hiện trên toàn app (bật qua công tắc attentionDock).
  app.slots.experimental_appOverlay({ id: "attention-dock", component: AttentionDock });
});
