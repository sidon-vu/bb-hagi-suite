import { useEffect } from "react";
import { useSettings } from "@get-bb/plugin-sdk/app";

const FIELD = 'textarea, [contenteditable="true"], [contenteditable=""], .ProseMirror';
const HEX = /^#[0-9a-fA-F]{3,8}$/;

// Tìm khung có viền bo góc bao quanh ô gõ tin nhắn (không biết tên class của BB nên dò từ ô gõ đi lên).
function findSurface(): HTMLElement | null {
  const shell = document.querySelector<HTMLElement>('[data-app-composer-role="primary"]');
  const field = shell?.querySelector<HTMLElement>(FIELD);
  if (!shell || !field) return null;
  let fallback: HTMLElement | null = null;
  for (let el = field.parentElement; el && el !== shell; el = el.parentElement) {
    const cs = getComputedStyle(el);
    const bordered = parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderTopLeftRadius) > 0;
    if (bordered) return el;
    if (!fallback && cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") fallback = el;
  }
  return fallback;
}

// Chạy khi công tắc bật; tắt hoặc gỡ plugin thì trả lại màu gốc.
export function ComposerSurface() {
  const { values } = useSettings();
  const raw = String(values?.composerBgColor ?? "");
  const color = HEX.test(raw) ? raw : "#1a1815";
  const on = values?.composerBgEnabled === true;

  useEffect(() => {
    if (!on) return;
    let current: HTMLElement | null = null;
    const release = () => current?.style.removeProperty("background-color");
    const apply = () => {
      const next = findSurface();
      if (next !== current) {
        release();
        current = next;
      }
      current?.style.setProperty("background-color", color, "important");
    };
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };
    apply();
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(frame);
      release();
    };
  }, [on, color]);

  return null;
}
