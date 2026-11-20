import { botStatus, STATUS_LABEL, type BotStatus, type MockBot } from "./mock-store";

// Mặt biểu cảm theo trạng thái bot (vẽ SVG, không cần asset).
function Face({ status }: { status: BotStatus }) {
  if (status === "working") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: "70%", height: "70%" }} aria-hidden="true">
        <circle className="hagi-eye" cx="8" cy="10" r="1.6" fill="currentColor" stroke="none" />
        <circle className="hagi-eye" cx="16" cy="10" r="1.6" fill="currentColor" stroke="none" />
        <path className="hagi-mouth" d="M8 16h8" />
      </svg>
    );
  }
  if (status === "waiting") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: "70%", height: "70%" }} aria-hidden="true">
        <circle className="hagi-eye" cx="8" cy="9.5" r="1.8" />
        <circle className="hagi-eye" cx="16" cy="9.5" r="1.8" />
        <circle className="hagi-mouth" cx="12" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: "70%", height: "70%" }} aria-hidden="true">
      <path className="hagi-eye" d="M6.4 10c.8 1.3 2.4 1.3 3.2 0" />
      <path className="hagi-eye" d="M14.4 10c.8 1.3 2.4 1.3 3.2 0" />
      <circle className="hagi-mouth" cx="12" cy="15.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Avatar "đội bot": hình dáng + màu riêng của bot, mặt đổi theo trạng thái.
export function BotAvatar({ bot, size = 28 }: { bot: MockBot; size?: number }) {
  return (
    <span className="hagi-bot-avatar" data-shape={bot.shape} data-status={botStatus(bot)} style={{ width: size, height: size, background: bot.color }} aria-hidden="true">
      <Face status={botStatus(bot)} />
    </span>
  );
}

export function StatusDot({ status }: { status: "idle" | "working" | "waiting" }) {
  return <span className="hagi-status-dot" data-status={status} aria-label={status} />;
}

export function StatusChip({ status, detail }: { status: BotStatus; detail?: string }) {
  return (
    <span className="hagi-status-chip" data-status={status}>
      {STATUS_LABEL[status]}
      {detail ? ` · ${detail}` : ""}
    </span>
  );
}
