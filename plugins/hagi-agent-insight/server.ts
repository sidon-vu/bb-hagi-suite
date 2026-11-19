import type { BbPluginApi } from "@get-bb/plugin-sdk";

export default async function plugin(bb: BbPluginApi) {
  bb.log.info("loaded");
  // Mỗi tính năng = một công tắc boolean, mặc định tắt. Thêm vào đây rồi ghi vào catalog/hagi-agent-insight.md.
  bb.settings.define({});
}
