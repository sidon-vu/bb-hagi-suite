import { useState } from "react";
import { useBbNavigate } from "@get-bb/plugin-sdk/app";
import type { PluginNavPanelProps } from "@get-bb/plugin-sdk/app";
import { useBots, openEditor, type MockBot } from "./mock-store";
import { BotAvatar, StatusDot } from "./bot-avatar";
import { parseSubPath } from "./routes";

function NavBot({ bot, current }: { bot: MockBot; current: { botId: string | null; threadId: string | null } }) {
  const navigate = useBbNavigate();
  const active = current.botId === bot.id;
  const [open, setOpen] = useState(active);
  return (
    <div>
      <button
        type="button"
        className="hagi-bots-nav__item"
        style={{ width: "100%" }}
        aria-current={active && !current.threadId ? "page" : undefined}
        onClick={() => navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}` })}
      >
        <span
          className="hagi-bots-nav__chevron"
          data-open={open || undefined}
          role="button"
          aria-label={open ? `Thu gọn ${bot.name}` : `Mở rộng ${bot.name}`}
          onClick={(event) => {
            event.stopPropagation();
            setOpen(!open);
          }}
        >
          ▸
        </span>
        <BotAvatar bot={bot} size={18} />
        <span style={{ minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {bot.name}
        </span>
        <span style={{ color: "var(--muted-foreground)", fontSize: 10 }}>{bot.role}</span>
      </button>
      {open ? (
        <div>
          {bot.threads.map((thread) => (
            <div key={thread.id}>
              <button
                type="button"
                className="hagi-bots-nav__item hagi-bots-nav__thread"
                style={{ width: "100%" }}
                aria-current={current.threadId === thread.id ? "page" : undefined}
                onClick={() => navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}/threads/${thread.id}` })}
              >
                <StatusDot status={thread.status} />
                <span style={{ minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {thread.title}
                </span>
              </button>
              {thread.children?.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  className="hagi-bots-nav__item hagi-bots-nav__thread"
                  style={{ width: "100%", paddingLeft: 40 }}
                  aria-current={current.threadId === child.id ? "page" : undefined}
                  onClick={() => navigate.toPluginPanel("bots", { subPath: `bots/${bot.id}/threads/${child.id}` })}
                >
                  <StatusDot status={child.status} />
                  <span style={{ minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {child.title}
                  </span>
                </button>
              ))}
            </div>
          ))}
          {bot.threads.length === 0 ? (
            <div className="hagi-bots-nav__thread" style={{ paddingLeft: 26, color: "var(--muted-foreground)" }}>
              Chưa có hội thoại
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// Cột trái riêng của trang Bots (slot experimental_sidebar trong navPanel).
export function BotsPanelNav({ subPath }: PluginNavPanelProps) {
  const navigate = useBbNavigate();
  const bots = useBots();
  const current = parseSubPath(subPath);
  return (
    <nav className="hagi-bots-nav" aria-label="Bots">
      <div className="hagi-bots-nav__heading">
        <span>Bots</span>
        <button
          type="button"
          className="hagi-bots-btn hagi-bots-btn--icon"
          aria-label="Tạo bot mới"
          title="Tạo bot mới"
          onClick={() => openEditor({ kind: "create" })}
        >
          ＋
        </button>
      </div>
      <button
        type="button"
        className="hagi-bots-nav__item"
        aria-current={current.botId === null ? "page" : undefined}
        onClick={() => navigate.toPluginPanel("bots", { subPath: "" })}
      >
        <span style={{ width: 12 }} />
        <span style={{ flex: 1 }}>Tất cả</span>
        <span style={{ color: "var(--muted-foreground)", fontSize: 10 }}>{bots.length}</span>
      </button>
      {bots.map((bot) => (
        <NavBot key={bot.id} bot={bot} current={current} />
      ))}
    </nav>
  );
}
