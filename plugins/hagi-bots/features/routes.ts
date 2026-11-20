// subPath của navPanel: "" | "bots/<botId>" | "bots/<botId>/threads/<threadId>"
// Segment đến đã percent-encoded; mock id an toàn nên decode nhẹ tay.
export function parseSubPath(subPath: string): { botId: string | null; threadId: string | null } {
  const segments = subPath.split("/").filter(Boolean).map(decodeURIComponent);
  if (segments[0] !== "bots" || !segments[1]) return { botId: null, threadId: null };
  return {
    botId: segments[1],
    threadId: segments[2] === "threads" ? (segments[3] ?? null) : null,
  };
}
