# Spec theme Hagi Amber

Mục tiêu: bắt chước ảnh mẫu của người dùng (app kiểu CrommaCode: nền gần đen, nhấn vàng hổ phách, chữ mono).
File màu hiện có: `themes/hagi-amber.css`.
Nguồn biến BB: `theming.md` của skill bb-cli + CSS nén của BB (`index-*.css`), đọc ngày 2026-11-19.

## Bảng tổng hợp

| Mục | Quan sát từ ảnh | Biến BB | Kết luận |
|---|---|---|---|
| Nền chính | Gần đen | `--canvas` (đang `#0f0f10` dark) | Làm được bằng theme |
| Sidebar sáng hơn nền | Sidebar hơi sáng hơn vùng nội dung | `--sidebar`, `--sidebar-foreground`, `--sidebar-border` (mặc định tự pha từ canvas+ink) | Làm được — đặt `--sidebar` riêng nếu muốn chênh rõ hơn |
| Chữ thường | Trắng ngà, đọc rõ trên nền đen | `--ink` (đang `#ece8df`), tầng phụ `--muted-foreground`, `--subtle-foreground`, `--readback-foreground` | Làm được |
| Nhấn vàng hổ phách | Vàng cam cho nút, link, highlight, biểu đồ | `--primary` (đang `#f2b13c`), `--primary-foreground`, `--file-accent` | Làm được |
| Hàng đang chọn | Tô đỏ cam đậm, khác màu nhấn vàng | `--surface-selected`, `--surface-selected-border` (mặc định pha từ `--primary` 16%/35%) | Một phần — đặt trực tiếp 2 biến này thành đỏ cam được, nhưng chỉ 1 màu cho mọi hàng chọn |
| Hàng xanh dương / xám có sọc | Hàng "test" xanh sọc chéo, hàng "zsh" xám sọc chéo | Không có biến. Màu theo loại hàng và họa tiết sọc do plugin thread-list tự vẽ | Không — cần CSS đè lên BB hoặc plugin thread-list riêng (kiểu Tinted Threads) |
| Màu trạng thái | Xanh lá = thành công/diff thêm; đỏ = lỗi/diff xóa; chấm trạng thái màu | `--success`, `--destructive`, `--destructive-text`, `--warning`, `--warning-text`, `--attention`, `--diff-added`, `--diff-removed`, `--pr-merged` | Làm được |
| Họ font | Mono toàn bộ, kể cả giao diện | `--font-sans`, `--font-mono`, `--font-terminal` | Làm được |
| Cỡ chữ | Hơi to hơn mặc định | Không có biến trong tài liệu theme. `--text-*` có trong CSS BB nhưng là biến Tailwind nội bộ | Một phần — dùng tính năng `fontScale` của plugin (đã có). Đặt `--text-*` trong theme: chưa xác minh |
| Độ đậm chữ | Đậm vừa (semibold) | Không có biến font-weight trong tài liệu theme. `--font-weight-*` tồn tại trong CSS BB nhưng không thuộc theme token | Không bằng theme token — cần CSS đè `font-weight` lên selector của BB |
| Cao hàng / khoảng thở | Hàng cao, thoáng | Không có biến riêng cho cao hàng. `--spacing: .25rem` có trong CSS BB (biến gốc Tailwind, scale mọi padding/margin/gap) | Một phần — tăng `--spacing` làm mọi thứ giãn ra cùng lúc (chưa xác minh là theme được phép đặt); cao riêng hàng thread cần CSS đè (feature `preset` KHÔNG làm được việc này: nó chỉ chỉnh độ rộng chat + cỡ chữ) |
| Bo góc | Bo vừa, không vuông không tròn quá | `--radius` (mặc định `.5rem`; `--radius-md/lg` pha từ nó; `--radius-2xl/3xl/4xl` cố định) | Làm được — `--radius` là token theme chính thức |
| Viền | Mảnh, sáng hơn nền | `--border`, `--border-hairline`, `--border-seam`, `--input` (tự pha từ ink) | Làm được — chỉnh `%` pha hoặc đặt `--border` trực tiếp |
| Bố cục riêng | Panel Game View, Bees, Ranks, thanh thống kê dưới đáy, đồ thị | Không phải giao diện BB | Không — đó là app khác trong ảnh, ngoài phạm vi theme |

## Bổ sung từ 7 ảnh (ngày 2026-11-19)

Mọi mã màu dưới đây là **ước lượng bằng mắt từ ảnh**, chưa đo bằng công cụ lấy màu.

### Khu vực task / thread (ảnh Files)
- Hàng thread đang chọn: nền cam-đỏ có **sọc chéo**, chữ trắng đậm, số thứ tự `01` bên phải (ước lượng ≈ `#c2563a`–`#d4694a`).
- Dưới hàng là 3 "chip" thống kê (thời gian, tia chớp, robot) viền mảnh, nền tối, bo nhỏ.
- Dưới chip là hàng ô trống mờ (slot) xám.
- Làm bằng theme: chỉ **màu** hàng chọn (`--surface-selected`, `--surface-selected-border`). Sọc chéo + chip: không (cần CSS đè hoặc plugin thread-list).

