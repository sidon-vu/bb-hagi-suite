# hagi-bots — Trang Bots

Trang riêng kiểu Traces: bên ngoài chỉ một mục điều hướng "Bots", bấm vào mở màn hình có cột danh sách bot + hội thoại của từng bot. Bản đầu chỉ là vỏ UI với dữ liệu giả — chưa nối trạng thái thật.

## Plugin này đang có gì (bạn cập nhật khi làm)

Mỗi tính năng là một module riêng và một công tắc (mặc định tắt).
Trạng thái: `dự kiến` · `đang làm` · `xong` · `bỏ`.

| Tính năng | Khóa công tắc | Trạng thái | Lấy ý từ plugin | Ghi chú |
|---|---|---|---|---|
| Trang Bots (navPanel + cột trái riêng + dữ liệu giả + tạo/sửa giả) | `botsPanel` | đang làm | ý tưởng Bots Sidebar + bố cục Agent Traces | `app.slots.navPanel` + `experimental_sidebar`/`experimental_usePageTitle`/`experimental_useBadge`. Công tắc chỉ điều khiển nội dung trang — mục "Bots" trong điều hướng vẫn hiện (đăng ký tĩnh). Store trong bộ nhớ: `features/mock-store.ts` |

## Plugin tham khảo

Trạng thái: `ứng viên` · `đã chọn` · `đã chuyển` · `bỏ`. Sửa cột **Giấy phép** và **Trạng thái** trực tiếp. Chỉ chuyển code khi giấy phép cho phép và đã ghi vào `PROVENANCE.md`.

| Plugin | Tác giả | Mã nguồn | Mô tả | Giấy phép | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|
| Bots Sidebar | tobi (checkout: sidon-vu/bb-bots-sidebar) | [repo](https://github.com/tobi/bb-bots-sidebar) | Quản lý bot trong sidebar: gán bot cho thread, SOUL/MEMORY, project ownership | không có LICENSE (đã kiểm 2026) | ứng viên | Chỉ lấy ý tưởng, viết lại — phát hành công khai cần xin phép tác giả. Giữ ghi công avatar bloub (MIT) nếu dùng avatar của họ |
| Agent Traces | getbb (first-party) | plugin cài sẵn trong BB | Trang traces với cột trái riêng | n/a | đã chọn (làm mẫu bố cục) | Mẫu `navPanel + experimental_sidebar` |
