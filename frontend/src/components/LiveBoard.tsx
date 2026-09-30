import { useState, useEffect } from "react";
import { resetLiveScores, subscribeLive, type LiveRow } from "../game/liveboard";
import { loadBoard, type BoardEntry } from "../game/score";

export function useLiveRows() {
  const [rows, setRows] = useState<LiveRow[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(
    () =>
      subscribeLive((next, nextNote, on) => {
        setRows(next);
        setNote(nextNote);
        setEnabled(on);
      }),
    [],
  );
  return { rows, note, enabled };
}

const RESET_PASSWORD = "0801";

function ResetClassScores() {
  const [phase, setPhase] = useState<"idle" | "ask" | "confirm">("idle");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function cancel() {
    setPhase("idle");
    setPassword("");
    setMessage("");
    setBusy(false);
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {phase === "idle" && (
        <button
          type="button"
          onClick={() => {
            setPhase("ask");
            setPassword("");
            setMessage("");
          }}
          className="rounded-full border border-rose-300/70 px-4 py-2 text-sm font-semibold text-rose-100"
        >
          Reset data
        </button>
      )}
      {phase === "ask" && (
        <form
          className="flex flex-wrap items-center justify-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (password !== RESET_PASSWORD) {
              setMessage("Sai mật khẩu.");
              setPassword("");
              return;
            }
            setMessage("");
            setPhase("confirm");
          }}
        >
          <label className="text-sm text-slate-200">
            Mật khẩu
            <input
              type="password"
              value={password}
              autoFocus
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              className="ml-2 w-28 rounded-full border border-slate-500 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-rose-300"
            />
          </label>
          <button type="submit" className="rounded-full bg-rose-300 px-4 py-2 text-sm font-bold text-slate-950">
            Tiếp
          </button>
          <button type="button" onClick={cancel} className="rounded-full border border-slate-500 px-4 py-2 text-sm">
            Không
          </button>
        </form>
      )}
      {phase === "confirm" && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <p className="text-sm font-semibold text-rose-100">Xóa hết điểm của lớp?</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void resetLiveScores()
                .then(() => {
                  setMessage("Đã xóa hết điểm lớp.");
                  setPhase("idle");
                  setPassword("");
                })
                .catch(() => {
                  setMessage("Chưa xóa được điểm lớp.");
                  setPhase("idle");
                })
                .finally(() => setBusy(false));
            }}
            className="rounded-full bg-rose-300 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50"
          >
            Xóa hết
          </button>
          <button type="button" onClick={cancel} className="rounded-full border border-slate-500 px-4 py-2 text-sm">
            Không
          </button>
        </div>
      )}
      {message && <p className="text-sm text-rose-100">{message}</p>}
    </div>
  );
}

function statusLabel(status: string) {
  if (status === "playing") return "Đang chơi";
  if (status === "won") return "Giữ được";
  if (status === "lost") return "Đứt";
  return "";
}

export function ProjectorBoard({ onBack }: { onBack: () => void }) {
  const { rows, note, enabled } = useLiveRows();
  const [local, setLocal] = useState<BoardEntry[]>(() => loadBoard());
  useEffect(() => {
    const id = window.setInterval(() => setLocal(loadBoard()), 2000);
    return () => window.clearInterval(id);
  }, []);
  const live = rows.slice(0, 10);
  const fallback = local.slice(0, 10);
  const showingLive = enabled && (live.length > 0 || !note);
  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col p-6 sm:p-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Phòng tuyến Ánh chung</p>
          <h1 className="text-4xl font-black text-amber-200 sm:text-6xl">Bảng xếp hạng lớp</h1>
        </div>
        <div className="flex flex-wrap items-start justify-end gap-2">
          <ResetClassScores />
          <button type="button" onClick={onBack} className="rounded-full border border-slate-500 px-4 py-2 text-sm font-semibold">
            Về trò chơi
          </button>
        </div>
      </div>
      {showingLive && !note ? (
        <p className="mt-3 text-lg text-emerald-200">Đang cập nhật trực tiếp.</p>
      ) : (
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-amber-100">{note || "Đang hiện bảng trên máy này."}</p>
      )}
      <ol className="mt-8 space-y-3">
        {(showingLive ? live : fallback).length === 0 && <li className="text-2xl text-slate-400">Chưa có điểm.</li>}
        {showingLive &&
          live.map((row, i) => (
            <li key={row.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-3xl border border-slate-700 bg-slate-950/80 px-5 py-4">
              <span className="w-10 text-3xl font-black text-slate-500">{i + 1}</span>
              <span className="truncate text-3xl font-extrabold sm:text-4xl">{row.name}</span>
              <span className="text-right">
                <span className="block text-sm font-bold text-cyan-200">{row.rank}</span>
                <span className="text-4xl font-black tabular-nums text-amber-200">{row.score}</span>
                <span className="mt-1 block text-xs text-slate-400">{statusLabel(row.status)}</span>
              </span>
            </li>
          ))}
        {!showingLive &&
          fallback.map((row, i) => (
            <li key={row.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-3xl border border-slate-700 bg-slate-950/80 px-5 py-4">
              <span className="w-10 text-3xl font-black text-slate-500">{i + 1}</span>
              <span className="truncate text-3xl font-extrabold sm:text-4xl">{row.name}</span>
              <span className="text-right">
                <span className="block text-sm font-bold text-cyan-200">{row.rank}</span>
                <span className="text-4xl font-black tabular-nums text-amber-200">{row.score}</span>
              </span>
            </li>
          ))}
      </ol>
    </div>
  );
}
