# hagi-bots — Trang Bots

Trang riêng kiểu Traces: bên ngoài chỉ một mục điều hướng "Bots", bấm vào mở màn hình có cột danh sách bot + hội thoại của từng bot. Bản đầu chỉ là vỏ UI với dữ liệu giả — chưa nối trạng thái thật.

## Plugin này đang có gì (bạn cập nhật khi làm)

Mỗi tính năng là một module riêng và một công tắc (mặc định tắt).
Trạng thái: `dự kiến` · `đang làm` · `xong` · `bỏ`.

| Tính năng | Khóa công tắc | Trạng thái | Lấy ý từ plugin | Ghi chú |
|---|---|---|---|---|
| Trang Bots (navPanel + cột trái riêng + dữ liệu giả + tạo/sửa giả) | `botsPanel` | đang làm | ý tưởng Bots Sidebar + bố cục Agent Traces | `app.slots.navPanel` + `experimental_sidebar`/`experimental_usePageTitle`/`experimental_useBadge`. Công tắc chỉ điều khiển nội dung trang — mục "Bots" trong điều hướng vẫn hiện (đăng ký tĩnh). Store trong bộ nhớ: `features/mock-store.ts` |
| Bộ nhớ kiểu Hermes/OpenClaw (mock): SOUL + MEMORY + PLAYBOOK + USER.md dùng chung + episodes + guidance read-only | (trong `botsPanel`) | đang làm | Hermes Agent, OpenClaw | Tab Instructions của trang chi tiết bot hiển thị đủ bộ nhớ; USER.md sửa ở thẻ riêng trang tổng. Guidance là text tĩnh, read-only. Bản thật sẽ cần: bảng episodes + job "dreaming" gộp vào MEMORY + tool để bot tự ghi playbook |

## Quyết định đã chốt (ghi lại để buổi làm sau không phải phân tích lại)

Cập nhật 2026-11-20.

### Phong cách & theo dõi

- Phong cách "đội bot roster": card nhân sự, avatar SVG có mặt đổi theo trạng thái (đang làm/chờ input/nghỉ), chip màu, card nổi khi hover. Avatar waiting có vòng vàng.
- Trạng thái bot suy ra từ thread: chờ > đang làm > nghỉ (giống luật bản gốc). Mỗi bot có `lastActivity`.
- Badge điều hướng = số thread đang CHỜ input (tone warning), không phải đếm bot.
- Trang tổng có "Hoạt động gần đây" gom episodes mọi bot; tab Instructions có thanh độ đầy MEMORY.md /3000 (vàng khi >80%).

### Hướng UI

- Trang riêng kiểu Traces: bên ngoài chỉ 1 mục "Bots" trong điều hướng (`app.slots.navPanel`), bấm vào mở trang có `experimental_sidebar` cột trái riêng. KHÔNG thay sidebar thread gốc của BB.
- Chạy được song song `bots-sidebar`: bản vỏ không đăng ký tool/CLI/hook/DB/RPC nên không đụng gì.
- Công tắc `botsPanel` chỉ điều khiển nội dung trang; mục điều hướng vẫn hiện vì navPanel đăng ký tĩnh.

### Kiến trúc instructions (tab Instructions)

Inject vào agent = guidance cố định + phần động. Trong bots-sidebar gốc: `BOT_GUIDANCE` tại `lib/bot-instructions.ts:6-11` (4 đoạn: nhắn bot qua `bb bots`, quy ước state tools, luật ownership, MEMORY ≤3000 + xử lý tràn), dùng ở `server.ts:256` (agents.configure) và `server.ts:426` (prompt preview "Tool guidance"). Phần động `botInstructions()` (bot-instructions.ts:20-25) = header + project + SOUL + MEMORY, ngân sách 4096.

- Guidance: text TĨNH trong code, read-only — không phải dữ liệu bot, không sửa được. Hiển thị dạng gấp để người dùng thấy đủ bức tranh.
- SOUL.md + MEMORY.md: giữ nguyên khái niệm gốc (MEMORY ≤3000, bot ghi qua tool CAS).
- PLAYBOOK.md: THAY cho tự-tạo-skills kiểu Hermes (BB chưa có API bot-viết-skill động). Bot tự ghi kinh nghiệm/quy trình sau correction; inject như memory.
- USER.md: 1 bản DÙNG CHUNG mọi bot (cùng một người dùng BB — như USER.md của Hermes/OpenClaw). Sửa ở trang danh sách.
- Episodes: ghi 1-2 dòng sau mỗi thread xong việc (tương đương `memory/YYYY-MM-DD.md` của OpenClaw).
- Dreaming-lite: job nền định kỳ (reuse cron pattern) gom episodes mới + MEMORY → cô đọng ghi lại MEMORY qua CAS; giữ revision để rollback; loại nội dung nguồn không tin cậy (như OpenClaw dreaming).

### Khi nối backend thật (cần làm)

- Bảng `bot_episodes` trong plugin SQLite (SQLite đã có sẵn).
- Job nền dreaming-lite + tool để bot tự ghi playbook/episodes.
- PHẢI đổi tên mọi thứ đụng `bots-sidebar` khi fork thật: CLI `bb bots` → tên khác, `bot_read_state`/`bot_update_state`, mention id `bots`, slot ids, realtime channels, prefix `bots:` (draftKey + localStorage).
- Fork sẽ gây đụng nếu bật đôi: routing claim thread ở 2 DB, 2 cron — giữ nguyên tắc không bật cùng lúc.
- Giấy phép: repo gốc tobi KHÔNG có LICENSE → chỉ viết lại theo ý tưởng, phát hành công khai phải xin phép; giữ ghi công avatar bloub (MIT) nếu dùng.
- Báo cáo khảo sát đầy đủ của đợt phân tích đầu nằm trong BB thread-storage của thread fork (file `hagi-bots-fork-report.md`), không commit vì là path riêng của máy.

## Plugin tham khảo

Trạng thái: `ứng viên` · `đã chọn` · `đã chuyển` · `bỏ`. Sửa cột **Giấy phép** và **Trạng thái** trực tiếp. Chỉ chuyển code khi giấy phép cho phép và đã ghi vào `PROVENANCE.md`.

| Plugin | Tác giả | Mã nguồn | Mô tả | Giấy phép | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|
| Bots Sidebar | tobi (checkout: sidon-vu/bb-bots-sidebar) | [repo](https://github.com/tobi/bb-bots-sidebar) | Quản lý bot trong sidebar: gán bot cho thread, SOUL/MEMORY, project ownership | không có LICENSE (đã kiểm 2026) | ứng viên | Chỉ lấy ý tưởng, viết lại — phát hành công khai cần xin phép tác giả. Giữ ghi công avatar bloub (MIT) nếu dùng avatar của họ |
| Agent Traces | getbb (first-party) | plugin cài sẵn trong BB | Trang traces với cột trái riêng | n/a | đã chọn (làm mẫu bố cục) | Mẫu `navPanel + experimental_sidebar` |
