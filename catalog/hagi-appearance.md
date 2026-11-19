# hagi-appearance — Giao diện

Theme, màu, hiệu ứng. Theme chỉ cần 1 bản đang dùng.

## Plugin này đang có gì (bạn cập nhật khi làm)

Mỗi tính năng là một module riêng và một công tắc (mặc định tắt).
Trạng thái: `dự kiến` · `đang làm` · `xong` · `bỏ`.

| Tính năng | Khóa công tắc | Trạng thái | Lấy ý từ plugin | Ghi chú |
|---|---|---|---|---|
| Màu sắc | `colorTheme` (chọn 1 bộ) | dự kiến | Ayu, Tokyo Night, Vercel Theme, bb Monokai | chỉ 1 bộ màu đang dùng, nên dùng ô chọn |
| Preset giao diện | `preset` (compact / comfortable / wide) | đã build, chờ chạy thử | tự viết | `features/presets.ts`; chỉ đặt tỷ lệ (%, rem), không px cố định. Ô số riêng: 0 = theo preset |
| Độ rộng khung chat | `chatWidthEnabled`, `chatWidthPercent`, `chatWidthMaxRem` | % khung kẹp tối đa theo rem; bản px cũ đã bỏ | Chat Width | `features/chat-width.tsx`; selector nội bộ BB, dễ vỡ khi BB cập nhật |
| Cỡ chữ co giãn | `fontScaleEnabled`, `fontScalePercent` | đã build, chờ chạy thử | tự viết (tham khảo UI Scale, Fonts) | `features/font-scale.tsx`; đổi `font-size` gốc theo `vw`, kẹp ±15%; ảnh hưởng cả UI nếu BB dùng rem |
| Theme Hagi Amber (màu ấm + font mono + bo góc + ANSI) | `bb.themes` trong package.json | đã build, chờ chọn thử | tự viết theo ảnh mẫu của người dùng (không chép code) | `themes/hagi-amber.css`; hiện ở Settings → Appearance, không có công tắc vì chọn theme mới là "bật". Font nằm trong cùng file theme (`--font-sans/mono/terminal`). Đã thêm: nền nâu-xám ấm, hàng chọn đỏ-cam, `--radius .65rem`, sidebar/viền sáng hơn, 16 màu ANSI, `--spacing .27rem` (chưa xác minh có tác dụng). Spec: `themes/hagi-amber.spec.md`. Thẻ + popover + ô nhập tin nhắn dark `#1a1815`. Không làm được: bố cục riêng của ảnh mẫu (Game View, thanh hàng cuộn...) |
| Nền ô nhập tin nhắn | (không có công tắc) | mới | tự viết | `features/composer-surface.tsx` dò khung bo góc quanh ô gõ và gắn nhãn `data-hagi-composer-surface`; màu `#1a1815` nằm trong `themes/hagi-amber.css`. Chưa kiểm chứng trên BB thật |
| Bố cục chat (còn lại) | `layout*` | dự kiến | Auto-hide Panel | thay sidebar thì để ở hagi-thread-nav |
| Ngôn ngữ tiếng Việt | `langVi` | dự kiến | 简体中文语言包 (MIT) | làm sau cùng, việc dịch rất lớn |

## Plugin tham khảo (72, tạo ngày 2026-11-19 từ `bb plugin search`)

Trạng thái: `ứng viên` · `đã chọn` · `đã chuyển` · `bỏ`. Sửa cột **Giấy phép** và **Trạng thái** trực tiếp. Chỉ chuyển code khi giấy phép cho phép và đã ghi vào `PROVENANCE.md`.

