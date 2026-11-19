import { useEffect } from "react";

const FIELD = 'textarea, [contenteditable="true"], [contenteditable=""], .ProseMirror';
const MARK = "data-hagi-composer-surface";

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

// Chỉ gắn nhãn `data-hagi-composer-surface` lên khung ô nhập; màu do theme (hagi-amber.css) đặt.
// Không có theme dùng nhãn này thì không có gì thay đổi, nên không cần công tắc.
export function ComposerSurface() {
  useEffect(() => {
    let current: HTMLElement | null = null;
    const release = () => current?.removeAttribute(MARK);
    const apply = () => {
      const next = findSurface();
      if (next !== current) {
        release();
        current = next;
      }
      current?.setAttribute(MARK, "");
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
  }, []);

  return null;
}
