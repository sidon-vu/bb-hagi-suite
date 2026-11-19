import { useSettings } from "@get-bb/plugin-sdk/app";

// Preset chỉ đặt sẵn TỶ LỆ, không đặt px cố định, để giao diện co giãn theo màn hình và khung BB.
// Mỗi ô riêng trong Settings: 0 = theo preset, khác 0 = ghi đè đúng ô đó.
export const PRESETS = {
  compact: { chatPercent: 60, chatMaxRem: 56, fontPercent: 92 },
  comfortable: { chatPercent: 72, chatMaxRem: 72, fontPercent: 100 },
  wide: { chatPercent: 88, chatMaxRem: 96, fontPercent: 108 },
} as const;

export type PresetName = keyof typeof PRESETS;

export function useAppearance() {
  const { values } = useSettings();
  const name = (values?.preset as PresetName) in PRESETS ? (values?.preset as PresetName) : "comfortable";
  const p = PRESETS[name];
  // Ô = 0 hoặc trống thì dùng giá trị của preset.
  const pick = (key: string, fallback: number) => Number(values?.[key]) || fallback;
  return {
    chatOn: values?.chatWidthEnabled === true,
    fontOn: values?.fontScaleEnabled === true,
    chatPercent: pick("chatWidthPercent", p.chatPercent),
    chatMaxRem: pick("chatWidthMaxRem", p.chatMaxRem),
    fontPercent: pick("fontScalePercent", p.fontPercent),
  };
}