| Plugin | Tác giả | Mã nguồn | Lượt cài | Mô tả | Giấy phép | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|---|
| Beautiful Chat | diip3sh | [repo](https://github.com/diip3sh/bb-plugin-beautiful-chat) | 331 | Restyles BB's chat — composer, messages, work rows, loading states — in Beautif… | chưa kiểm tra | ứng viên |  |
| Aura | MateoCerquetella | [repo](https://github.com/MateoCerquetella/bb-plugins/tree/HEAD/plugins/aura) | 272 | Make your BB workspace your own with personal wallpapers, animated GIFs, and pi… | chưa kiểm tra | ứng viên |  |
| Fonts | gtramontina | [repo](https://github.com/gtramontina/bb-plugin-fonts) | 191 | Choose local font families and tune interface, code, and serif typography indep… | chưa kiểm tra | ứng viên |  |
| Ayu | vburojevic | [repo](https://github.com/vburojevic/bb-plugin-ayu) | 176 | Adds the three ayu themes (Light, Dark and Mirage) and a settings panel that sw… | chưa kiểm tra | ứng viên |  |
| bb Monokai | smsunarto | [repo](https://github.com/smsunarto/bb-plugins/tree/HEAD/plugins/monokai) | 175 | A dark Monokai-family theme for bb: one meaning per hue, a single text ladder, … | chưa kiểm tra | ứng viên |  |
| Tokyo Night | krehel | [repo](https://github.com/krehel/bb-plugin-tokyo-night) | 160 | Adds the two Tokyo Night palettes (Night and Storm), each pairing its dark base… | chưa kiểm tra | ứng viên |  |
| Tinted Threads | grrowl | [repo](https://github.com/grrowl/bb-tinted-threads) | 143 | A tinted replacement for bb's sidebar thread list with active and blocked row h… | chưa kiểm tra | ứng viên |  |
| Vercel Theme | divyesh-puri | [repo](https://github.com/divyesh-puri/bb-plugin-vercel-theme) | 138 | Adds a Vercel-inspired light and dark palette with Geist typography and matchin… | chưa kiểm tra | ứng viên |  |
| Compact Nav | SawyerHood | [repo](https://github.com/SawyerHood/sawyer-plugins/tree/HEAD/plugins/compact-nav) | 120 | Make more room for threads with compact, borderless sidebar icons. Keep your sa… | chưa kiểm tra | ứng viên |  |
| Ambient | brsbl | [repo](https://github.com/brsbl/bb-plugins/tree/HEAD/plugins/ambient) | 94 | Turns bb's background into a live scene that shows what your agents are doing a… | chưa kiểm tra | ứng viên |  |
| Liquid Glass | luisllenin02 | [repo](https://github.com/luisllenin02/bb-plugin-liquid-glass) | 94 | Adds dark and light translucent themes over a configurable wallpaper layer, wit… | chưa kiểm tra | ứng viên |  |
| Pets | vburojevic | [repo](https://github.com/vburojevic/bb-plugin-pets) | 92 | Adds a pixel companion to the BB window that mirrors your fleet, walks to threa… | chưa kiểm tra | ứng viên |  |
| ChatGPT Skin | euanguo | [repo](https://github.com/euanguo/euanguo-plugins/tree/HEAD/plugins/chatgpt-skin) | 90 | Dress bb in the ChatGPT desktop app's look, from the canvas and sidebar down to… | chưa kiểm tra | ứng viên |  |
| Conductor Theme | bottlebrushes | [repo](https://github.com/bottlebrushes/bb-plugin-conductor-theme) | 82 | Applies the Conductor workspace aesthetic across bb with roasted espresso and n… | chưa kiểm tra | ứng viên |  |
| ACP Profile Icons | hxy91819 | [repo](https://github.com/hxy91819/bb-plugin-acp-profile-icons) | 65 | Recognize eight ACP providers by their brand marks in model pickers and provide… | chưa kiểm tra | ứng viên |  |
| Transparency | notpritam | [repo](https://github.com/notpritam/bb-plugin-glass) | 60 | Translucent BB surfaces with six animated backdrops, custom GLSL shaders, wallp… | chưa kiểm tra | ứng viên |  |
| Project Colors | ninjasweb | [repo](https://github.com/ninjasweb/bb-project-colors) | 48 | Organize busy sidebars by giving every project its own color. Choose from seven… | chưa kiểm tra | ứng viên |  |
| UI Scale | m9tdev | [repo](https://github.com/m9tdev/bb-plugin-ui-scale) | 48 | Makes the bb interface bigger or smaller on each device, so your phone and desk… | chưa kiểm tra | ứng viên |  |
| Theme Toggle | xMinor-1 | [repo](https://github.com/xMinor-1/bb-plugins/tree/HEAD/plugins/theme-toggle) | 43 | Flips bb between light and dark from a sidebar footer button: a click switches … | chưa kiểm tra | ứng viên |  |
| True Colors | ChrBoebel | [repo](https://github.com/ChrBoebel/bb-plugin-provider-brand-marks) | 43 | Draws each provider logo in its own brand colour — Anthropic clay, OpenAI green… | chưa kiểm tra | ứng viên |  |
| Calm | davideiffert | [repo](https://github.com/davideiffert/bb-plugin-calm) | 42 | A little world while your agent works. Sixteen pixel-art scenes bring sheep, sa… | chưa kiểm tra | ứng viên |  |
| Auto-hide Panel | brzvsk | [repo](https://github.com/brzvsk/bb-plugins/tree/HEAD/plugins/auto-hide-panel) | 38 | Give the thread its full width back when you close the last tab in the right pa… | chưa kiểm tra | ứng viên |  |
| UI Tweaks | wy3z | [repo](https://github.com/wy3z/bb-cursor-suite/tree/HEAD/plugins/ui-tweaks) | 34 | Tune BB's type, icons, prompt box, menus and shortcuts with switches that BB it… | chưa kiểm tra | ứng viên |  |
| Agent Icons | ponomr | [repo](https://github.com/ponomr/bb-plugin-agent-icons) | 32 | Give each BB agent provider its own icon and colour: built-in glyphs or your ow… | chưa kiểm tra | ứng viên |  |
| Herdr Theme | davideiffert | [repo](https://github.com/davideiffert/bb-plugin-herdr-theme) | 32 | Turn BB into a terminal-style workspace, with framed conversation panes and ele… | chưa kiểm tra | ứng viên |  |
| Gone Fishing | charpeni | [repo](https://github.com/charpeni/bb-plugins/tree/HEAD/plugins/gone-fishing) | 27 | Turn the wait for your agent into a pixel-art fishing trip on top of the chat i… | chưa kiểm tra | ứng viên |  |
| Compact Rail | fzrx-ego | [repo](https://github.com/fzrx-ego/bb-plugin-compact-rail) | 26 | Make more room on a small desktop screen with compact navigation and narrower w… | chưa kiểm tra | ứng viên |  |
| Lavender | MateoCerquetella | [repo](https://github.com/MateoCerquetella/bb-plugins/tree/HEAD/plugins/lavender) | 25 | Give your workspace a lavender palette, from charcoal-violet nights to pale-lil… | chưa kiểm tra | ứng viên |  |
| Endless | brsbl | [repo](https://github.com/brsbl/bb-plugins/tree/HEAD/plugins/endless) | 24 | Restyles bb in the silver print of Frank Ocean's Endless, in light and dark mod… | chưa kiểm tra | ứng viên |  |
| Asciimoji | rigerc | [repo](https://github.com/rigerc/bb-plugin-asciimoji) | 23 | Give every thread a familiar text face that stays with the conversation. Choose… | chưa kiểm tra | ứng viên |  |
| Aura Motion | NickolasBenakis | [repo](https://github.com/NickolasBenakis/bb-plugin-aura-motion) | 23 | Play your own video, GIF or photo behind every BB conversation, with your messa… | chưa kiểm tra | ứng viên |  |
| Breathe | Nikko-Foti | [repo](https://github.com/Nikko-Foti/bb-plugin-breathe) | 23 | An animated pixel wave that guides your breathing while your agent works. | chưa kiểm tra | ứng viên |  |
| Claude Theme for BB | jtattreo | [repo](https://github.com/Treo-Solutions/bb-plugin-claude-theme) | 22 | Give BB terracotta accents with charcoal dark and off-white light palettes. Sel… | chưa kiểm tra | ứng viên |  |
| E Corp | xcke | [repo](https://github.com/xcke/bb-plugin-e-corp) | 20 | Turns bb into a cold corporate workstation, lit by one continuous petroleum-blu… | chưa kiểm tra | ứng viên |  |
| Compact UI | mgmobrien | [repo](https://github.com/mgmobrien/bb-plugin-compact-ui) | 19 | Fit more threads and pane content on screen with tighter spacing and a composer… | chưa kiểm tra | ứng viên |  |
| Bbium | kuringer | [repo](https://github.com/kuringer/bb-plugin-bbium) | 18 | Click anything in bb without the mouse: press f, type the letter label, and bb … | chưa kiểm tra | ứng viên |  |
| Fat Fingers | csells | [repo](https://github.com/csells/bb-plugins/tree/HEAD/plugins/fat-fingers) | 18 | Makes every icon in bb 50% larger on your phone, so a thumb has something to se… | chưa kiểm tra | ứng viên |  |
| Codex Theme | steveafrost | [repo](https://github.com/steveafrost/bb-theme-codex) | 16 | Brings the OpenAI Codex / ChatGPT desktop app's look to bb: system-font typogra… | chưa kiểm tra | ứng viên |  |
| Omarchy Sync | salemsayed | [repo](https://github.com/salemsayed/bb-plugin-omarchy) | 16 | Keeps BB desktop and PWA colors in step with the active Omarchy theme, includin… | chưa kiểm tra | ứng viên |  |
| Collapsible Navigation | VanDalkvist | [repo](https://github.com/VanDalkvist/bb-plugin-collapsible-navigation) | 15 | Folds the sidebar navigation upward into a compact strip to maximize vertical s… | chưa kiểm tra | ứng viên |  |
| Project Themes | lumenikoly | [repo](https://github.com/lumenikoly/useful-bb-plugins/tree/HEAD/plugins/project-themes) | 15 | Give every project its own color, so threads and workspaces are easier to recog… | chưa kiểm tra | ứng viên |  |
| Sidebar Subtitles | dmitriikapustin | [repo](https://github.com/dmitriikapustin/bb-plugins-by-kapustin/tree/HEAD/plugins/sidebar-subtitles) | 15 | Group sidebar destinations under your own headings. Drag sections or move them … | chưa kiểm tra | ứng viên |  |
| Pokémon | SawyerHood | [repo](https://github.com/SawyerHood/sawyer-plugins/tree/HEAD/plugins/pokemon) | 14 | Build your Pokémon collection as you finish work in BB. Archive a thread to cat… | chưa kiểm tra | ứng viên |  |
| Nav Rail | SawyerHood | [repo](https://github.com/SawyerHood/sawyer-plugins/tree/HEAD/plugins/nav-rail) | 13 | Make more room for threads with a vertical strip of sidebar icons. Keep your sa… | chưa kiểm tra | ứng viên |  |
| Miku Companion | SawyerHood | [repo](https://github.com/SawyerHood/sawyer-plugins/tree/HEAD/plugins/miku) | 11 | Keep Hatsune Miku beside you while you work, with a roaming pixel-art companion… | chưa kiểm tra | ứng viên |  |
| Vesper | dillionverma | [repo](https://github.com/dillionverma/bb-plugin-vesper) | 11 | Recolor BB, its diffs and its terminal in Vesper's peppermint and orange. Pick … | chưa kiểm tra | ứng viên |  |
| Haze | AdzeB | [repo](https://github.com/AdzeB/bb-plugin-haze) | 10 | Puts your own image behind every BB conversation as a soft haze that fades out … | chưa kiểm tra | ứng viên |  |
| Prism Frame | brsbl | [repo](https://github.com/brsbl/bb-plugins) | 10 | Give your app frame a moving sheen and your mention pills a glass finish that f… | chưa kiểm tra | ứng viên |  |
| Pokecut Theme | VKirill | [repo](https://github.com/VKirill/bb-plugin-pokecut-theme) | 9 | Turns bb into a soft dashboard: a gray shell, the thread as a raised panel, whi… | chưa kiểm tra | ứng viên |  |
| Typography | n30g30 | [repo](https://github.com/n30g30/bb-plugin-typography) | 9 | Set your own interface and code fonts in bb, down to size, line height, bold we… | chưa kiểm tra | ứng viên |  |
| Zen Koi | rejarevaldy | [repo](https://github.com/rejarevaldy/zen-koi) | 9 | Watch pixel-art koi swim under your chat input while the agent works, and scoop… | chưa kiểm tra | ứng viên |  |
| Model & Effort Badges | neoromantic | [repo](https://github.com/neoromantic/bb-plugin-model-effort-badges) | 8 | See each thread’s model and reasoning effort in the BB sidebar. Hover for the f… | chưa kiểm tra | ứng viên |  |
| Thread Glow | aMoonshine | [repo](https://github.com/aMoonshine/bb-plugin-thread-glow) | 8 | Find threads after their agents stop working. See an orange highlight in the th… | chưa kiểm tra | ứng viên |  |
| Flexoki | ponomr | [repo](https://github.com/ponomr/bb-plugin-flexoki) | 7 | Read and write on warm paper and ink with Flexoki by Steph Ango (kepano/flexoki… | chưa kiểm tra | ứng viên |  |
| Kujo | robertdevore | [repo](https://github.com/kujolang/bb-kujo) | 7 | Give bb the paper-and-ink design of Kujo, with hard edges and quiet background … | chưa kiểm tra | ứng viên |  |
| Ocean Dark | jtattreo | [repo](https://github.com/Treo-Solutions/bb-plugin-ocean-dark) | 7 | Give BB blue-grey surfaces, sky-blue accents and teal highlights. Matching synt… | chưa kiểm tra | ứng viên |  |
| Tab Close Right | brzvsk | [repo](https://github.com/brzvsk/bb-plugins/tree/HEAD/plugins/tab-close-right) | 6 | Keep tab icons visible and close tabs from the right. Active tabs always show t… | chưa kiểm tra | ứng viên |  |
| Chat Width | werserk | [repo](https://github.com/werserk/bb-plugin-chat-width) | 5 | Give your conversations the room they need. Save separate Reading and Wide widt… | MIT (đã xem LICENSE 2026-11-19) | đã chuyển (một phần) | Chỉ lấy CSS selector + biến độ rộng; chưa có chế độ Reading/Wide |
| Theme Glass | rayzalzero | [repo](https://github.com/rayzalzero/bb-plugin-theme-glass) | 5 | Turns bb's chrome into frosted glass over a soft mesh wallpaper, in light and d… | chưa kiểm tra | ứng viên |  |
| Cortado | vburojevic | [repo](https://github.com/vburojevic/bb-plugin-cortado) | 4 | Neutral graphite with warm orange and amber, in light and dark. Three palettes:… | chưa kiểm tra | ứng viên |  |
| Maxwell | m3nowak | [repo](https://github.com/m3nowak/bb-plugin-maxwell) | 4 | Keep Maxwell beside your BB conversations. | chưa kiểm tra | ứng viên |  |
| Notion Theme | KosachMax | [repo](https://github.com/KosachMax/bb-plugin-notion-theme) | 3 | Give BB Notion's page colours and type in light and dark, then pick Default, Se… | chưa kiểm tra | ứng viên |  |
| Rad Binder | steveafrost | [repo](https://github.com/steveafrost/bb-theme-rad-binder) | 3 | Turn bb into an 80s/90s school-binder cover, with neon confetti, striped edges … | chưa kiểm tra | ứng viên |  |
| 简体中文语言包 · Simplified Chinese | YuuseiP | [repo](https://github.com/YuuseiP/bb-plugin-zh-cn) | 3 | Use Simplified Chinese across BB menus, settings and built-in panels while keep… | MIT (đã xem LICENSE 2026-11-19) | đã chọn |  | thay chữ giao diện bằng từ điển 5.914 câu, dành cho bb 0.49; mẫu để làm bản tiếng Việt |
| Ghostrunner | MateoCerquetella | [repo](https://github.com/MateoCerquetella/bb-plugins/tree/HEAD/plugins/ghostrunner) | 2 | Turn BB into a cyberpunk console with near-black panels, a hot red accent, cyan… | chưa kiểm tra | ứng viên |  |
| Home Hero | lalitjeevanrao | [repo](https://github.com/lalitjeevanrao/bb-plugins/tree/HEAD/packages/bb-plugin-home-hero) | 2 | Greets you on BB's home screen with the time of day and, when you set one, your… | chưa kiểm tra | ứng viên |  |
| Minus | n30g30 | [repo](https://github.com/n30g30/bb-plugin-minus) | 2 | Hide the bb controls you never click and fold runs of tool calls into one "Call… | chưa kiểm tra | ứng viên |  |
| Model Favicons | linncolnx | [repo](https://github.com/linncolnx/bb-plugin-model-favicons) | 2 | Gives every agent its own logo, so custom ACP agents stop sharing one generic i… | chưa kiểm tra | ứng viên |  |
| Pinch Zoom | gsxdsm | [repo](https://github.com/gsxdsm/bb-plugin-pinch-zoom) | 2 | Resize bb's chat, composer and terminal text with a pinch, or switch a setting … | chưa kiểm tra | ứng viên |  |
| Typewriter | creshka | [repo](https://github.com/creshka/bb-plugin-typewriter) | 1 | Hear IBM Selectric clicks as you type in BB, with five WAV sounds included. Set… | chưa kiểm tra | ứng viên |  |
| Backdrop | vitalio-sh | [repo](https://github.com/vitalio-sh/bb-plugin-backdrop) |  | Tells your projects apart at a glance with a quiet wallpaper drawn from what ea… | chưa kiểm tra | ứng viên |  |
| Graphite Mono | ponomr | [repo](https://github.com/ponomr/bb-plugin-graphite-mono) |  | Set BB in JetBrains Mono at Light weight with a compact reading scale and a rou… | chưa kiểm tra | ứng viên | cần tài khoản/API ngoài |
