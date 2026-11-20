import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { experimental_useSidebarThreads, useRealtime, useRpc, useSettings } from "@get-bb/plugin-sdk/app";
import type { PluginRpcResult } from "@get-bb/plugin-sdk/app";
import type { rpcContract } from "./hagi-contract";
import { useBots as useMockBots, useUserMd as useMockUserMd, type MockBot, type MockThread } from "./mock-store";

type ListResult = PluginRpcResult<typeof rpcContract["hb_bots_list"]>;
type EpisodeResult = PluginRpcResult<typeof rpcContract["hb_episodes_list"]>;

function relTime(ts: number): string {
  const mins = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

function relCreated(ts: number): string {
  const days = Math.max(0, Math.floor((Date.now() - ts) / 86400000));
  return days === 0 ? "Vừa vào đội" : `Vào đội ${days} ngày`;
}

function threadStatus(thread: { status: string; hasPendingInteraction: boolean }): MockThread["status"] {
  if (thread.hasPendingInteraction) return "waiting"; // kẹt chờ duyệt/câu hỏi = "chờ" thật
  return thread.status === "idle" ? "idle" : "working";
}

export interface DataBots {
  bots: MockBot[];
  live: boolean;
  loading: boolean;
  error: string | null;
  userMd: string;
  refresh: () => void;
}

// Lớp dữ liệu cho UI: botsBackend bật → RPC + thread thật; tắt → mock in-memory.
export function useDataBots(): DataBots {
  const { values } = useSettings();
  const live = values?.botsBackend === true;
  const rpc = useRpc<typeof rpcContract>();
  const sidebar = experimental_useSidebarThreads();
  const mockBots = useMockBots();
  const mockUserMd = useMockUserMd();
  const [list, setList] = useState<ListResult | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeResult["episodes"]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seq = useRef(0);

  const refresh = useCallback(async () => {
    const ticket = ++seq.current;
    setLoading(true);
    try {
      const [bots, eps] = await Promise.all([rpc.call("hb_bots_list", null), rpc.call("hb_episodes_list", {})]);
      if (ticket !== seq.current) return;
      setList(bots);
      setEpisodes(eps.episodes);
      setError(null);
    } catch (e) {
      if (ticket === seq.current) setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (ticket === seq.current) setLoading(false);
    }
  }, [rpc]);

  useEffect(() => {
    if (live) void refresh();
    else {
      setList(null);
      setError(null);
    }
  }, [live, refresh]);
  useRealtime("hagi-bots-changed", refresh);

  const bots = useMemo<MockBot[]>(() => {
    if (!live) return mockBots;
    if (!list) return [];
    const byId = new Map(sidebar.threads.filter((t) => !t.isArchived && !t.isHidden).map((t) => [t.id, t]));
    const epsByBot = new Map<string, string[]>();
    for (const ep of episodes) {
      const stamp = new Date(ep.createdAt);
      const label = `${stamp.getDate()}/${stamp.getMonth() + 1} — ${ep.text}`;
      epsByBot.set(ep.botId, [...(epsByBot.get(ep.botId) ?? []), label]);
    }
    return list.bots.map((bot) => {
      const bound = list.threadBindings.filter((b) => b.botId === bot.id && byId.has(b.threadId)).map((b) => byId.get(b.threadId)!);
      const boundIds = new Set(bound.map((t) => t.id));
      const roots = bound
        .filter((t) => !t.parentThreadId || !boundIds.has(t.parentThreadId))
        .sort((a, b) => b.createdAt - a.createdAt);
      const toMock = (t: (typeof bound)[number]): MockThread => ({
        id: t.id,
        title: t.displayTitle,
        status: threadStatus(t),
        children: bound
          .filter((c) => c.parentThreadId === t.id)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((c) => ({ id: c.id, title: c.displayTitle, status: threadStatus(c) })),
      });
      const threads = roots.map(toMock);
      const latest = bound.reduce((acc, t) => Math.max(acc, t.updatedAt, t.latestAttentionAt), bot.createdAt);
      return {
        id: bot.id,
        name: bot.name,
        role: bot.role,
        color: bot.color,
        shape: bot.shape,
        soul: bot.soul,
        memory: bot.memory,
        playbook: bot.playbook,
        episodes: epsByBot.get(bot.id) ?? [],
        lastActivity: bound.length ? relTime(latest) : "Chưa chạy",
        createdAt: relCreated(bot.createdAt),
        turns: bound.length,
        projects: bot.projects,
        threads,
        updatedAt: bot.updatedAt,
      };
    });
  }, [live, mockBots, list, sidebar.threads, episodes]);

  return { bots, live, loading, error, userMd: live ? (list?.userMd ?? "") : mockUserMd, refresh };
}
