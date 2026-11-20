import { useState } from "react";
import { useRpc } from "@get-bb/plugin-sdk/app";
import { AnimatePresence, motion } from "motion/react";
import type { PluginRpcResult } from "@get-bb/plugin-sdk/app";
import type { rpcContract } from "./hagi-contract";

type Preview = PluginRpcResult<typeof rpcContract["hb_import_preview"]>;

// Nút + dialog "Nhập từ Bots Sidebar": quét read-only → xem trước → xác nhận mới ghi.
export function ImportLegacyButton() {
  const rpc = useRpc<typeof rpcContract>();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = async () => {
    setOpen(true);
    setBusy(true);
    setError(null);
    setResult(null);
    setPreview(null);
    try {
      setPreview(await rpc.call("hb_import_preview", null));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const apply = async () => {
    setBusy(true);
    setError(null);
    try {
      const out = await rpc.call("hb_import_apply", null);
      setResult(
        `Đã nhập ${out.imported} bot + ${out.bindings} gán thread` +
          (out.skipped.length ? ` · bỏ qua ${out.skipped.length}` : "") +
          (out.warnings.length ? ` · ${out.warnings.length} cảnh báo` : ""),
      );
      setPreview(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button type="button" className="hagi-bots-btn" onClick={() => void scan()}>
        ⇩ Nhập từ Bots Sidebar
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div className="hagi-bots-editor__backdrop" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <motion.div className="hagi-bots-editor" role="dialog" aria-modal="true" aria-label="Nhập từ Bots Sidebar" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <h2>Nhập từ Bots Sidebar</h2>
              {busy ? <p className="hagi-bots-note">Đang quét read-only…</p> : null}
              {error ? <p className="hagi-bots-note hagi-bots-note--error">Lỗi: {error}</p> : null}
              {result ? <p className="hagi-bots-note">{result}. Dữ liệu nằm trong backend hagi-bots — sẽ hiện khi nối UI ở bước sau.</p> : null}
              {preview?.found ? (
                <>
                  <p className="hagi-bots-note">
                    Thấy {preview.bots.length} bot · {preview.bindingCount} gán thread · {preview.sectionCount} section · {preview.ownerCount} quyền sở hữu
                    project.
                  </p>
                  <ul className="hagi-import-list">
                    {preview.bots.map((bot) => (
                      <li key={bot.id} className="hagi-import-item">
                        <span className="hagi-import-item__dot" style={{ background: bot.color }} />
                        <b>{bot.name}</b>
                        <small>
                          {bot.role} · {bot.threadCount} thread · SOUL {bot.soulChars} · MEM {bot.memoryChars}
                        </small>
                        {bot.already ? <em className="hagi-import-item__issue">đã có — sẽ bỏ qua</em> : null}
                        {bot.issues.map((issue) => (
                          <em key={issue} className="hagi-import-item__issue">
                            {issue}
                          </em>
                        ))}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {preview && !preview.found ? <p className="hagi-bots-note hagi-bots-note--error">{preview.error ?? "Không tìm thấy dữ liệu"}</p> : null}
              <div className="hagi-bots-editor__foot">
                <button type="button" className="hagi-bots-btn" onClick={() => setOpen(false)}>
                  Đóng
                </button>
                {preview?.found && !result ? (
                  <button type="button" className="hagi-bots-btn hagi-bots-btn--primary" disabled={busy} onClick={() => void apply()}>
                    Xác nhận nhập {preview.bots.filter((b) => !b.already).length} bot
                  </button>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
