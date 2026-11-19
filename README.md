# bb-hagi-suite

Bộ plugin BB của riêng bạn, chia theo nhóm. Mỗi plugin gộp nhiều tính năng nhỏ, mỗi tính năng có công tắc bật/tắt riêng (mặc định tắt). Ý tưởng lấy từ các plugin trên chợ BB: clone về, đọc, rồi viết lại hoặc chuyển vào đây khi giấy phép cho phép.

| Cần gì | Mở đây |
|---|---|
| Plugin nào có tính năng gì, plugin tham khảo của từng nhóm | [catalog/README.md](catalog/README.md) |
| Plugin nào đã chuyển từ đâu, giấy phép gì | [PROVENANCE.md](PROVENANCE.md) |
| Quy tắc làm việc cho agent | [AGENTS.md](AGENTS.md) |

## Các plugin

Thư mục `plugins/<tên>/`, mỗi cái là một plugin BB đứng độc lập (có `package.json` riêng). Danh sách nằm trong `.bb/plugins.json`.

```sh
# build thử một plugin
cd plugins/hagi-composer && npm install && bb plugin build .
# cài từ máy này
bb plugin install path:. --plugin hagi-composer
```

## Tạo lại hoặc làm mới catalog

`node scripts/seed.mjs` chỉ tạo file chưa có, không ghi đè file bạn đã sửa. Muốn làm mới danh sách tham khảo của một nhóm, đổi tên file catalog cũ rồi chạy lại và gộp tay.
