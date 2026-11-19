# hagi-agent-insight — Theo dõi agent

Xem agent đã làm gì và tốn gì: traces, board, session log, tiến độ plan, token, tóm tắt.

## Plugin này đang có gì (bạn cập nhật khi làm)

Mỗi tính năng là một module riêng và một công tắc (mặc định tắt).
Trạng thái: `dự kiến` · `đang làm` · `xong` · `bỏ`.

| Tính năng | Khóa công tắc | Trạng thái | Lấy ý từ plugin | Ghi chú |
|---|---|---|---|---|
|  |  |  |  |  |

## Plugin tham khảo (60, tạo ngày 2026-11-19 từ `bb plugin search`)

Trạng thái: `ứng viên` · `đã chọn` · `đã chuyển` · `bỏ`. Sửa cột **Giấy phép** và **Trạng thái** trực tiếp. Chỉ chuyển code khi giấy phép cho phép và đã ghi vào `PROVENANCE.md`.

| Plugin | Tác giả | Mã nguồn | Lượt cài | Mô tả | Giấy phép | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|---|
| Usage Tracker | MateoCerquetella | [repo](https://github.com/MateoCerquetella/bb-plugins/tree/HEAD/plugins/usage-tracker) | 682 | See subscription limits without leaving BB. Track Codex, Claude Code, Cursor, G… | chưa kiểm tra | ứng viên |  |
| Agent Graph | nathancolgate | [repo](https://github.com/nathancolgate/bb-plugin-agent-graph) | 609 | Shows your bb agents as a live node graph of threads, turns, tool calls, subage… | chưa kiểm tra | ứng viên |  |
| Context Meter | Hazihell | [repo](https://github.com/Hazihell/bb-plugin-context-meter) | 405 | Keeps threads in the smart zone, by tracking context against a limit you set ra… | chưa kiểm tra | ứng viên |  |
| Agent Board | aaronphifer | [repo](https://github.com/aaronphifer/bb-plugin-agent-board) | 393 | Follow live BB agent activity, freshness, completion outcomes and monitoring he… | chưa kiểm tra | ứng viên |  |
| Usage | MayankBansal12 | [repo](https://github.com/MayankBansal12/bb-plugin-usage) | 373 | Tracks coding-agent token usage and estimated API cost across enrolled machines. | chưa kiểm tra | ứng viên |  |
| Agent Traces | charpeni | [repo](https://github.com/charpeni/bb-plugins/tree/HEAD/plugins/agent-traces) | 357 | See where your agents' time goes, from every thread down to each command, tool … | chưa kiểm tra | ứng viên |  |
| Burn | kalindudc | [repo](https://github.com/kalindudc/burn) | 334 | See what every agent thread costs in dollars while it runs, per prompt and acro… | chưa kiểm tra | ứng viên |  |
| AI Usage | neoromantic | [repo](https://www.npmjs.com/package/@goodit/bb-plugin-ai-usage) | 231 | See what your team's Claude Code, Codex and Grok subscriptions have left, when … | chưa kiểm tra | ứng viên |  |
| Auto Compact | Dummy-pixel-hash | [repo](https://github.com/Dummy-pixel-hash/bb-plugin-auto-compact) | 225 | Compacts thread context automatically once usage reaches a configurable percent… | chưa kiểm tra | ứng viên |  |
| Agent Calendar | charpeni | [repo](https://github.com/charpeni/bb-plugins/tree/HEAD/plugins/agent-calendar) | 223 | See what your agents worked on and when, as a calendar of work blocks or a week… | chưa kiểm tra | ứng viên |  |
| Usage | iamEvanYT | [repo](https://github.com/iamEvanYT/bb-usage-page) | 215 | Tracks Claude Code, Codex, and Pi token usage with estimated API costs in a bb … | chưa kiểm tra | ứng viên |  |
| Context Health | MacHatter1 | [repo](https://github.com/MacHatter1/bb-context-health) | 170 | See what contributes to your thread’s context usage. Search recorded text, insp… | chưa kiểm tra | ứng viên |  |
| Recap | MacHatter1 | [repo](https://github.com/MacHatter1/bb-recap) | 170 | Generates concise, display-only summaries for BB threads on demand or after the… | chưa kiểm tra | ứng viên |  |
| Headroom | prismatic7 | [repo](https://github.com/prismatic7/bb-plugin-headroom) | 123 | Context budget monitoring — tells agents how much of the model's context window… | chưa kiểm tra | ứng viên |  |
| Agent TV | MacHatter1 | [repo](https://github.com/MacHatter1/bb-plugin-agent-tv) | 121 | See what every running agent is doing, and which one needs you, from a live wal… | chưa kiểm tra | ứng viên |  |
| Provider Usage | braedonsaunders | [repo](https://github.com/braedonsaunders/bb-plugin-provider-usage) | 109 | Shows how much of each provider's plan is left — every rate-limit window, perce… | chưa kiểm tra | ứng viên |  |
| Antigravity Usage | defacid | [repo](https://github.com/defacid/bb-antigravity-usage) | 96 | See separate Antigravity weekly quota windows for Gemini and Claude/GPT models … | chưa kiểm tra | ứng viên |  |
| Grok Build Usage | MacHatter1 | [repo](https://github.com/MacHatter1/bb-plugin-grok-build-usage) | 80 | Adds live Grok Build subscription and weekly credit usage, including reset timi… | chưa kiểm tra | ứng viên |  |
| Usage Meter | xMinor-1 | [repo](https://github.com/xMinor-1/bb-plugins/tree/HEAD/plugins/usage-meter) | 66 | Shows Claude subscription limits as two rings around a sidebar footer button — … | chưa kiểm tra | ứng viên |  |
| Lanes | slogsdon | [repo](https://www.npmjs.com/package/bb-plugin-lanes) | 59 | Shows every model lane's headroom in one place, adding OpenCode Zen Go and Open… | chưa kiểm tra | ứng viên |  |
| Rtk | prismatic7 | [repo](https://github.com/prismatic7/bb-plugin-rtk) | 53 | Agent-invoked shell tool — rewrites commands through the external rtk CLI for f… | chưa kiểm tra | ứng viên |  |
| Claude Switcher | Finolaina | [repo](https://github.com/Finolaina/bb-plugin-claude-switcher) | 51 | See every Claude Code account in one usage panel, pick the account before a new… | chưa kiểm tra | ứng viên |  |
| Pool Usage | rebryk | [repo](https://github.com/rebryk/bb-plugins/tree/HEAD/pool-usage) | 49 | See how much of each provider's capacity is in use and when it frees up, right … | chưa kiểm tra | ứng viên |  |
| Tokenomics | danielbachhuber | [repo](https://github.com/danielbachhuber/bb-plugins/tree/HEAD/bb-plugin-tokenomics) | 49 | See what your threads cost in tokens and time, and whether your subscription's … | chưa kiểm tra | ứng viên |  |
| Turn TPS | bottlebrushes | [repo](https://github.com/bottlebrushes/bb-plugin-turn-tps) | 40 | Show tokens per second on every completed turn, so a slow answer is visible wit… | chưa kiểm tra | ứng viên |  |
| RPIV Todo | ZhenHuangLab | [repo](https://github.com/ZhenHuangLab/bb-rpiv-todo-renderer) | 34 | Renders Pi rpiv-todo tasks in BB's native composer to-do panel. | chưa kiểm tra | ứng viên |  |
| Usage Bar | dmitriikapustin | [repo](https://github.com/dmitriikapustin/bb-plugins-by-kapustin/tree/HEAD/plugins/usage-bar) | 33 | Keep provider quotas and reset times above the sidebar footer. Open quota detai… | chưa kiểm tra | ứng viên |  |
| Plan Progress | mrsu-smirnov | [repo](https://github.com/mrsu-smirnov/bb-plugin-plan-progress) | 32 | Follow the agent's plan above the message box, with stages, steps and status fo… | chưa kiểm tra | ứng viên |  |
| Receipts | ChrBoebel | [repo](https://github.com/ChrBoebel/bb-plugin-receipts) | 30 | Compare coding-agent token usage and estimated API cost in one dashboard. Switc… | chưa kiểm tra | ứng viên |  |
| Limits — usage rings | artwist-polyakov | [repo](https://github.com/artwist-polyakov/bb-plugins/tree/HEAD/limits) | 24 | A floating pill in the bottom-right corner shows how much of your coding-plan q… | chưa kiểm tra | ứng viên |  |
| Cache Watch [Experimental] | SergeyZh | [repo](https://github.com/SergeyZh/bb-plugin-cache-watch) | 20 | See how much prompt caching each turn reuses and what its tokens would cost at … | chưa kiểm tra | ứng viên |  |
| Session Log | kalindudc | [repo](https://github.com/kalindudc/bb-marketplace/tree/HEAD/plugins/session-log) | 19 | Check what an agent actually ran, changed and decided, in one live log beside t… | chưa kiểm tra | ứng viên |  |
| Usage Pace | chug2k | [repo](https://github.com/chug2k/bb-plugin-usage-pace) | 19 | Tells you if your current rate lasts until each quota window resets. In bb's us… | chưa kiểm tra | ứng viên |  |
| Catch Up | CrazyCoder | [repo](https://github.com/CrazyCoder/bb-plugin-catchup) | 14 | Shows a short recap above the composer, so you can pick up a thread without rer… | chưa kiểm tra | ứng viên |  |
| Kimi Usage | fgbm | [repo](https://github.com/fgbm/bb-plugin-kimi-usage) | 10 | Shows the Kimi Code 5-hour and monthly limits in bb's usage panel, where no col… | chưa kiểm tra | ứng viên |  |
| Thread Time Machine | MacHatter1 | [repo](https://github.com/MacHatter1/bb-plugin-thread-time-machine) | 10 | Step through everything an agent did in any thread, and diff its file changes b… | chưa kiểm tra | ứng viên |  |
| Usage Limits | dmitriikapustin | [repo](https://github.com/dmitriikapustin/bb-plugins-by-kapustin/tree/HEAD/plugins/usage-limits) | 10 | See provider quota windows and reset times without leaving your work. View deta… | chưa kiểm tra | ứng viên |  |
| Flare | kalindudc | [repo](https://github.com/kalindudc/bb-marketplace/tree/HEAD/plugins/flare) | 9 | Let an agent tell you what it found while it is still working, not only in the … | chưa kiểm tra | ứng viên |  |
| GitHub Copilot Usage | defacid | [repo](https://github.com/defacid/bb-copilot-usage) | 9 | See GitHub Copilot AI-credit or premium-request usage beside your other BB prov… | chưa kiểm tra | ứng viên | cần tài khoản/API ngoài |
| Usage Forecast | ponomr | [repo](https://github.com/ponomr/bb-plugin-usage-forecast) | 9 | Forecast whether your Claude Code and Codex limits last until reset, and see ea… | chưa kiểm tra | ứng viên |  |
| Kimi Quota | Anatolt | [repo](https://github.com/Anatolt/bb-plugin-kimi-quota) | 8 | See Kimi Code quota beside Codex and Claude limits in one BB usage card. Shows … | chưa kiểm tra | ứng viên |  |
| Context Katamari | brsbl | [repo](https://github.com/brsbl/bb-plugins/tree/HEAD/plugins/context-katamari) | 7 | Shows how full each thread's context window is as a katamari that grows with ev… | chưa kiểm tra | ứng viên |  |
| Higgsfield Credits | VladPolet | [repo](https://github.com/VladPolet/bb-plugin-higgsfield) | 7 | Shows how many Higgsfield credits you have, when they reset, and how many will … | chưa kiểm tra | ứng viên |  |
| Magpie | vaayne | [repo](https://github.com/vaayne/agent-kit/tree/HEAD/bb-extensions/magpie) | 7 | Connect BB to a Magpie gateway and see what your agents cost. The Magpie page s… | chưa kiểm tra | ứng viên |  |
| Model Pricing | gpambrozio | [repo](https://github.com/gpambrozio/bb-plugins/tree/HEAD/model-pricing) | 7 | Compare what every AI model costs per million tokens, across Anthropic, OpenAI,… | chưa kiểm tra | ứng viên |  |
| Simple Summaries | bottlebrushes | [repo](https://github.com/bottlebrushes/bb-simple-summaries) | 7 | Keep the latest thread summary in view as small italic text above the composer.… | chưa kiểm tra | ứng viên |  |
| Tracing | viartemev | [repo](https://github.com/viartemev/bb-tracing/tree/HEAD/bb-plugin-tracing) | 7 | See where every second of an agent turn went, one click from the answer it prod… | chưa kiểm tra | ứng viên |  |
| Touch Bar Agent Monitor | MateoCerquetella | [repo](https://github.com/MateoCerquetella/bb-plugins/tree/HEAD/plugins/touchbar) | 6 | Keep BB agent status and guarded controls on a MacBook Pro Touch Bar across eve… | chưa kiểm tra | ứng viên |  |
| Usage Explorer | ahsan7162 | [repo](https://github.com/ahsan7162/bb-plugin-claude-usage) | 6 | See how much of your Claude plan is left and where your AI coding spend went, b… | chưa kiểm tra | ứng viên |  |
| Context Handoff | RoRoGitr | [repo](https://github.com/RoRoGitr/bb-plugin-context-handoff) | 5 | Track context usage as a percentage and safely continue long tasks in fresh thr… | chưa kiểm tra | ứng viên |  |
| Copilot AI Credits | balazstasi | [repo](https://github.com/balazstasi/bb-plugin-copilot-aic-usage) | 5 | Track Copilot AI credits in your BB thread. See this session's usage, today's h… | chưa kiểm tra | ứng viên |  |
| Copilot session credits | lalitjeevanrao | [repo](https://github.com/lalitjeevanrao/bb-plugins/tree/HEAD/packages/bb-plugin-copilot-session-credits) | 3 | Track reported GitHub Copilot credit usage for each BB thread. Click the indica… | chưa kiểm tra | ứng viên |  |
| Subscription Pace | steveafrost | [repo](https://github.com/steveafrost/bb-plugin-subscription-pace) | 2 | See whether every AI subscription you pay for will last until it renews. Tracks… | chưa kiểm tra | ứng viên |  |
| Decisions | robertsinke | [repo](https://github.com/robertsinke/bb-plugin-decisions) | 1 | Gets a probability for a typed question, and keeps the TypeSafe API key in one … | chưa kiểm tra | ứng viên |  |
| OpenTelemetry | lanjak | [repo](https://github.com/lanjak/bb-plugin-otel) | 1 | Send per-turn token, cost and quota data from bb to the OpenTelemetry collector… | chưa kiểm tra | ứng viên |  |
| Project Usage Sort | Willhong | [repo](https://github.com/Willhong/bb-plugin-project-usage-sort) | 1 | Puts the projects you work in most at the top of bb's project lists, re-ranked … | chưa kiểm tra | ứng viên |  |
| Ollama Usage | fgbm | [repo](https://github.com/fgbm/bb-plugin-ollama-usage) |  | Shows what is left in the Ollama Cloud monthly credit pool, with its reset date… | chưa kiểm tra | ứng viên |  |
| Thread Changes Map | jaydeland | [repo](https://github.com/jaydeland/bb-plugin-thread-changes-map) |  | See which parts of your system a thread's work touches, on a live diagram that … | chưa kiểm tra | ứng viên |  |
| Token Pass Pace | steveafrost | [repo](https://github.com/steveafrost/bb-plugin-token-pass-pace) |  | See whether your Vercel Token Pass will last the billing period, before it runs… | chưa kiểm tra | ứng viên |  |
| Usage & Limits | startsevdev | [repo](https://github.com/startsevdev/bb-plugin-usage-and-limits) |  | See whether your quota will last and which threads or recurring jobs used the m… | chưa kiểm tra | ứng viên |  |
