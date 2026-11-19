import { useEffect } from "react";
import { useSettings } from "@get-bb/plugin-sdk/app";
import "./chat-width.css";

// Chạy khi công tắc bật; tắt hoặc gỡ plugin thì dọn sạch thuộc tính trên <html>.
export function ChatWidth() {
  const { values } = useSettings();
  const on = values?.chatWidthEnabled === true;
  const px = Number(values?.chatWidth) || 1040;
  const pct = Number(values?.chatWidthPercent) || 70;
  // % tính theo khung chứa chat (đã trừ sidebar), kẹp bởi giới hạn px.
  const width = values?.chatWidthMode === "px" ? `${px}px` : `min(${pct}%, ${px}px)`;

  useEffect(() => {
    if (!on) return;
    const root = document.documentElement;
    root.setAttribute("data-hagi-chat-width", "");
    root.style.setProperty("--hagi-chat-width", width);
    return () => {
      root.removeAttribute("data-hagi-chat-width");
      root.style.removeProperty("--hagi-chat-width");
    };
  }, [on, width]);

  return null;
}
