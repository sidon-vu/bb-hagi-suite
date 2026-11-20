import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useBbNavigate, useRpc, useSettings } from "@get-bb/plugin-sdk/app";
import type { PluginNavPanelProps } from "@get-bb/plugin-sdk/app";
import type { rpcContract } from "./hagi-contract";
import { addMockThread, botStatus, openEditor, useEditorTarget, saveUserMd, MOCK_GUIDANCE, type MockBot } from "./mock-store";
import { useDataBots } from "./live-store";
import { BotAvatar, StatusChip, StatusDot } from "./bot-avatar";
import { parseSubPath } from "./routes";
import { ImportLegacyButton } from "./import-dialog";
import { BotEditor } from "./bot-editor";

function BotCard({ bot, index }: { bot: MockBot; index: number }) {
  const navigate = useBbNavigate();
  return (
    <motion.button
      type="button"
      className="hagi-bot-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      onClick={() => navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}` })}
    >
      <span className="hagi-bot-card__head">
        <BotAvatar bot={bot} size={40} />
        <span style={{ minWidth: 0 }}>
          <span className="hagi-bot-card__name">{bot.name}</span>
          <span className="hagi-bot-card__role">{bot.role}</span>
        </span>
      </span>
      <StatusChip status={botStatus(bot)} detail={bot.lastActivity} />
      <span className="hagi-bot-card__counts">
        {bot.threads.length} hội thoại · {bot.projects.length} project · {bot.turns} lượt chạy
      </span>
    </motion.button>
  );
}

