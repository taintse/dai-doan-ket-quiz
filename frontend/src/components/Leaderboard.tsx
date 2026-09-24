import { useState } from "react";
import { clearBoard, importBoardText, loadBoard, type BoardEntry } from "../game/score";

const RANK_STYLE: Record<string, string> = {
  dong: "text-orange-300",
  bac: "text-slate-200",
  vang: "text-amber-300",
  anh: "text-cyan-200",
};

function when(at: string) {
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function Leaderboard({ onClose }: { onClose: () => void }) {
  const [rows, setRows] = useState<BoardEntry[]>(() => loadBoard());
  const [paste, setPaste] = useState("");
  const [note, setNote] = useState("");
  const [armed, setArmed] = useState(false);
  const top = rows.slice(0, 10);

  function bringIn() {
    const result = importBoardText(paste);
    setRows(result.entries);
    setNote(result.added ? `Đã thêm ${result.added} điểm.` : "Không thấy điểm mới. Hãy dán cả khối Chép kết quả.");
    if (result.added) setPaste("");
  }

  function wipe() {
    if (!armed) {
      setArmed(true);
      setNote("Bấm lần nữa để xóa bảng trên máy này. Kỷ lục riêng vẫn giữ.");
      return;
    }
    clearBoard();
    setRows([]);
    setArmed(false);
    setNote("Đã xóa bảng.");
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-cyan-500/40 bg-slate-900/95 p-5 shadow-neon">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Bảng của lớp</p>
            <h2 className="text-2xl font-extrabold text-amber-200">Bảng xếp hạng</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Mười người điểm cao trên máy này. Muốn ghép cả lớp, bạn chép kết quả rồi dán vào đây.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-600 px-3 py-1 text-sm">
            Đóng
          </button>
        </div>
        <ol className="mt-4 min-h-0 flex-1 space-y-2 overflow-auto">
          {top.length === 0 && <li className="rounded-2xl border border-slate-700 px-3 py-4 text-sm text-slate-400">Chưa có ai trên bảng. Chơi một lượt và lưu tên, hoặc nhập điểm bạn.</li>}
          {top.map((row, i) => (
            <li key={row.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2">
              <span className="w-6 text-center font-black text-slate-500">{i + 1}</span>
              <div className="min-w-0">
                <p className="truncate font-bold">{row.name}</p>
                <p className="text-[11px] text-slate-400">
                  {Math.round(row.accuracy * 100)}% đúng · TB {row.avgSeconds ? `${row.avgSeconds.toFixed(1)}s` : "–"} · {when(row.at)}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${RANK_STYLE[row.rankId] ?? ""}`}>{row.rank}</p>
                <p className="font-bold text-amber-200">{row.score}</p>
              </div>
            </li>
          ))}
        </ol>
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-400">
          Nhập điểm bạn
          <textarea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            rows={3}
            placeholder="Dán khối Chép kết quả của bạn khác…"
            className="mt-1 w-full resize-none rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-100 outline-none focus:border-cyan-400"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={bringIn} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">
            Nhập điểm bạn
          </button>
          <button type="button" onClick={wipe} className="rounded-full border border-rose-400/50 px-4 py-2 text-sm font-semibold text-rose-200">
            {armed ? "Xóa hẳn bảng" : "Xóa bảng máy này"}
          </button>
        </div>
        {note && <p className="mt-2 text-sm text-amber-100">{note}</p>}
      </div>
    </div>
  );
}
