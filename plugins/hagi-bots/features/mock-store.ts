import { useSyncExternalStore } from "react";

// Dữ liệu giả cho vỏ UI: sống trong bộ nhớ, mất khi reload. Không đọc/ghi
// trạng thái thật của bots-sidebar hay BB.
export interface MockThread {
  id: string;
  title: string;
  status: "idle" | "working" | "waiting";
  children?: MockThread[];
}

export interface MockBot {
  id: string;
  name: string;
  role: string;
  color: string;
  shape: "round" | "square" | "hex";
  soul: string;
  memory: string;
  playbook: string;
  episodes: string[];
  lastActivity: string;
  createdAt: string;
  turns: number;
  projects: { id: string; name: string; role: "owner" | "member" }[];
  threads: MockThread[];
  // Live bot: revision CAS cho hb_bot_update; mock không có.
  updatedAt?: number;
}

// Trạng thái bot suy ra từ thread: chờ input > đang làm > nghỉ (ưu tiên như bản gốc).
export type BotStatus = "working" | "waiting" | "idle";
export const STATUS_LABEL: Record<BotStatus, string> = {
  working: "Đang làm",
  waiting: "Chờ input",
  idle: "Nghỉ",
};

export function botStatus(bot: MockBot): BotStatus {
  const statuses = bot.threads.flatMap((thread) => [thread.status, ...(thread.children?.map((child) => child.status) ?? [])]);
  if (statuses.includes("waiting")) return "waiting";
  if (statuses.includes("working")) return "working";
  return "idle";
}

export function countWaitingThreads(bots: MockBot[]): number {
  return bots.reduce(
    (total, bot) =>
      total +
      bot.threads.reduce(
        (n, thread) => n + (thread.status === "waiting" ? 1 : 0) + (thread.children?.filter((child) => child.status === "waiting").length ?? 0),
        0,
      ),
    0,
  );
}

export interface BotDraft {
  name: string;
  role: string;
  color: string;
  shape: MockBot["shape"];
  soul: string;
  memory: string;
  playbook: string;
}

// Guidance cố định: trong bản thật là text tĩnh trong code plugin, inject khi
// tools bot được chọn — không phải dữ liệu bot, không sửa được.
export const MOCK_GUIDANCE =
  "Guidance cố định (do plugin quản lý, không sửa được). Bản thật gồm: cách nhắn bot khác qua `bb bots`, quy ước tool bot_read_state/bot_update_state, luật ownership project, và quy tắc MEMORY tối đa 3000 ký tự kèm cách xử lý khi tràn.";

const seed: MockBot[] = [
  {
    id: "hb_scribe",
    name: "Scribe",
    role: "Writer",
    color: "#8b5cf6",
    shape: "round",
    soul: "# SOUL\nBot viết tài liệu: giọng rõ, ngắn, có cấu trúc.",
    memory: "- README giữ tối đa 40 dòng\n- Ưu tiên bảng khi so sánh",
    playbook: "- Tóm tắt thay đổi theo nhóm file, không theo thời gian\n- Luôn link tới file dòng khi nêu vấn đề",
    episodes: [
      "20/11 — Viết lại mục Getting Started: gộp 3 bước cài thành 1 lệnh",
      "19/11 — Review lỗi chính tả: sửa 14 chỗ, không đổi nội dung",
    ],
    lastActivity: "Đang chạy 12 phút",
    createdAt: "Vào đội 41 ngày",
    turns: 182,
    projects: [
      { id: "proj_docs", name: "docs-site", role: "owner" },
      { id: "proj_bb", name: "bb-workbench", role: "member" },
    ],
    threads: [
      {
        id: "t_scribe_1",
        title: "Viết lại hướng dẫn onboarding",
        status: "working",
        children: [
          { id: "t_scribe_1a", title: "Nhánh: rà soát lỗi chính tả", status: "idle" },
        ],
      },
      { id: "t_scribe_2", title: "Soạn changelog tháng 11", status: "idle" },
    ],
  },
  {
    id: "hb_radar",
    name: "Radar",
    role: "Reviewer",
    color: "#06b6d4",
    shape: "square",
    soul: "# SOUL\nBot review: đọc kỹ diff, nêu rủi ro trước khi khen.",
    memory: "- Kiểm tra xử lý lỗi ở trust boundary\n- Luôn hỏi lại nếu yêu cầu mơ hồ",
    playbook: "- Nêu rủi ro trước, gợi ý sau\n- Comment lỗi nhỏ gom một bình luận",
    episodes: ["20/11 — Review PR #42: phát hiện race condition ở cache"],
    lastActivity: "Chờ input 2 giờ",
    createdAt: "Vào đội 18 ngày",
    turns: 67,
    projects: [{ id: "proj_bb", name: "bb-workbench", role: "member" }],
    threads: [
      {
        id: "t_radar_1",
        title: "Review PR nhóm sản phẩm",
        status: "waiting",
        children: [
          { id: "t_radar_1a", title: "Nhánh: kiểm tra test coverage", status: "working" },
          { id: "t_radar_1b", title: "Nhánh: soát type lỏng", status: "idle" },
        ],
      },
    ],
  },
  {
    id: "hb_bench",
    name: "Bench",
    role: "Ops",
    color: "#f59e0b",
    shape: "hex",
    soul: "# SOUL\nBot vận hành: theo dõi tiến độ, nhắc việc còn treo.",
    memory: "",
    playbook: "",
    episodes: [],
    lastActivity: "Nghỉ 3 ngày",
    createdAt: "Vào đội 9 ngày",
    turns: 24,
    projects: [],
    threads: [
      { id: "t_bench_1", title: "Tổng hợp tình trạng tuần", status: "idle" },
      { id: "t_bench_2", title: "Dọn thread quá hạn", status: "idle" },
      { id: "t_bench_3", title: "Đo thời gian build plugin", status: "idle" },
    ],
  },
];

let bots: MockBot[] = seed;
// USER.md dùng chung cho mọi bot (hồ sơ người dùng — cùng một người dùng BB).
let userMd = "- Gọi tôi là Hagi\n- Trả lời tiếng Việt, câu ngắn";
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useBots(): MockBot[] {
  return useSyncExternalStore(subscribe, () => bots);
}

export function useUserMd(): string {
  return useSyncExternalStore(subscribe, () => userMd);
}

export function saveUserMd(next: string) {
  userMd = next;
  emit();
}

// Trạng thái dialog sửa/tạo: dùng chung giữa sidebar và trang (2 slot mount riêng).
export type EditorTarget = { kind: "create" } | { kind: "edit"; botId: string };
let editor: EditorTarget | null = null;

export function useEditorTarget(): EditorTarget | null {
  return useSyncExternalStore(subscribe, () => editor);
}

export function openEditor(target: EditorTarget) {
  editor = target;
  emit();
}

export function closeEditor() {
  editor = null;
  emit();
}

export function saveBot(draft: BotDraft, botId?: string) {
  if (botId) {
    bots = bots.map((bot) => (bot.id === botId ? { ...bot, ...draft } : bot));
  } else {
    const id = `hb_${Date.now().toString(36)}`;
    bots = [...bots, { id, threads: [], projects: [], episodes: [], lastActivity: "Vừa tạo", createdAt: "Vừa vào đội", turns: 0, ...draft }];
  }
  emit();
  return true;
}

export function addMockThread(botId: string, title: string) {
  bots = bots.map((bot) =>
    bot.id === botId
      ? { ...bot, threads: [{ id: `t_${Date.now().toString(36)}`, title, status: "idle" as const }, ...bot.threads] }
      : bot,
  );
  emit();
}
