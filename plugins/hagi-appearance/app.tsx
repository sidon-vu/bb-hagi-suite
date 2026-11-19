import { definePluginApp } from "@get-bb/plugin-sdk/app";
import { ChatWidth } from "./features/chat-width";
import { FontScale } from "./features/font-scale";

export default definePluginApp((app) => {
  // Mỗi tính năng tự đọc công tắc của nó trong component; tắt thì không làm gì.
  app.slots.experimental_appOverlay({ id: "chat-width", component: ChatWidth });
  app.slots.experimental_appOverlay({ id: "font-scale", component: FontScale });
});
