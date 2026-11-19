import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { z } from "zod";

export default async function plugin(bb: BbPluginApi) {
  bb.log.info("loaded");
  // Mỗi tính năng = một công tắc boolean, mặc định tắt. Ghi vào catalog/hagi-appearance.md.
  bb.settings.define({
    chatWidthEnabled: { type: "boolean", label: "Chỉnh độ rộng khung chat", default: false },
    chatWidthMode: {
      type: "select",
      label: "Cách tính độ rộng khung chat (percent hoặc px)",
      default: "percent",
      options: ["percent", "px"], // percent = % khung có kẹp tối đa theo chatWidth; px = cố định
    },
    chatWidth: {
      type: "number",
      label: "Độ rộng khi chọn px, hoặc giới hạn tối đa khi chọn % (px)",
      default: 1040,
      experimental_schema: z.number().int().min(480).max(3000),
    },
    chatWidthPercent: {
      type: "number",
      label: "Độ rộng theo % khung (chỉ dùng khi chọn %)",
      default: 70,
      experimental_schema: z.number().int().min(30).max(100),
    },
  });
}
