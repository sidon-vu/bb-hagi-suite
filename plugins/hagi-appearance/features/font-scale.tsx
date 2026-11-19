import { useEffect } from "react";
import { useAppearance } from "./presets";

// Cỡ chữ gốc co giãn theo chiều rộng cửa sổ: nhỏ ở màn hẹp, to dần ở màn rộng, kẹp ±15%.
// Mọi thứ tính bằng rem trong BB sẽ đổi theo. shortcut: ảnh hưởng cả UI, chưa tách riêng khung chat.
export function FontScale() {
  const { fontOn, fontPercent } = useAppearance();
  const s = fontPercent / 100;
  const size = `clamp(${(14.4 * s).toFixed(2)}px, calc((12px + 0.25vw) * ${s}), ${(18.4 * s).toFixed(2)}px)`;

  useEffect(() => {
    if (!fontOn) return;
    const root = document.documentElement;
    const prev = root.style.fontSize;
    root.style.fontSize = size;
    return () => {
      root.style.fontSize = prev;
    };
  }, [fontOn, size]);

  return null;
}
