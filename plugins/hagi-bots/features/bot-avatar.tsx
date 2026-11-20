import type { MockBot } from "./mock-store";

// Avatar giả: chữ cái đầu trên nền màu của bot, 3 hình dáng.
export function BotAvatar({ bot, size = 28 }: { bot: Pick<MockBot, "name" | "color" | "shape">; size?: number }) {
  return (
    <span
      className="hagi-bot-avatar"
      data-shape={bot.shape}
      style={{ width: size, height: size, background: bot.color, fontSize: size * 0.45 }}
      aria-hidden="true"
    >
      {bot.name.charAt(0).toUpperCase()}
    </span>
  );
}

export function StatusDot({ status }: { status: "idle" | "working" | "waiting" }) {
  return <span className="hagi-status-dot" data-status={status} aria-label={status} />;
}
