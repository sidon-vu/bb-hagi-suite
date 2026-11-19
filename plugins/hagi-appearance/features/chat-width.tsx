import { useEffect } from "react";
import { useAppearance } from "./presets";
import "./chat-width.css";

// Chạy khi công tắc bật; tắt hoặc gỡ plugin thì dọn sạch thuộc tính trên <html>.
export function ChatWidth() {
  const { chatOn, chatPercent, chatMaxRem } = useAppearance();
  // % tính theo khung chứa chat (đã trừ sidebar), kẹp bởi giới hạn rem (theo cỡ chữ).
  const width = `min(${chatPercent}%, ${chatMaxRem}rem)`;

  useEffect(() => {
    if (!chatOn) return;
    const root = document.documentElement;
    root.setAttribute("data-hagi-chat-width", "");
    root.style.setProperty("--hagi-chat-width", width);
    return () => {
      root.removeAttribute("data-hagi-chat-width");
      root.style.removeProperty("--hagi-chat-width");
    };
  }, [chatOn, width]);

  return null;
}
