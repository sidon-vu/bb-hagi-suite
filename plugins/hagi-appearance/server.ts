import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { z } from "zod";

export default async function plugin(bb: BbPluginApi) {
  bb.log.info("loaded");
  // Mỗi tính năng = một công tắc boolean, mặc định tắt. Ghi vào catalog/hagi-appearance.md.
  // Ô số: 0 = theo preset. Giá trị preset nằm trong features/presets.ts (đồng bộ với mô tả dưới đây).
  const num = (label: string, max: number) => ({
    type: "number" as const,
    label,
    default: 0,
    experimental_schema: z.number().int().min(0).max(max),
  });
  bb.settings.define({
    preset: {
      type: "select",
      label: "Preset giao diện: compact (gọn) / comfortable (vừa) / wide (rộng)",
      default: "comfortable",
      options: ["compact", "comfortable", "wide"],
    },
    chatWidthEnabled: { type: "boolean", label: "Chỉnh độ rộng khung chat", default: false },
    chatWidthPercent: num("Độ rộng chat theo % khung. 0 = theo preset (gọn 60, vừa 72, rộng 88)", 100),
    chatWidthMaxRem: num("Giới hạn tối đa của chat, đơn vị rem (1rem ≈ 1 cỡ chữ). 0 = theo preset (56 / 72 / 96)", 200),
    fontScaleEnabled: { type: "boolean", label: "Cỡ chữ co giãn theo màn hình", default: false },
    fontScalePercent: num("Cỡ chữ %. 0 = theo preset (92 / 100 / 108)", 150),
  });
}
