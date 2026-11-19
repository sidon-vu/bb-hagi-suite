// Tạo sườn plugin + file catalog. CHỈ tạo file chưa có, không bao giờ ghi đè (file catalog do bạn sửa tay).
// Chạy: node scripts/seed.mjs        (cần `bb` trong PATH để đọc danh sách chợ)
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// ---- 1. Các plugin của bạn (nhóm) ------------------------------------------------
const GROUPS = [
  { id: "hagi-chat-reading", title: "Đọc chat", icon: "BookOpen",
    goal: "Đọc và tìm trong cuộc trò chuyện: tìm kiếm, mốc giờ, minimap, ghim lượt hỏi, tooltip link." },
  { id: "hagi-rich-render", title: "Hiển thị phong phú", icon: "Sparkles",
    goal: "Biến câu trả lời của agent thành sơ đồ, công thức, biểu đồ, bảng, giao diện." },
  { id: "hagi-composer", title: "Soạn tin", icon: "PenLine",
    goal: "Ô nhập tin: gợi ý prompt, cải thiện prompt, phím gửi, emoji, dán thuần text, hàng đợi." },
  { id: "hagi-thread-nav", title: "Điều hướng thread", icon: "PanelLeft",
    goal: "Sidebar, tab, tag, ghim, lưu trữ, đổi tên, chuyển nhanh giữa các thread. Nhiều bản thay sidebar, chỉ 1 bản chạy được: dùng ô chọn (select), không dùng công tắc." },
  { id: "hagi-agent-insight", title: "Theo dõi agent", icon: "Activity",
    goal: "Xem agent đã làm gì và tốn gì: traces, board, session log, tiến độ plan, token, tóm tắt." },
  { id: "hagi-code-review", title: "Code và review", icon: "GitPullRequest",
    goal: "Diff, PR, git, annotate trình duyệt, comment và review trong chat." },
  { id: "hagi-tasks-memory", title: "Việc và ghi nhớ", icon: "ListChecks",
    goal: "Tasks, workflow, ghi chú, memory, skill, thư viện prompt." },
  { id: "hagi-appearance", title: "Giao diện", icon: "Palette",
    goal: "Theme, màu, hiệu ứng. Theme chỉ cần 1 bản đang dùng." },
  { id: "hagi-files", title: "Xem và sửa file", icon: "FileText",
    goal: "Xem trước và sửa file: PDF, markdown, ảnh, code." },
  { id: "hagi-ops", title: "Vận hành", icon: "Wrench",
    goal: "Thông báo, terminal, giám sát máy, tiện ích." },
];

