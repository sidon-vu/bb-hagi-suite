import { useEffect } from "react";
import { useSettings } from "@get-bb/plugin-sdk/app";
import "./chat-width.css";

// Chạy khi công tắc bật; tắt hoặc gỡ plugin thì dọn sạch thuộc tính trên <html>.
export function ChatWidth() {
  const { values } = useSettings();
  const on = values?.chatWidthEnabled === true;
  const width = Number(values?.chatWidth) || 1040;

  useEffect(() => {
    if (!on) return;
    const root = document.documentElement;
    root.setAttribute("data-hagi-chat-width", "");
    root.style.setProperty("--hagi-chat-width", `${width}px`);
    return () => {
      root.removeAttribute("data-hagi-chat-width");
      root.style.removeProperty("--hagi-chat-width");
    };
  }, [on, width]);

  return null;
}
