import type { BbPluginApi } from "@get-bb/plugin-sdk";

export default async function plugin(bb: BbPluginApi) {
  bb.log.info("loaded");
  // Mỗi tính năng = một công tắc boolean, mặc định tắt. Ghi vào catalog/hagi-bots.md.
  // Lưu ý: slot navPanel đăng ký tĩnh nên mục "Bots" vẫn hiện trong điều hướng khi tắt;
  // công tắc chỉ điều khiển nội dung bên trong trang.
  bb.settings.define({
    botsPanel: {
      type: "boolean",
      label: "Trang Bots",
      description: "Mục Bots trong thanh điều hướng mở trang riêng: danh sách bot + hội thoại của bot. Bản vỏ UI — dữ liệu giả, chưa có tính năng thật.",
      default: false,
    },
    attentionDock: {
      type: "boolean",
      label: "Thẻ báo chờ duyệt",
      description: "Thẻ nổi góc màn hình khi có bot chờ duyệt — avatar + tên bot + việc đang chờ; bấm để tới chỗ duyệt. Cần bật cùng Trang Bots.",
      default: false,
    },
    osNotify: {
      type: "boolean",
      label: "Thông báo hệ điều hành",
      description: "Bắn toast hệ điều hành khi có bot chờ duyệt — hiện cả khi cửa sổ BB thu nhỏ (tab phải còn sống); bấm toast để quay lại BB tới chỗ duyệt. Cần bật cùng Trang Bots.",
      default: false,
    },
  });
}
