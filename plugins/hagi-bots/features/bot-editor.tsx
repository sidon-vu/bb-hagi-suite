import { useState } from "react";
import { motion } from "motion/react";
import { useRpc } from "@get-bb/plugin-sdk/app";
import { closeEditor, saveBot, type BotDraft, type EditorTarget, type MockBot } from "./mock-store";
import type { rpcContract } from "./hagi-contract";

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#22c55e", "#ec4899"];
const SHAPES: { id: MockBot["shape"]; label: string }[] = [
  { id: "round", label: "Tròn" },
  { id: "square", label: "Vuông" },
  { id: "hex", label: "Lục giác" },
];

// Dialog tạo/sửa: live → RPC hb_bot_create/hb_bot_update (CAS); mock → store in-memory.
export function BotEditor({ target, live, bots, refresh }: { target: EditorTarget; live: boolean; bots: MockBot[]; refresh: () => void }) {
  const rpc = useRpc<typeof rpcContract>();
  const editing = target.kind === "edit" ? bots.find((bot) => bot.id === target.botId) : undefined;
  const [draft, setDraft] = useState<BotDraft>(() =>
    editing
      ? { name: editing.name, role: editing.role, color: editing.color, shape: editing.shape, soul: editing.soul, memory: editing.memory, playbook: editing.playbook }
      : { name: "", role: "Assistant", color: COLORS[0]!, shape: "round", soul: "", memory: "", playbook: "" },
  );
  const [error, setError] = useState<string | null>(null);
  if (target.kind === "edit" && !editing) return null;

  const set = (patch: Partial<BotDraft>) => setDraft((current) => ({ ...current, ...patch }));
  const [busy, setBusy] = useState(false);
  const submit = () => {
    if (!draft.name.trim()) {
      setError("Đặt tên cho bot.");
      return;
    }
    if (draft.memory.length > 3000) {
      setError("MEMORY tối đa 3000 ký tự.");
      return;
    }
    const clean = { ...draft, name: draft.name.trim() };
    if (!live) {
      saveBot(clean, editing?.id);
      closeEditor();
      return;
    }
    setBusy(true);
    void (async () => {
      try {
        if (editing) await rpc.call("hb_bot_update", { botId: editing.id, expectedUpdatedAt: editing.updatedAt ?? 0, ...clean });
        else await rpc.call("hb_bot_create", clean);
        refresh();
        closeEditor();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setBusy(false);
      }
    })();
  };

  return (
    <motion.div className="hagi-bots-editor__backdrop" onClick={closeEditor} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
      <motion.div className="hagi-bots-editor" role="dialog" aria-modal="true" aria-label={editing ? "Sửa bot" : "Tạo bot"} onClick={(event) => event.stopPropagation()} initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <h2>{editing ? `Sửa ${editing.name}` : "Tạo bot"}</h2>
        {live ? null : (
          <p className="hagi-bots-note" style={{ margin: 0 }}>
            Dữ liệu giả — lưu vào bộ nhớ, mất khi tải lại trang.
          </p>
        )}
        <div className="hagi-bots-editor__row">
          <label>
            Tên bot
            <input type="text" autoFocus value={draft.name} maxLength={120} placeholder="Research bot" onChange={(event) => set({ name: event.target.value })} />
          </label>
          <label>
            Vai trò
            <input type="text" value={draft.role} maxLength={80} placeholder="Assistant" onChange={(event) => set({ role: event.target.value })} />
          </label>
        </div>
        <div className="hagi-bots-editor__row">
          <label>
            Màu avatar
            <span className="hagi-bots-editor__swatches">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="hagi-bots-swatch"
                  style={{ background: color }}
                  aria-pressed={draft.color === color}
                  aria-label={`Màu ${color}`}
                  onClick={() => set({ color })}
                />
              ))}
            </span>
          </label>
          <label>
            Hình dáng
            <select value={draft.shape} onChange={(event) => set({ shape: event.target.value as MockBot["shape"] })}>
              {SHAPES.map((shape) => (
                <option key={shape.id} value={shape.id}>
                  {shape.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          SOUL.md
          <textarea rows={4} value={draft.soul} placeholder="# SOUL&#10;Bot này làm gì, nói năng ra sao…" onChange={(event) => set({ soul: event.target.value })} />
        </label>
        <label>
          MEMORY.md · {draft.memory.length}/3000
          <textarea rows={3} value={draft.memory} placeholder="- Một dòng = một sự thật bot cần nhớ" onChange={(event) => set({ memory: event.target.value })} />
        </label>
        <label>
          PLAYBOOK.md · kinh nghiệm/quy trình bot tự tích luỹ
          <textarea rows={3} value={draft.playbook} placeholder="- Quy trình và bài học tái dùng được" onChange={(event) => set({ playbook: event.target.value })} />
        </label>
        {error ? <p role="alert" style={{ margin: 0, color: "var(--destructive)", fontSize: 12 }}>{error}</p> : null}
        <div className="hagi-bots-editor__foot">
          <button type="button" className="hagi-bots-btn" onClick={closeEditor}>
            Huỷ
          </button>
          <button type="button" className="hagi-bots-btn hagi-bots-btn--primary" disabled={busy} onClick={submit}>
            Lưu
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