// Feed gom episodes của mọi bot, mới nhất trên đầu (mốc "DD/MM" đầu mỗi dòng).
function ActivityFeed({ bots }: { bots: MockBot[] }) {
  const navigate = useBbNavigate();
  const day = (text: string) => {
    const match = text.match(/^(\d{2})\/(\d{2})/);
    return match ? Number(match[2]) * 100 + Number(match[1]) : 0;
  };
  const items = bots
    .flatMap((bot) => bot.episodes.map((text) => ({ bot, text })))
    .sort((a, b) => day(b.text) - day(a.text));
  if (!items.length) return null;
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 4 }}>Hoạt động gần đây</div>
      <div className="hagi-feed">
        {items.map(({ bot, text }, index) => (
          <motion.button
            key={index}
            type="button"
            className="hagi-feed__item"
            style={{ border: "none", background: "none", cursor: "pointer", font: "inherit", textAlign: "left", width: "100%" }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            onClick={() => navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}` })}
          >
            <BotAvatar bot={bot} size={18} />
            <span className="hagi-feed__bot">{bot.name}</span>
            <span className="hagi-feed__text">{text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ThreadRows({ bot, activeThreadId, live }: { bot: MockBot; activeThreadId: string | null; live: boolean }) {
  const navigate = useBbNavigate();
  const openThread = (threadId: string) =>
    live ? navigate.toThread(threadId) : navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}/threads/${threadId}` });
  return (
    <div className="hagi-bots-threadlist">
      {bot.threads.map((thread) => (
        <div key={thread.id}>
          <button
            type="button"
            className="hagi-bots-threadrow"
            style={{ width: "100%", border: "none", background: "none", cursor: "pointer", font: "inherit", textAlign: "left" }}
            data-active={activeThreadId === thread.id || undefined}
            onClick={() => openThread(thread.id)}
          >
            <StatusDot status={thread.status} />
            <span style={{ flex: 1 }}>{thread.title}</span>
            <span style={{ color: "var(--muted-foreground)", fontSize: 10 }}>{thread.status}</span>
          </button>
          {thread.children?.map((child) => (
            <button
              key={child.id}
              type="button"
              className="hagi-bots-threadrow hagi-bots-threadrow--child"
              style={{ width: "100%", border: "none", background: "none", cursor: "pointer", font: "inherit", textAlign: "left" }}
              data-active={activeThreadId === child.id || undefined}
              onClick={() => openThread(child.id)}
            >
              <StatusDot status={child.status} />
              <span style={{ flex: 1 }}>{child.title}</span>
            </button>
          ))}
        </div>
      ))}
      {bot.threads.length === 0 ? <p style={{ color: "var(--muted-foreground)", fontSize: 12 }}>Chưa có hội thoại nào.</p> : null}
    </div>
  );
}

function BotDetail({ bot, threadId, live, userMd }: { bot: MockBot; threadId: string | null; live: boolean; userMd: string }) {
  const [tab, setTab] = useState<"threads" | "context" | "projects">("threads");
  useEffect(() => {
    if (threadId) setTab("threads");
  }, [threadId]);
  const activeTab = tab;
  const navigate = useBbNavigate();
  const rpc = useRpc<typeof rpcContract>();
  const [creating, setCreating] = useState(false);
  const [picking, setPicking] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const create = async (projectId?: string) => {
    setCreating(true);
    setPicking(false);
    setCreateError(null);
    try {
      const { threadId: created } = await rpc.call("hb_conversation_create", { botId: bot.id, ...(projectId ? { projectId } : {}) });
      navigate.toThread(created);
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : String(e));
    } finally {
      setCreating(false);
    }
  };
  return (
    <>
      <div className="hagi-bots-detail__head">
        <BotAvatar bot={bot} size={44} />
        <div className="hagi-bots-detail__meta">
          <h1>{bot.name}</h1>
          <p>
            {bot.role} · {bot.createdAt} · {bot.turns} lượt chạy
          </p>
          <StatusChip status={botStatus(bot)} detail={bot.lastActivity} />
        </div>
        {live ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
            <button type="button" className="hagi-bots-btn" disabled={creating} onClick={() => (bot.projects.length > 1 ? setPicking(!picking) : void create(bot.projects[0]?.id))}>
              {creating ? "Đang tạo…" : "＋ Hội thoại mới"}
            </button>
            {picking ? bot.projects.map((p) => (
              <button key={p.id} type="button" className="hagi-bots-btn" onClick={() => void create(p.id)}>{p.name}</button>
            )) : null}
            {createError ? <span className="hagi-bots-note hagi-bots-note--error">{createError}</span> : null}
          </div>
        ) : (
          <button
            type="button"
            className="hagi-bots-btn"
            onClick={() => addMockThread(bot.id, `Hội thoại mới ${new Date().toLocaleTimeString()}`)}
          >
            ＋ Hội thoại mới
          </button>
        )}
        <button type="button" className="hagi-bots-btn hagi-bots-btn--primary" onClick={() => openEditor({ kind: "edit", botId: bot.id })}>
          Sửa bot
        </button>
      </div>
      {threadId ? <p className="hagi-bots-note">Đang chọn thread: {threadId}</p> : null}
      <div className="hagi-bots-tabs" role="tablist">
        {(
          [
            ["threads", `Hội thoại · ${bot.threads.length}`],
            ["context", "Instructions"],
            ["projects", `Projects · ${bot.projects.length}`],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={activeTab === id} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      {activeTab === "threads" ? <ThreadRows bot={bot} activeThreadId={threadId} live={live} /> : null}
      {activeTab === "context" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 4 }}>SOUL.md</div>
            <pre className="hagi-bots-pre" style={{ margin: 0 }}>{bot.soul || "(trống)"}</pre>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 4 }}>MEMORY.md · {bot.memory.length}/3000 ký tự</div>
            <pre className="hagi-bots-pre" style={{ margin: 0 }}>{bot.memory || "(trống)"}</pre>
            <div className="hagi-memory-bar" role="meter" aria-label="Độ đầy MEMORY" aria-valuenow={bot.memory.length} aria-valuemax={3000}>
              <span style={{ width: `${Math.min(100, (bot.memory.length / 3000) * 100)}%` }} data-warn={bot.memory.length > 2400 || undefined} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 4 }}>PLAYBOOK.md · kinh nghiệm bot tự tích luỹ</div>
            <pre className="hagi-bots-pre" style={{ margin: 0 }}>{bot.playbook || "(trống)"}</pre>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 4 }}>USER.md · dùng chung cho mọi bot</div>
            <pre className="hagi-bots-pre" style={{ margin: 0 }}>{userMd || "(trống)"}</pre>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 4 }}>Ghi chép gần đây (episodes)</div>
            {bot.episodes.length ? (
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "var(--muted-foreground)" }}>
                {bot.episodes.map((episode, index) => (
                  <li key={index}>{episode}</li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: 12, color: "var(--muted-foreground)" }}>Chưa có — bản thật ghi 1-2 dòng sau mỗi thread xong việc.</p>
            )}
            <p className="hagi-bots-note" style={{ marginTop: 6 }}>Job nền "dreaming" sẽ gom episodes → cô đọng vào MEMORY.md (bản thật).</p>
          </div>
          <details>
            <summary style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", cursor: "pointer" }}>Guidance cố định (read-only)</summary>
            <pre className="hagi-bots-pre" style={{ margin: "6px 0 0" }}>{MOCK_GUIDANCE}</pre>
          </details>
        </div>
      ) : null}
      {activeTab === "projects" ? (
        <div className="hagi-bots-threadlist">
          {bot.projects.map((project) => (
            <div key={project.id} className="hagi-bots-threadrow">
              <span style={{ flex: 1 }}>{project.name}</span>
              <span style={{ color: "var(--muted-foreground)", fontSize: 10, textTransform: "uppercase" }}>{project.role}</span>
            </div>
          ))}
          {bot.projects.length === 0 ? <p style={{ color: "var(--muted-foreground)", fontSize: 12 }}>Chưa liên kết project nào.</p> : null}
        </div>
      ) : null}
      </motion.div>
    </>
  );
}

