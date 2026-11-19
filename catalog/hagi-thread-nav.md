# hagi-thread-nav — Điều hướng thread

Sidebar, tab, tag, ghim, lưu trữ, đổi tên, chuyển nhanh giữa các thread. Nhiều bản thay sidebar, chỉ 1 bản chạy được: dùng ô chọn (select), không dùng công tắc.

## Plugin này đang có gì (bạn cập nhật khi làm)

Mỗi tính năng là một module riêng và một công tắc (mặc định tắt).
Trạng thái: `dự kiến` · `đang làm` · `xong` · `bỏ`.

| Tính năng | Khóa công tắc | Trạng thái | Lấy ý từ plugin | Ghi chú |
|---|---|---|---|---|
|  |  |  |  |  |

## Plugin tham khảo (67, tạo ngày 2026-11-19 từ `bb plugin search`)

Trạng thái: `ứng viên` · `đã chọn` · `đã chuyển` · `bỏ`. Sửa cột **Giấy phép** và **Trạng thái** trực tiếp. Chỉ chuyển code khi giấy phép cho phép và đã ghi vào `PROVENANCE.md`.

| Plugin | Tác giả | Mã nguồn | Lượt cài | Mô tả | Giấy phép | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|---|
| BB Sidebar | yusuf8834 | [repo](https://github.com/yusuf8834/bb-sidebar) | 938 | A sidebar inspired by T3 Code that adds manual and automatic thread sorting, co… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| T3 Sidebar | SawyerHood | [repo](https://github.com/SawyerHood/sawyer-plugins/tree/HEAD/plugins/t3sidebar) | 421 | Replaces the BB thread list with a stable inbox, snooze controls, and child thr… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Thread Namer | suiramdev | [repo](https://github.com/suiramdev/bb-plugin-thread-namer) | 248 | Names threads with an agent when their first turn ends, so the sidebar reads as… | chưa kiểm tra | ứng viên |  |
| Cursor Sidebar | wy3z | [repo](https://github.com/wy3z/bb-cursor-suite/tree/HEAD/plugins/cursor-sidebar) | 243 | See at a glance which agents are working, which need an answer and which are do… | MIT (đã xem LICENSE 2026-11-19, commit 2811743) | đã phân tích, chưa chuyển | Thay sidebar (độc quyền). ~101 file, 22k dòng, cần gói chung `@wy3z/bb-suite`, server dùng SQLite, một phần lấy từ bb-plugin-thread-inbox (có THIRD-PARTY-NOTICES, kèm AutoAnimate). Không chép nguyên; nếu cần thì tách từng phần nhỏ và ghi PROVENANCE. Thuộc nhóm thread-nav, không phải appearance. |
| Action Topbar | MateoCerquetella | [repo](https://github.com/MateoCerquetella/bb-plugins/tree/HEAD/plugins/action-topbar) | 234 | Keep open BB panel tabs within reach above every thread. Search tabs and Action… | chưa kiểm tra | ứng viên |  |
| BB Office | ymichael | [repo](https://github.com/ymichael/bb-plugins/tree/HEAD/plugins/bb-office) | 226 | Turns active BB threads into a draggable pixel-art office with live worker stat… | chưa kiểm tra | ứng viên |  |
| Lanes | grrowl | [repo](https://github.com/grrowl/bb-lanes) | 186 | See which agents are working, waiting for you, or failing across a live timelin… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Dockside | MateoCerquetella | [repo](https://github.com/MateoCerquetella/bb-plugins/tree/HEAD/plugins/dockside) | 184 | Organizes BB threads into compact project-first families with semantic status, … | chưa kiểm tra | ứng viên |  |
| Cascade | SawyerHood | [repo](https://github.com/SawyerHood/sawyer-plugins/tree/HEAD/plugins/cascade) | 161 | Shows active BB threads in a tiled layout with horizontal columns and vertical … | chưa kiểm tra | ứng viên |  |
| Auto Archive | slogsdon | [repo](https://www.npmjs.com/package/bb-plugin-auto-archive) | 141 | Automatically archives bb threads that have seen no activity for a configurable… | chưa kiểm tra | ứng viên |  |
| Projects & Sections | VKirill | [repo](https://github.com/VKirill/bb-plugin-project-folders) | 133 | Organize BB chats into projects and nested sections that are real folders, so e… | chưa kiểm tra | ứng viên |  |
| Session History | neonick | [repo](https://github.com/neonick/bb-plugin-session-history) | 124 | See every Claude Code, Codex and Qwen Code session you ran outside BB, under th… | chưa kiểm tra | ứng viên |  |
| Homepage | yusuf8834 | [repo](https://github.com/yusuf8834/bb-homepage) | 103 | Starts new chats from configurable homepage project cards with manual sorting, … | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Chat Sidebar | seoperin | [repo](https://github.com/seoperin/bb-plugin-chat-sidebar) | 91 | See which threads need you at a glance in a messenger-style sidebar with live s… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Arc Switcher | bighitbiker3 | [repo](https://github.com/bighitbiker3/bb-plugin-arc-switcher) | 80 | Cycles through your seven most recently opened BB chats with an Arc-style Comma… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Copy Session ID | patleeman | [repo](https://github.com/patleeman/bb-plugins/tree/HEAD/packages/bb-plugin-copy-session-id) | 80 | Copy a thread's session ID from its left-sidebar context menu. | chưa kiểm tra | ứng viên |  |
| Thread Hover Cards | brsbl | [repo](https://github.com/brsbl/bb-plugins/tree/HEAD/plugins/thread-hover-cards) | 74 | See what any thread or section is doing without opening it. Hover a thread in t… | chưa kiểm tra | ứng viên |  |
| Machine Sidebar | regenrek | [repo](https://github.com/regenrek/bb-plugin-machine-sidebar) | 39 | Sort your bb threads by the machine they run on, then by project, so laptop and… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Ultra Sidebar | dillionverma | [repo](https://github.com/dillionverma/bb-plugin-ultra-sidebar) | 39 | Keep every BB thread visible as work moves across projects. Group threads by pr… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Thread Organizer | brsbl | [repo](https://github.com/brsbl/bb-plugins/tree/HEAD/plugins/thread-organizer) | 35 | Turns your sidebar sections into a workflow agents follow, with unread work col… | chưa kiểm tra | ứng viên |  |
| Radar Sidebar | MacHatter1 | [repo](https://github.com/MacHatter1/bb-plugin-radar-sidebar) | 32 | See which threads need you without opening each conversation. Group threads by … | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Retitle | chug2k | [repo](https://github.com/chug2k/bb-plugin-retitle) | 30 | Gives each thread a title that matches the conversation, not only its first mes… | chưa kiểm tra | ứng viên |  |
| Feed | ryanbbrown | [repo](https://github.com/ryanbbrown/bb-plugin-feed) | 28 | See every thread that needs your answer in one list, each with a one-line summa… | chưa kiểm tra | ứng viên |  |
| Thread Tree | kartollikaa | [repo](https://github.com/kartollikaa/bb-plugins/tree/HEAD/plugins/thread-tree) | 26 | See which agent spawned which thread. A sidebar thread list where child threads… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Header Pins | fzrx-ego | [repo](https://github.com/fzrx-ego/bb-plugin-header-pins) | 25 | Switch between your pinned threads in one click from the empty title bar strip … | chưa kiểm tra | ứng viên |  |
| Nest | euanguo | [repo](https://github.com/euanguo/euanguo-plugins/tree/HEAD/plugins/nested-sidebar) | 24 | Give every project a stable place in the sidebar, with its worktrees and agent … | chưa kiểm tra | ứng viên |  |
| Sidebar Plus | juanem1 | [repo](https://github.com/juanem1/bb-sidebar-plus-plugin) | 23 | Keep active projects within reach and check thread status without leaving the s… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Project Page | jem-computer | [repo](https://github.com/jem-computer/bb-project-page) | 22 | Open a project's homepage from its name in BB's sidebar. The homepage renders t… | chưa kiểm tra | ứng viên |  |
| Simple Sidebar Folders | chug2k | [repo](https://github.com/chug2k/bb-plugin-simple-sidebar-folders) | 22 | Fold whole groups of sidebar projects, so work projects stay out of sight at ho… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Switchboard | kalindudc | [repo](https://github.com/kalindudc/bb-marketplace/tree/HEAD/plugins/switchboard) | 22 | See which agent threads failed, need you or are still running, grouped under yo… | chưa kiểm tra | ứng viên |  |
| Workspaces | mgmobrien | [repo](https://github.com/mgmobrien/bb-plugin-pane-workspaces) | 21 | Switch whole pane arrangements for projects, thread groups and personal threads… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Sidebar Project Filter | slogsdon | [repo](https://www.npmjs.com/package/bb-plugin-sidebar-filter) | 19 | Replaces the sidebar thread list with a project-grouped view that hides project… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| JB Flow | Johannes-Berggren | [repo](https://github.com/Johannes-Berggren/bb-plugin-jb-flow) | 18 | Puts the agent threads that need you at the top, and keeps the rest out of the … | chưa kiểm tra | ứng viên |  |
| Thread Tags | VladPolet | [repo](https://github.com/VladPolet/bb-plugin-thread-tags) | 18 | Puts a colored emoji or text badge before a thread's title, so you can spot sta… | chưa kiểm tra | ứng viên |  |
| Auto Pin | csells | [repo](https://github.com/csells/bb-plugins/tree/HEAD/plugins/auto-pin) | 17 | Keeps every thread you start pinned to the top of the sidebar, so a thread stay… | chưa kiểm tra | ứng viên |  |
| Chat Tabs | nicolay-i | [repo](https://github.com/nicolay-i/bb-plugin-tabs) | 17 | Keep work and home conversations separate and return to the chats you need. Swi… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Fast Split | dmitriikapustin | [repo](https://github.com/dmitriikapustin/bb-plugins-by-kapustin/tree/HEAD/plugins/fast-split) | 17 | Open a neighboring New thread pane from the sidebar footer. Keep the current pa… | chưa kiểm tra | ứng viên |  |
| Atrium — MonoRepo Projects | nicolay-i | [repo](https://github.com/nicolay-i/bb-plugin-multi-repo-git) | 16 | Keep related projects and conversations within reach without replacing BB's nat… | chưa kiểm tra | ứng viên |  |
| Tree Sidebar | chadbailey59 | [repo](https://github.com/chadbailey59/bb-plugin-tree-sidebar) | 14 | Find threads by where their project lives on disk: folders nest, projects sit i… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| BBDesk | devalextelematika | [repo](https://github.com/devalextelematika/BBDesk) | 11 | Keep project conversations, live activity and application shortcuts in one work… | chưa kiểm tra | ứng viên |  |
| Play Continue | brzvsk | [repo](https://github.com/brzvsk/bb-plugins/tree/HEAD/plugins/play-continue) | 11 | Stop a run with a double Escape and pick up a stopped turn with one Play click.… | chưa kiểm tra | ứng viên |  |
| Sessions’ switcher | brzvsk | [repo](https://github.com/brzvsk/bb-plugins/tree/HEAD/plugins/sessions-switcher) | 11 | Switch between seven recent sessions with Alt+Tab-style controls. Hold the shor… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Archive Section | NickolasBenakis | [repo](https://github.com/NickolasBenakis/bb-plugin-archive-section) | 10 | Move every thread you archive into an Archived sidebar section, and back to its… | chưa kiểm tra | ứng viên |  |
| Archived Threads Toggle | brzvsk | [repo](https://github.com/brzvsk/bb-plugins/tree/HEAD/plugins/archived-toggle) | 10 | Show or hide archived threads in the sidebar with one click. An archive button … | chưa kiểm tra | ứng viên |  |
| Attention sidebar | nosenss | [repo](https://github.com/nosenss/bb-plugin-attention-sidebar) | 10 | Puts every thread that is waiting on you, from all projects, at the top of the … | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Beside | ahkohd | [repo](https://github.com/ahkohd/bb-plugin-beside) | 10 | Turns the bb sidebar into an inbox where threads keep their place and finished … | chưa kiểm tra | ứng viên |  |
| Focus Sidebar | grishaster80 | [repo](https://github.com/grishaster80/bb-plugin-focus-sidebar) | 6 | Keeps only the threads from the last few hours in your sidebar and moves older … | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Lock Area | dmitriikapustin | [repo](https://github.com/dmitriikapustin/bb-plugins-by-kapustin/tree/HEAD/plugins/lock-area) | 6 | Keep reference panes in place while opening work beside them. Uses compatible n… | chưa kiểm tra | ứng viên |  |
| Show Latest Threads | meanwhile17 | [repo](https://github.com/meanwhile17/bb-plugin-show-latest-threads) | 6 | Shows only the threads you touched in the last 24, 48 or 72 hours, so the sideb… | chưa kiểm tra | ứng viên |  |
| Spaces | tarasenko-by | [repo](https://github.com/tarasenko-by/bb-plugin-spaces) | 6 | Show only the projects you are working on by switching the sidebar between spac… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Top Tabs | nikushiks | [repo](https://github.com/nikushiks/bb-plugin-top-tabs) | 6 | Switch between the threads you are working on from a row of tabs across the top… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Fast Archive | dmitriikapustin | [repo](https://github.com/dmitriikapustin/bb-plugins-by-kapustin/tree/HEAD/plugins/fast-archive) | 5 | Archive finished conversations from the thread header. Uses BB’s archive and re… | chưa kiểm tra | ứng viên |  |
| Open in Window | csells | [repo](https://github.com/csells/bb-plugins/tree/HEAD/plugins/open-in-window) | 5 | Opens any thread in its own browser tab or window from the thread's "..." menu,… | chưa kiểm tra | ứng viên |  |
| Threadspace | KosachMax | [repo](https://github.com/KosachMax/threadspace) | 5 | Turns the BB sidebar into a Notion-style list of projects and threads. Give eac… | chưa kiểm tra | ứng viên |  |
| Subthread Columns | neoromantic | [repo](https://github.com/neoromantic/bb-plugin-subthread-columns) | 3 | Answer waiting subthreads and inspect failures beside their parent. Optional Re… | chưa kiểm tra | ứng viên |  |
| Thread Switcher | kartollikaa | [repo](https://github.com/kartollikaa/bb-plugins/tree/HEAD/plugins/thread-switcher) | 3 | Jump between your recent threads from the keyboard and see at a glance which on… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Section Load More | siluthfi | [repo](https://github.com/siluthfi/bb-plugin-section-load-more) | 2 | Keep long sidebar sections short, so opening one never pushes the others out of… | chưa kiểm tra | ứng viên |  |
| Thread nicknames | mgmobrien | [repo](https://github.com/mgmobrien/bb-plugin-thread-nicknames) | 2 | Identify threads by persistent numbers such as @27. New threads keep their numb… | chưa kiểm tra | ứng viên |  |
| Thread Tabs | anirudhranganath | [repo](https://github.com/anirudhranganath/bb-plugin-thread-tabs) | 2 | Keep up to eight independent agent chats in one thread and workspace. Choose an… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Hats - Workspaces simplified | zaymonoid | [repo](https://github.com/zaymonoid/bb-hats) | 1 | Workspaces for your bb sidebar: switch between groups of projects, like Work an… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| T3 Import | iipanda | [repo](https://github.com/iipanda/bb-plugin-t3-import) | 1 | Bring your T3 Code threads into bb and pick up each conversation where you left… | chưa kiểm tra | ứng viên |  |
| Claude-Like Threads | startsevdev | [repo](https://github.com/startsevdev/bb-plugin-claude-like-threads) |  | One timeline across BB projects, newest activity first. Running threads appear … | chưa kiểm tra | ứng viên |  |
| Metadata Tags | 99Lys | [repo](https://github.com/99Lys/bb-plugin-metadata-tags) |  | See each thread's project, pull request state, and uncommitted changes at a gla… | chưa kiểm tra | ứng viên |  |
| Project Spaces | ichinya | [repo](https://github.com/ichinya/bb-project-space) |  | Keep related repositories, shared context and chats in one space. Use ai-worksp… | chưa kiểm tra | ứng viên | có thể thay sidebar (độc quyền) |
| Thread Names | nikushiks | [repo](https://github.com/nikushiks/bb-plugin-thread-names) |  | Names each thread "category: name" in lowercase, like "fix: login redirect loop… | chưa kiểm tra | ứng viên |  |
| Thread Reveal | artbear | [repo](https://github.com/artbear/bb-plugin-thread-reveal) |  | Find the open thread in your sidebar without changing grouping or filters. Use … | chưa kiểm tra | ứng viên |  |
| WizBar | openwizdev | [repo](https://github.com/openwizdev/WizPlugins/tree/HEAD/wizbar) |  | An agent-first sidebar for fleets of agent threads. Cards show the issue or pul… | chưa kiểm tra | ứng viên |  |
