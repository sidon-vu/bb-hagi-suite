import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { experimental_useProviders, useBbNavigate, useRpc, useSdk } from "@get-bb/plugin-sdk/app";
import type { rpcContract } from "./hagi-contract";

type Model = { model: string; displayName: string; isDefault: boolean };

// Popup nhập tin đầu tiên + chọn provider/model; thread chỉ được tạo khi bấm Gửi.
export function NewConversationDialog({ botId, botName, projects, onClose }: { botId: string; botName: string; projects: { id: string; name: string }[]; onClose: () => void }) {
  const rpc = useRpc<typeof rpcContract>();
  const navigate = useBbNavigate();
  const sdk = useSdk();
  const { providers } = experimental_useProviders();
  const usable = providers.filter((p) => p.available);
  const [text, setText] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [providerId, setProviderId] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [model, setModel] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rỗng = để BB dùng provider/model mặc định.
  useEffect(() => {
    setModels([]); setModel(""); setNote(null);
    if (!providerId) return;
    let live = true;
    sdk.providers.models({ providerId, ...(projectId ? { projectId } : {}) })
      .then((r) => { if (live) { setModels(r.models); setModel(r.models.find((m) => m.isDefault)?.model ?? ""); } })
      .catch(() => { if (live) setNote("Không lấy được danh sách model — BB sẽ tự chọn model."); });
    return () => { live = false; };
  }, [providerId, projectId, sdk]);

  const send = async () => {
    const message = text.trim();
    if (!message || busy) return;
    setBusy(true); setError(null);
    try {
      const { threadId } = await rpc.call("hb_conversation_create", {
        botId, message, ...(projectId ? { projectId } : {}), ...(providerId ? { providerId } : {}), ...(providerId && model ? { model } : {}),
      });
      onClose();
      navigate.toThread(threadId);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  };

  return (
    <motion.div className="hagi-bots-editor__backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
      <motion.div className="hagi-bots-editor" role="dialog" aria-modal="true" aria-label="Hội thoại mới" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <h2>Hội thoại mới · {botName}</h2>
        <textarea
          className="hagi-newconv__input" autoFocus rows={6} value={text} placeholder="Nhập tin nhắn đầu tiên… (Enter gửi, Shift+Enter xuống dòng)"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); } }}
        />
        <div className="hagi-newconv__row">
          {projects.length > 1 ? (
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)} aria-label="Project">
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          ) : null}
          <select value={providerId} onChange={(e) => setProviderId(e.target.value)} aria-label="Provider">
            <option value="">Provider mặc định</option>
            {usable.map((p) => <option key={p.id} value={p.id}>{p.displayName}</option>)}
          </select>
          <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!providerId || !models.length} aria-label="Model">
            <option value="">{providerId ? "Model mặc định" : "Model (chọn provider trước)"}</option>
            {models.map((m) => <option key={m.model} value={m.model}>{m.displayName}</option>)}
          </select>
        </div>
        {note ? <p className="hagi-bots-note">{note}</p> : null}
        {error ? <p className="hagi-bots-note hagi-bots-note--error">{error}</p> : null}
        <div className="hagi-newconv__row hagi-newconv__row--end">
          <button type="button" className="hagi-bots-btn" onClick={onClose}>Huỷ</button>
          <button type="button" className="hagi-bots-btn hagi-bots-btn--primary" disabled={busy || !text.trim()} onClick={() => void send()}>{busy ? "Đang tạo…" : "Gửi"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