// ---- 2. Luật xếp plugin tham khảo vào nhóm ----------------------------------------
const BY_CATEGORY = {
  "Thread Content": "hagi-chat-reading",
  "Thread Management": "hagi-thread-nav",
  "Token Usage & Limits": "hagi-agent-insight",
  "Code & Reviews": "hagi-code-review",
  "Tasks & Workflows": "hagi-tasks-memory",
  "Memory & Context": "hagi-tasks-memory",
  "Themes & Appearance": "hagi-appearance",
  "File Viewers & Editors": "hagi-files",
  "Utilities": "hagi-ops",
  "Notifications": "hagi-ops",
  "Command Line": "hagi-ops",
};
// Không gộp: giữ riêng để nguyên (khóa bí mật, dịch vụ nền, hạ tầng).
const NOT_MERGED = ["Agents & Providers", "Environments & Cloud", "Plugin Development", "Security", "Uncategorized"];
// Ngoại lệ theo tên, chỉ áp dụng trong 2 danh mục lớn. Luật đầu tiên khớp thì thắng.
const OVERRIDES = {
  "Thread Content": [
    ["hagi-chat-reading", /^(sticky prompt|prompt log)$/i],
    ["hagi-rich-render", /mermaid|latex|diagram|generative ui|impromptu|visualiz|iris|openui|md prompt|color swatch|image preview|table expand|canvas|mesh gradient|syns|thread pages|thread images/i],
    ["hagi-composer", /composer|prompt|ctrl\+enter|emoji picker|plain paste|re-phrase|dictation|hashstash|quick reply|followups|smart queue|skill dial|nudge|chat dock|hands-free/i],
    ["hagi-agent-insight", /trac(e|ing)|agent board|session log|plan progress|time machine|changes map|recap|summaries|catch up|flare|rpiv/i],
    ["hagi-tasks-memory", /notes|pinned files|bookmarks|^references$|floating notes/i],
    ["hagi-code-review", /inline (comments|review)|browser annotate/i],
    ["hagi-thread-nav", /thread tabs|chat tabs/i],
  ],
  "Thread Management": [
    ["hagi-composer", /quick (chat|compose|thread)|ultra launcher/i],
    ["hagi-appearance", /glow|tinted|badges/i],
    ["hagi-agent-insight", /agent (calendar|graph|tv)|touch bar agent|project usage/i],
    ["hagi-tasks-memory", /kanban|focus board|gtd|responsibilities/i],
  ],
};
// Ghi chú tự động (đoán theo tên, hãy kiểm tra lại khi đọc mã).
const NEEDS_EXTERNAL = /github|gitlab|gitea|jira|linear|asana|sentry|launchdarkly|shortcut|telegram|ntfy|web push|kubernetes|graphite|dependabot|browserbase|qlik|mattermost/i;
const MAY_REPLACE_SIDEBAR = /sidebar|switcher|tabs|spaces|workspaces|tree|lanes|homepage|navigation/i;

function groupOf(p) {
  for (const [g, re] of OVERRIDES[p.category] ?? []) if (re.test(p.displayName)) return g;
  return BY_CATEGORY[p.category] ?? null;
}
function notesOf(p, g) {
  const n = [];
  if (NEEDS_EXTERNAL.test(p.displayName)) n.push("cần tài khoản/API ngoài");
  if (g === "hagi-thread-nav" && MAY_REPLACE_SIDEBAR.test(p.displayName)) n.push("có thể thay sidebar (độc quyền)");
  return n.join("; ");
}

// ---- 3. Ghi file (không ghi đè) ----------------------------------------------------
function put(rel, content) {
  const f = join(root, rel);
  if (existsSync(f)) return false;
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, content);
  return true;
}
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
const short = (s, n) => (cell(s).length > n ? cell(s).slice(0, n - 1) + "…" : cell(s));

const raw = JSON.parse(execSync('bb plugin search "" --json', { maxBuffer: 1 << 27, encoding: "utf8" }));
const external = raw.filter((p) => !String(p.source).startsWith("builtin:"));
const today = new Date().toISOString().slice(0, 10);

const buckets = Object.fromEntries(GROUPS.map((g) => [g.id, []]));
const notMerged = [];
const unmapped = [];
for (const p of external) {
  const g = groupOf(p);
  if (g) buckets[g].push(p);
  else (NOT_MERGED.includes(p.category) ? notMerged : unmapped).push(p);
}
const sortRefs = (a, b) => (Number(b.installs) || 0) - (Number(a.installs) || 0) || a.displayName.localeCompare(b.displayName);
const refRow = (p, g) => `| ${cell(p.displayName)} | ${cell(p.author?.github ?? p.author?.name)} | ${p.repositoryUrl ? `[repo](${p.repositoryUrl})` : ""} | ${Number(p.installs) || ""} | ${short(p.description, 80)} | chưa kiểm tra | ứng viên | ${notesOf(p, g)} |`;
const REF_HEAD = "| Plugin | Tác giả | Mã nguồn | Lượt cài | Mô tả | Giấy phép | Trạng thái | Ghi chú |\n|---|---|---|---|---|---|---|---|";

