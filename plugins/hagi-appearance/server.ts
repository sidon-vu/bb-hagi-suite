import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { z } from "zod";

export default async function plugin(bb: BbPluginApi) {
  bb.log.info("loaded");
  // Mỗi tính năng = một công tắc boolean, mặc định tắt. Ghi vào catalog/hagi-appearance.md.
  // Ô số: 0 = theo preset. Giá trị preset nằm trong features/presets.ts (đồng bộ với mô tả dưới đây).
  const num = (label: string, description: string, max: number) => ({
    type: "number" as const,
    label,
    description,
    default: 0,
    experimental_schema: z.number().int().min(0).max(max),
  });
  bb.settings.define({
    preset: {
      type: "select",
      label: "Preset giao diện",
      description: "Bộ số có sẵn. Chỉ có tác dụng khi bật công tắc bên dưới.",
      default: "comfortable",
      options: ["compact", "comfortable", "wide"],
      experimental_optionLabels: {
        compact: "Gọn (chat 60%, chữ 92%)",
        comfortable: "Vừa (chat 72%, chữ 100%)",
        wide: "Rộng (chat 88%, chữ 108%)",
      },
    },
    chatWidthEnabled: {
      type: "boolean",
      label: "Chỉnh độ rộng khung chat",
      description: "Tắt = BB giữ nguyên. Chỉ áp dụng khi màn hình từ 768px.",
      default: false,
    },
    chatWidthPercent: num("Độ rộng chat (% khung)", "0 = theo preset. Nhập 1-100 để ghi đè.", 100),
    chatWidthMaxRem: num(
      "Chat rộng tối đa (rem)",
      "0 = theo preset (56 / 72 / 96). 1 rem ≈ 1 cỡ chữ, nhập 80 ≈ 1280px.",
      200,
    ),
    fontScaleEnabled: {
      type: "boolean",
      label: "Cỡ chữ co giãn theo màn hình",
      description: "Chữ to dần khi cửa sổ rộng, nhỏ lại khi hẹp (±15%). Tắt = BB giữ nguyên.",
      default: false,
    },
    composerBgEnabled: {
      type: "boolean",
      label: "Đổi nền ô nhập tin nhắn",
      description: "Tắt = BB giữ nguyên. Plugin tự dò khung quanh ô gõ rồi đặt màu bên dưới.",
      default: false,
    },
    composerBgColor: {
      type: "string",
      label: "Màu nền ô nhập tin nhắn",
      description: "Mã hex, ví dụ #1a1815.",
      default: "#1a1815",
      experimental_schema: z.string().regex(/^#[0-9a-fA-F]{3,8}$/),
    },
    fontScalePercent: num("Cỡ chữ (%)", "0 = theo preset (92 / 100 / 108). Nhập 110 = to hơn 10%.", 150),
  });
}
