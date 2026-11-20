import { randomUUID } from "node:crypto";
import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { hbotMetadataSchema, type HbotEpisode, type HbotMetadata } from "./hagi-contract";

const USER_MD_KEY = "user.md";

// SQLite riêng của plugin (bb.storage.database()); không đụng DB của bots-sidebar.
export function createHbotStore(bb: BbPluginApi) {
  const db = bb.storage.database();
  bb.storage.migrate(db, [
    "CREATE TABLE hbot_bots (id TEXT PRIMARY KEY, data TEXT NOT NULL)",
    "CREATE TABLE hbot_threads (thread_id TEXT PRIMARY KEY, bot_id TEXT NOT NULL REFERENCES hbot_bots(id))",
    "CREATE TABLE hbot_state (key TEXT PRIMARY KEY, data TEXT NOT NULL)",
    "CREATE TABLE hbot_episodes (id TEXT PRIMARY KEY, bot_id TEXT NOT NULL REFERENCES hbot_bots(id), thread_id TEXT, text TEXT NOT NULL, created_at INTEGER NOT NULL)",
    "CREATE INDEX hbot_episodes_by_bot ON hbot_episodes(bot_id, created_at)",
  ]);

  const raw = (botId: string) => db.prepare("SELECT data FROM hbot_bots WHERE id = ?").get(botId) as { data: string } | undefined;
  const get = (botId: string): HbotMetadata | null => {
    const row = raw(botId);
    return row ? hbotMetadataSchema.parse(JSON.parse(row.data)) : null;
  };
  const require = (botId: string): HbotMetadata => {
    const bot = get(botId);
    if (!bot) throw new Error("Bot không tồn tại");
    return bot;
  };
  const list = (): HbotMetadata[] =>
    (db.prepare("SELECT data FROM hbot_bots").all() as { data: string }[])
      .map((row) => hbotMetadataSchema.parse(JSON.parse(row.data)))
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const save = (bot: HbotMetadata): HbotMetadata => {
    const value = hbotMetadataSchema.parse(bot);
    db.prepare("INSERT INTO hbot_bots(id,data) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data").run(value.id, JSON.stringify(value));
    return value;
  };
  const create = (fields: Omit<HbotMetadata, "id" | "createdAt" | "updatedAt" | "order">): HbotMetadata =>
    save({
      ...fields,
      id: `hbot_${randomUUID()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: (db.prepare("SELECT COALESCE(MAX(json_extract(data,'$.order')),-1) AS m FROM hbot_bots").get() as { m: number }).m + 1,
    });
  const update = (botId: string, expectedUpdatedAt: number, fields: Partial<HbotMetadata>): HbotMetadata => {
    const bot = require(botId);
    if (bot.updatedAt !== expectedUpdatedAt) throw new Error("Bot vừa bị sửa ở nơi khác — tải lại rồi sửa tiếp");
    return save({ ...bot, ...fields, id: bot.id, createdAt: bot.createdAt, updatedAt: Date.now() });
  };
  const remove = (botId: string): void => {
    require(botId);
    db.transaction(() => {
      db.prepare("DELETE FROM hbot_threads WHERE bot_id = ?").run(botId);
      db.prepare("DELETE FROM hbot_episodes WHERE bot_id = ?").run(botId);
      db.prepare("DELETE FROM hbot_bots WHERE id = ?").run(botId);
    }).immediate();
  };

  const owner = (threadId: string): string | null =>
    (db.prepare("SELECT bot_id FROM hbot_threads WHERE thread_id = ?").get(threadId) as { bot_id: string } | undefined)?.bot_id ?? null;
  const bind = (threadId: string, botId: string): void => {
    require(botId);
    const existing = owner(threadId);
    if (existing && existing !== botId) throw new Error("Hội thoại đã thuộc bot khác — gỡ gán trước");
    db.prepare("INSERT OR IGNORE INTO hbot_threads(thread_id,bot_id) VALUES (?,?)").run(threadId, botId);
  };
  const unbind = (threadId: string): void => {
    db.prepare("DELETE FROM hbot_threads WHERE thread_id = ?").run(threadId);
  };
  const threadsOf = (botId: string): string[] =>
    (db.prepare("SELECT thread_id FROM hbot_threads WHERE bot_id = ?").all(botId) as { thread_id: string }[]).map((row) => row.thread_id);
  const bindings = (): { threadId: string; botId: string }[] =>
    (db.prepare("SELECT thread_id AS threadId, bot_id AS botId FROM hbot_threads").all() as { threadId: string; botId: string }[]);

  const state = <T>(key: string): T | null => {
    const row = db.prepare("SELECT data FROM hbot_state WHERE key = ?").get(key) as { data: string } | undefined;
    return row ? (JSON.parse(row.data) as T) : null;
  };
  const setState = (key: string, value: unknown): void => {
    db.prepare("INSERT INTO hbot_state(key,data) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET data=excluded.data").run(key, JSON.stringify(value));
  };

  const episodeRow = "SELECT id, bot_id AS botId, thread_id AS threadId, text, created_at AS createdAt FROM hbot_episodes";
  const addEpisode = (botId: string, threadId: string | null, text: string): HbotEpisode => {
    require(botId);
    const episode: HbotEpisode = { id: `ep_${randomUUID()}`, botId, threadId, text, createdAt: Date.now() };
    db.prepare("INSERT INTO hbot_episodes(id,bot_id,thread_id,text,created_at) VALUES (?,?,?,?,?)").run(episode.id, botId, threadId, text, episode.createdAt);
    return episode;
  };
  const episodes = (botId?: string): HbotEpisode[] =>
    (botId
      ? db.prepare(`${episodeRow} WHERE bot_id = ? ORDER BY created_at DESC`).all(botId)
      : db.prepare(`${episodeRow} ORDER BY created_at DESC`).all()) as HbotEpisode[];

  return {
    get, require, list, create, update, remove,
    owner, bind, unbind, threadsOf, bindings,
    userMd: () => state<string>(USER_MD_KEY) ?? "",
    setUserMd: (content: string) => setState(USER_MD_KEY, content),
    addEpisode, episodes,
  };
}

export type HbotStore = ReturnType<typeof createHbotStore>;