for (const g of GROUPS) {
  const list = buckets[g.id].sort(sortRefs);
  put(`catalog/${g.id}.md`, `# ${g.id} — ${g.title}

${g.goal}

## Plugin này đang có gì (bạn cập nhật khi làm)

Mỗi tính năng là một module riêng và một công tắc (mặc định tắt).
Trạng thái: \`dự kiến\` · \`đang làm\` · \`xong\` · \`bỏ\`.

| Tính năng | Khóa công tắc | Trạng thái | Lấy ý từ plugin | Ghi chú |
|---|---|---|---|---|
|  |  |  |  |  |

## Plugin tham khảo (${list.length}, tạo ngày ${today} từ \`bb plugin search\`)

Trạng thái: \`ứng viên\` · \`đã chọn\` · \`đã chuyển\` · \`bỏ\`. Sửa cột **Giấy phép** và **Trạng thái** trực tiếp. Chỉ chuyển code khi giấy phép cho phép và đã ghi vào \`PROVENANCE.md\`.

${REF_HEAD}
${list.map((p) => refRow(p, g.id)).join("\n")}
`);

  const dir = `plugins/${g.id}`;
  const short_ = g.id;
  put(`${dir}/package.json`, JSON.stringify({
    name: `bb-plugin-${short_}`, version: "0.1.0", type: "module",
    engines: { bb: ">=0.50", bbPluginSdk: ">=0.6.157" },
    bb: { name: `Hagi — ${g.title}`, description: g.goal.split(".")[0] + ".", branding: { icon: g.icon }, server: "./server.ts", app: "./app.tsx" },
    devDependencies: { "@get-bb/plugin-sdk": "0.6.157", "@types/node": "^22.0.0", "@types/react": "^19.0.0", "@types/react-dom": "^19.0.0", typescript: "^5.7.0" },
  }, null, 2) + "\n");
  put(`${dir}/server.ts`, `import type { BbPluginApi } from "@get-bb/plugin-sdk";

export default async function plugin(bb: BbPluginApi) {
  bb.log.info("loaded");
  // Mỗi tính năng = một công tắc boolean, mặc định tắt. Thêm vào đây rồi ghi vào catalog/${g.id}.md.
  bb.settings.define({});
}
`);
  put(`${dir}/app.tsx`, `import { definePluginApp } from "@get-bb/plugin-sdk/app";

export default definePluginApp(() => {
  // Đăng ký slot ở đây. Mỗi tính năng đọc công tắc của nó và không hiển thị gì nếu đang tắt.
});
`);
  put(`${dir}/tsconfig.json`, JSON.stringify({
    compilerOptions: { strict: true, target: "ES2022", module: "ESNext", moduleResolution: "bundler", jsx: "react-jsx", lib: ["ES2022", "DOM"], types: ["node"], noEmit: true },
    include: ["server.ts", "app.tsx", "features"],
  }, null, 2) + "\n");
  put(`${dir}/README.md`, `# ${g.id}\n\n${g.goal}\n\nDanh sách tính năng và plugin tham khảo: [catalog/${g.id}.md](../../catalog/${g.id}.md).\n`);
}

put("catalog/_not-merged.md", `# Không gộp

Giữ nguyên bản chính chủ vì chứa khóa bí mật, dịch vụ nền hoặc hạ tầng. Tạo ngày ${today}: ${notMerged.length} plugin.

${REF_HEAD.replace("| Giấy phép | Trạng thái | Ghi chú |", "| Giấy phép | Trạng thái | Ghi chú |")}
${notMerged.sort(sortRefs).map((p) => refRow(p, "")).join("\n")}
`);
put(".bb/plugins.json", JSON.stringify({
  $schema: "https://getbb.app/schemas/plugins.schema.json", schemaVersion: 1, name: "hagi-suite",
  plugins: GROUPS.map((g) => ({ name: g.id, source: `./plugins/${g.id}` })),
}, null, 2) + "\n");
put(".gitignore", "node_modules/\ndist/\n");

console.log(Object.entries(buckets).map(([k, v]) => `${k}: ${v.length}`).join("\n"));
console.log(`not-merged: ${notMerged.length} | unmapped: ${unmapped.length} | builtin bỏ qua: ${raw.length - external.length}`);
if (unmapped.length) console.log("unmapped:", unmapped.map((p) => `${p.displayName} (${p.category})`).join(", "));
