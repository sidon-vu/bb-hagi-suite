import { definePluginApp } from "@get-bb/plugin-sdk/app";
import { BotsPage } from "./features/bots-page";
import { BotsPanelNav } from "./features/bots-nav";
import { useBotsBadge, useBotsPageTitle } from "./features/bots-chrome";
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
});
