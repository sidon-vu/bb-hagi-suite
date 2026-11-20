import path from "node:path";
import { existsSync } from "node:fs";
import type { BbPluginApi } from "@get-bb/plugin-sdk";
import type { HbotStore } from "./bot-store";
import type { HbotMetadata, HbotShape } from "./hagi-contract";

// Nhập từ bots-sidebar: đọc read-only qua ATTACH trên connection của chính mình
// (không mở handle ghi vào DB plugin khác). Chỉ chạy khi người dùng bấm nút —
// không tự động đọc state riêng của plugin khác.
interface LegacyRow {
  id: string;
  name: string;
  role: string;
  color: string;
  shape: HbotShape;
  soul: string;
  memory: string;
  order: number;
  updatedAt: number;
  extra: Record<string, unknown>;
  issues: string[];
}

export interface LegacyScan {
  found: boolean;
  error: string | null;
  bots: (Omit<LegacyRow, "extra"> & { threadCount: number; already: boolean })[];
  bindingCount: number;
  sectionCount: number;
  ownerCount: number;
}

const SHAPE_MAP: Record<string, HbotShape> = {
  round: "round",
  squircle: "square",
  hexagon: "hex",
};

function legacyDbPath(bb: BbPluginApi): string | null {
  try {
    const own = bb.storage.database().name; // <dataDir>/plugins/hagi-bots/data.db
    const candidate = path.join(path.dirname(own), "..", "bots-sidebar", "data.db");
    return existsSync(candidate) ? path.resolve(candidate) : null;
  } catch {
    return null;
  }
}

