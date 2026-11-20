import { useEffect, useState } from "react";
import { useBbNavigate, useSettings } from "@get-bb/plugin-sdk/app";
import type { PluginNavPanelProps } from "@get-bb/plugin-sdk/app";
import { addMockThread, openEditor, useBots, useEditorTarget, type MockBot } from "./mock-store";
import { BotAvatar, StatusDot } from "./bot-avatar";
import { parseSubPath } from "./routes";
import { BotEditor } from "./bot-editor";

function BotCard({ bot }: { bot: MockBot }) {
  const navigate = useBbNavigate();
  return (
    <button
      type="button"
      className="hagi-bot-card"
      onClick={() => navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}` })}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <BotAvatar bot={bot} size={32} />
        <span style={{ fontWeight: 600 }}>{bot.name}</span>
      </span>
      <span style={{ color: "var(--muted-foreground)", fontSize: 11 }}>{bot.role}</span>
      <span style={{ color: "var(--muted-foreground)", fontSize: 11 }}>
        {bot.threads.length} hội thoại · {bot.projects.length} project
      </span>
    </button>
  );
}

function ThreadRows({ bot, activeThreadId }: { bot: MockBot; activeThreadId: string | null }) {
  const navigate = useBbNavigate();
  return (
    <div className="hagi-bots-threadlist">
      {bot.threads.map((thread) => (
        <div key={thread.id}>
          <button
            type="button"
            className="hagi-bots-threadrow"
            style={{ width: "100%", border: "none", background: "none", cursor: "pointer", font: "inherit", textAlign: "left" }}
            data-active={activeThreadId === thread.id || undefined}
            onClick={() => navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}/threads/${thread.id}` })}
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
              onClick={() => navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}/threads/${child.id}` })}
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

function BotDetail({ bot, threadId }: { bot: MockBot; threadId: string | null }) {
  const [tab, setTab] = useState<"threads" | "context" | "projects">("threads");
  useEffect(() => {
    if (threadId) setTab("threads");
  }, [threadId]);
  const activeTab = tab;
  return (
    <>
      <div className="hagi-bots-detail__head">
        <BotAvatar bot={bot} size={44} />
        <div className="hagi-bots-detail__meta">
          <h1>{bot.name}</h1>
          <p>
            {bot.role} · {bot.threads.length} hội thoại
          </p>
        </div>
        <button
          type="button"
          className="hagi-bots-btn"
          onClick={() => addMockThread(bot.id, `Hội thoại mới ${new Date().toLocaleTimeString()}`)}
        >
          ＋ Hội thoại mới
        </button>
        <button type="button" className="hagi-bots-btn hagi-bots-btn--primary" onClick={() => openEditor({ kind: "edit", botId: bot.id })}>
          Sửa bot
        </button>
      </div>
      {threadId ? <p className="hagi-bots-note">Đang chọn thread giả: {threadId} — bản thật sẽ mở đúng hội thoại của bot.</p> : null}
      <div className="hagi-bots-tabs" role="tablist">
        {(
          [
            ["threads", `Hội thoại · ${bot.threads.length}`],
            ["context", "Context"],
            ["projects", `Projects · ${bot.projects.length}`],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={activeTab === id} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      {activeTab === "threads" ? <ThreadRows bot={bot} activeThreadId={threadId} /> : null}
      {activeTab === "context" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 4 }}>SOUL.md</div>
            <pre className="hagi-bots-pre" style={{ margin: 0 }}>{bot.soul || "(trống)"}</pre>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 4 }}>MEMORY.md · tối đa 3000 ký tự</div>
            <pre className="hagi-bots-pre" style={{ margin: 0 }}>{bot.memory || "(trống)"}</pre>
          </div>
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
    </>
  );
}

// Nội dung chính của trang Bots (slot component trong navPanel).
export function BotsPage({ subPath }: PluginNavPanelProps) {
  const { values, isLoading } = useSettings();
  const bots = useBots();
  const editorTarget = useEditorTarget();
  const current = parseSubPath(subPath);
  const navigate = useBbNavigate();

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
      {editorTarget ? <BotEditor target={editorTarget} /> : null}
      {current.botId === null ? (
        <>
          <p className="hagi-bots-note">Bản vỏ UI — dữ liệu giả trong bộ nhớ, mất khi tải lại. Chưa nối trạng thái thật.</p>
          <div className="hagi-bots-grid">
            {bots.map((entry) => (
              <BotCard key={entry.id} bot={entry} />
            ))}
            <button type="button" className="hagi-bot-card hagi-bot-card--add" onClick={() => openEditor({ kind: "create" })}>
              ＋ Bot mới
            </button>
          </div>
        </>
      ) : bot ? (
        <BotDetail bot={bot} threadId={current.threadId} />
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
