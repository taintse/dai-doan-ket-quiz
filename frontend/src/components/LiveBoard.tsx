import { useEffect, useState } from "react";
import { subscribeLive, type LiveRow } from "../game/liveboard";
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

function statusLabel(status: string) {
  if (status === "playing") return "Đang chơi";
  if (status === "won") return "Giữ được";
  if (status === "lost") return "Đứt";
  return "";
}

export function LiveDock() {
  const { rows, note, enabled } = useLiveRows();
  const top = rows.slice(0, 8);
  return (
    <aside className="fixed left-3 top-3 z-40 hidden w-60 rounded-2xl border border-cyan-300/50 bg-slate-950/92 p-3 text-slate-100 shadow-neon backdrop-blur-md min-[1500px]:block">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-200">TOP lớp</p>
      {note && <p className="mt-2 text-xs leading-relaxed text-amber-100">{note}</p>}
      {enabled && !note && top.length === 0 && <p className="mt-2 text-xs text-slate-300">Chưa có điểm trực tiếp.</p>}
      <ol className="mt-2 space-y-1.5">
        {top.map((row, i) => (
          <li key={row.id} className="flex items-baseline justify-between gap-2 text-sm">
            <span className="min-w-0 truncate">
              <span className="mr-1 font-black text-slate-500">{i + 1}</span>
              {row.name}
            </span>
            <span className="shrink-0 font-black tabular-nums text-amber-200">{row.score}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
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
        <button type="button" onClick={onBack} className="rounded-full border border-slate-500 px-4 py-2 text-sm font-semibold">
          Về trò chơi
        </button>
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