function clamp(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

function scan(bb: BbPluginApi): { dbPath: string | null; bots: LegacyRow[]; bindings: { threadId: string; botId: string }[]; sections: unknown[]; owners: { projectId: string; botId: string }[] } {
  const dbPath = legacyDbPath(bb);
  if (!dbPath) return { dbPath: null, bots: [], bindings: [], sections: [], owners: [] };
  const db = bb.storage.database();
  const esc = dbPath.replace(/'/g, "''");
  try {
    db.prepare(`ATTACH DATABASE '${esc}' AS legacy`).run();
    const rows = db.prepare("SELECT id, data FROM legacy.bots").all() as { id: string; data: string }[];
    const bindings = db.prepare("SELECT thread_id AS threadId, bot_id AS botId FROM legacy.bot_threads").all() as { threadId: string; botId: string }[];
    const sectionsRow = db.prepare("SELECT data FROM legacy.bot_state WHERE key = 'sections'").get() as { data: string } | undefined;
    const owners = db.prepare("SELECT project_id AS projectId, bot_id AS botId FROM legacy.bot_project_owners").all() as { projectId: string; botId: string }[];
    const sections = sectionsRow ? (JSON.parse(sectionsRow.data) as unknown[]) : [];
    const bots: LegacyRow[] = [];
    for (const row of rows) {
      let meta: Record<string, unknown>;
      try {
        meta = JSON.parse(row.data) as Record<string, unknown>;
      } catch {
        bots.push({ id: row.id, name: "(hỏng)", role: "", color: "#888888", shape: "round", soul: "", memory: "", order: 0, updatedAt: 0, extra: {}, issues: ["JSON hỏng — bỏ qua"] });
        continue;
      }
      const avatar = (meta.avatar ?? {}) as Record<string, unknown>;
      const soul = typeof meta.soul === "string" ? meta.soul : "";
      const memory = typeof meta.memory === "string" ? meta.memory : "";
      const issues: string[] = [];
      if (soul.length > 4096) issues.push(`SOUL ${soul.length} ký tự > 4096 — sẽ cắt bớt`);
      if (memory.length > 16384) issues.push(`MEMORY ${memory.length} ký tự > 16384 — sẽ cắt bớt`);
      if (typeof meta.name !== "string" || meta.name.length === 0) issues.push("Thiếu tên");
      const { soul: _s, memory: _m, agents: _a, name: _n, role: _r, avatar: _av, id: _i, order: _o, updatedAt: _u, ...extra } = meta;
      if (meta.agents) (extra as Record<string, unknown>).agents = meta.agents;
      bots.push({
        id: row.id,
        name: typeof meta.name === "string" ? meta.name : "(không tên)",
        role: typeof meta.role === "string" ? meta.role : "",
        color: typeof avatar.color === "string" && /^#[0-9a-fA-F]{6}$/.test(avatar.color) ? avatar.color : "#8b5cf6",
        shape: SHAPE_MAP[String(avatar.shape)] ?? "round",
        soul: clamp(soul, 4096),
        memory: clamp(memory, 16384),
        order: typeof meta.order === "number" ? meta.order : 0,
        updatedAt: typeof meta.updatedAt === "number" ? meta.updatedAt : Date.now(),
        extra,
        issues,
      });
    }
    return { dbPath, bots, bindings, sections, owners };
  } finally {
    try {
      db.prepare("DETACH DATABASE legacy").run();
    } catch {}
  }
}

export function legacyPreview(bb: BbPluginApi, store: HbotStore): LegacyScan {
  const { dbPath, bots, bindings, sections, owners } = scan(bb);
  if (!dbPath) return { found: false, error: "Không tìm thấy data.db của bots-sidebar", bots: [], bindingCount: 0, sectionCount: 0, ownerCount: 0 };
  const existing = new Set(store.list().map((bot) => bot.id));
  const counts = new Map<string, number>();
  for (const binding of bindings) counts.set(binding.botId, (counts.get(binding.botId) ?? 0) + 1);
  return {
    found: true,
    error: null,
    bots: bots.map(({ extra: _e, ...bot }) => ({ ...bot, threadCount: counts.get(bot.id) ?? 0, already: existing.has(bot.id) })),
    bindingCount: bindings.length,
    sectionCount: sections.length,
    ownerCount: owners.length,
  };
}

export function legacyApply(bb: BbPluginApi, store: HbotStore): { imported: number; skipped: { id: string; name: string; reason: string }[]; bindings: number; warnings: string[] } {
  const { dbPath, bots, bindings, sections, owners } = scan(bb);
  if (!dbPath) throw new Error("Không tìm thấy data.db của bots-sidebar");
  const existing = new Set(store.list().map((bot) => bot.id));
  const skipped: { id: string; name: string; reason: string }[] = [];
  const warnings: string[] = [];
  let imported = 0;
  let bound = 0;
  const validBotIds = new Set(bots.filter((bot) => !bot.issues.includes("JSON hỏng — bỏ qua")).map((bot) => bot.id));

  for (const bot of bots) {
    if (bot.issues.includes("JSON hỏng — bỏ qua")) {
      skipped.push({ id: bot.id, name: bot.name, reason: "JSON hỏng" });
      continue;
    }
    if (existing.has(bot.id)) {
      skipped.push({ id: bot.id, name: bot.name, reason: "đã có trong hagi-bots" });
      continue;
    }
    // Giữ nguyên id + thứ tự + mốc cũ (old metadata không có createdAt → dùng updatedAt)
    store.insert({
      id: bot.id,
      name: bot.name,
      role: bot.role,
      color: bot.color,
      shape: bot.shape,
      soul: bot.soul,
      memory: bot.memory,
      playbook: "",
      createdAt: bot.updatedAt,
      updatedAt: bot.updatedAt,
      order: bot.order,
    });
    store.setLegacyExtra(bot.id, bot.extra);
    imported += 1;
    for (const issue of bot.issues) warnings.push(`${bot.name}: ${issue}`);
  }

  for (const binding of bindings) {
    if (validBotIds.has(binding.botId) && store.get(binding.botId)) {
      store.bind(binding.threadId, binding.botId);
      bound += 1;
    }
  }
  store.setLegacyDump(sections, owners);
  return { imported, skipped, bindings: bound, warnings };
}