### Màu nền ấm (mọi ảnh)
- Vùng nội dung / panel: nâu-xám ấm đậm (ước lượng ≈ `#1e1d1a`–`#201f1b`), KHÔNG phải đen lạnh.
- Viền ngoài khung và thanh tiêu đề: gần đen hơn (≈ `#0f0f10`).
- → Đề xuất: `--canvas` dark ấm hơn một chút (hiện `#0f0f10` nguội hơn ảnh), sidebar/panel nâu-xám ấm. Cần quyết định: đổi canvas hay chỉ đặt `--sidebar`.

### Thẻ, nút, viền
- Thẻ/panel bo ≈ 8–12px, viền mảnh sáng hơn nền; hộp thoại bo lớn hơn (≈ 14px).
- Đường phân cách nét đứt (ảnh Invite, Sponsors). Không có token — bỏ qua.
- Nút chính sáng: nền trắng ngà, chữ đen ("Done"). Nút phụ: nền tối, viền mảnh.
- Tiêu đề khu vực: chữ HOA nhỏ, xám nhạt, giãn chữ (PROJECTS, FILES). Không có token — CSS đè.

### Màu nhấn phụ
- Vàng hổ phách: thanh dung lượng (Session/Week), chấm vuông đầu tiêu đề panel, viền thẻ nổi bật, huy hiệu hạng.
- Thẻ hạng 1–3 (Sponsors): nền vàng-nâu mờ (≈ `#3a2f1a`–`#3d3118`) — thuộc ứng dụng game, không phải BB.
- Xanh dương: số liệu `tok/s`, mũi tên (≈ `#3b82f6`) — có thể ứng với `--attention` hoặc link, chưa xác minh.
- Chấm màu icon file (git cam-đỏ, README xanh): màu icon, không phải token theme.

### Font
- Mono xuyên suốt, nét tròn, dấu `0` có gạch chéo/chấm → giống JetBrains Mono hoặc tương tự. Tiêu đề đậm hơn thân (semibold/bold).
- Độ đậm theo vùng: không có token.

### Ngoài phạm vi
- Game View (đồng hồ vòng, bình chất lỏng vàng/xanh), Vibe Sponsors, Mind/Images/Memory tab: là app khác, không phải BB. Màu bình vàng ≈ hổ phách, xanh ≈ `#4aa3d0` — chỉ dùng để tham khảo bảng màu.

## Đã làm trong hagi-amber.css

- Nền gần đen dark `#0f0f10`; bản sáng giấy ấm `#f5f1e8`.
- Nhấn hổ phách: dark `#f2b13c`, light `#b9770e`.
- Chữ: dark `#ece8df`, light `#26221b`; 3 tầng chữ phụ pha bằng `color-mix`.
- Font mono toàn bộ: `--font-sans/mono/terminal` = JetBrains Mono → Geist Mono → Berkeley Mono → SF Mono → fallback hệ thống.
- Trạng thái: destructive, warning (trùng màu nhấn), success, diff added/removed, file accent.

## Chưa làm, đề xuất

- `--surface-selected` + `--surface-selected-border` thành đỏ cam (ước lượng bằng mắt từ ảnh, ví dụ vùng `#c2410c`) để hàng chọn khác hẳn màu nhấn vàng.
- `--radius`: tăng nhẹ (ước lượng bằng mắt ~ `.65rem`) cho giống bo góc trong ảnh. Kiểm tra `--radius-2xl/3xl/4xl` vì chúng cố định, không theo `--radius`.
- `--sidebar`: đặt sáng hơn `--canvas` một chút (ước lượng bằng mắt ~ ink 4–5%) cho giống tương phản sidebar/nội dung trong ảnh.
- `--border`: tăng % pha ink nếu muốn viền sáng rõ như ảnh.
- `--attention`, `--pr-merged`, `--ansi-0..15`: chưa đặt — cân nhắc đồng bộ bảng màu terminal.
- Thử `--spacing` (nới khoảng thở toàn cục) — chưa xác minh theme được phép đặt; thử trên bản sao trước.

## Không làm được bằng theme

- Sọc chéo và màu riêng theo loại hàng (xanh cho thread test, xám cho terminal): thread-list của BB vẽ kiểu riêng — cần plugin thread-list thay thế hoặc CSS đè selector nội bộ (dễ vỡ khi BB cập nhật).
- Cỡ chữ và độ đậm từng vùng: không có token theme — dùng feature `fontScale` (đã có) và/hoặc CSS đè.
- Cao hàng riêng: không có token theme, và feature `preset` không chỉnh được (preset chỉ đổi độ rộng chat + cỡ chữ). Chỉ làm được bằng CSS đè selector nội bộ BB (dễ vỡ) hoặc thử `--spacing`.
- Bố cục game (Game View, Bees, Ranks, thanh thống kê, biểu đồ): không phải BB, làm được chỉ bằng plugin panel riêng, ngoài phạm vi theme.

## Chưa xác minh

- `--spacing`, `--text-*`, `--font-weight-*`: có trong CSS nén của BB nhưng KHÔNG có trong tài liệu theme — đặt trong `theme.css` có thể chạy (theme nạp cuối nên thắng cascade) nhưng chưa kiểm chứng thực tế.
- `--sidebar` đặt trực tiếp có giữ được khi đổi light/dark không (cần đặt trong cả 2 block).
