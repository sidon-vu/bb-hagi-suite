import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { z } from "zod";

export default async function plugin(bb: BbPluginApi) {
  bb.log.info("loaded");
  // Mỗi tính năng = một công tắc boolean, mặc định tắt. Ghi vào catalog/hagi-appearance.md.
  bb.settings.define({
    chatWidthEnabled: { type: "boolean", label: "Chỉnh độ rộng khung chat", default: false },
    chatWidth: {
      type: "number",
      label: "Độ rộng tối đa của khung chat (px)",
      default: 1040,
      experimental_schema: z.number().int().min(480).max(2000),
    },
  });
}