// Dải tổng quan: số bot, số hội thoại, đang làm, đang chờ — nhìn một cái biết tình hình đội.
function OverviewStrip({ bots }: { bots: MockBot[] }) {
  let threads = 0;
  let working = 0;
  let waiting = 0;
  for (const bot of bots) {
    for (const thread of bot.threads) {
      const rows = [thread, ...(thread.children ?? [])];
      threads += rows.length;
      working += rows.filter((row) => row.status === "working").length;
      waiting += rows.filter((row) => row.status === "waiting").length;
    }
  }
  const stats = [
    { label: "Bot", value: bots.length },
    { label: "Hội thoại", value: threads },
    { label: "Đang làm", value: working },
    { label: "Chờ input", value: waiting, warn: waiting > 0 },
  ];
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {stats.map((stat) => (
        <div key={stat.label} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: stat.warn ? "var(--warning, #fbbf24)" : "var(--foreground)" }}>{stat.value}</span>
          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

// Thẻ USER.md dùng chung cho mọi bot (hồ sơ người dùng — ý tưởng Hermes/OpenClaw).
function UserMdCard({ userMd, onSave }: { userMd: string; onSave: (next: string) => void }) {
  const [draft, setDraft] = useState(userMd);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (!dirty) setDraft(userMd);
  }, [userMd, dirty]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)" }}>USER.md · hồ sơ của bạn, dùng chung cho mọi bot</div>
      <textarea
        rows={3}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setDirty(true);
        }}
        style={{ font: "inherit", fontFamily: "var(--font-mono)", fontSize: 11, padding: "7px 9px", border: "1px solid var(--input, var(--border))", borderRadius: 6, background: "var(--background)", color: "var(--foreground)", resize: "vertical" }}
      />
      {dirty ? (
        <div>
          <button
            type="button"
            className="hagi-bots-btn hagi-bots-btn--primary"
            onClick={() => {
              onSave(draft);
              setDirty(false);
            }}
          >
            Lưu USER.md
          </button>
        </div>
      ) : null}
    </div>
  );
}

// Nội dung chính của trang Bots (slot component trong navPanel).
export function BotsPage({ subPath }: PluginNavPanelProps) {
  const { values, isLoading } = useSettings();
  const data = useDataBots();
  const bots = data.bots;
  const editorTarget = useEditorTarget();
  const current = parseSubPath(subPath);
  const navigate = useBbNavigate();
  const rpc = useRpc<typeof rpcContract>();

  if (isLoading) return <div className="hagi-bots-page">Đang tải…</div>;
  if (values?.botsPanel !== true) {
    return (
      <div className="hagi-bots-page">
        <p className="hagi-bots-note">
          Tính năng “Trang Bots” đang tắt. Bật trong phần cài đặt plugin Hagi — Bots để xem bản vỏ UI (dữ liệu giả).
        </p>
      </div>
    );
  }

  const bot = current.botId ? bots.find((entry) => entry.id === current.botId) : null;
  return (
    <div className="hagi-bots-page">
      {editorTarget ? <BotEditor target={editorTarget} live={data.live} bots={bots} refresh={data.refresh} /> : null}
      {current.botId === null ? (
        <>
          {data.live ? (
            <>
              <ImportLegacyButton />
              {data.loading ? <p className="hagi-bots-note">Đang tải dữ liệu bot thật…</p> : null}
              {data.error ? <p className="hagi-bots-note hagi-bots-note--error">Lỗi backend: {data.error}</p> : null}
            </>
          ) : (
            <p className="hagi-bots-note">Bản vỏ UI — dữ liệu giả trong bộ nhớ. Bật "Backend bots (thật)" để dùng dữ liệu nhập từ Bots Sidebar.</p>
          )}
          <OverviewStrip bots={bots} />
          <div className="hagi-bots-grid">
            {bots.map((entry, index) => (
              <BotCard key={entry.id} bot={entry} index={index} />
            ))}
            <button type="button" className="hagi-bot-card hagi-bot-card--add" onClick={() => openEditor({ kind: "create" })}>
              ＋ Bot mới
            </button>
          </div>
          <UserMdCard
            userMd={data.userMd}
            onSave={(next) => {
              if (data.live) void rpc.call("hb_user_md_set", { content: next }).then(() => data.refresh());
              else saveUserMd(next);
            }}
          />
          <ActivityFeed bots={bots} />
        </>
      ) : bot ? (
        <BotDetail bot={bot} threadId={current.threadId} live={data.live} userMd={data.userMd} />
      ) : (
        <div>
          <p className="hagi-bots-note">Không thấy bot này (có thể vừa bị xoá trong phiên giả).</p>
          <button type="button" className="hagi-bots-btn" onClick={() => navigate.toPluginPanel("bots", { subPath: "", replace: true })}>
            ← Về danh sách
          </button>
        </div>
      )}
    </div>
  );
}
