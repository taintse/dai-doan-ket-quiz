import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CLOSING, FOUR } from "../game/questions";
import { pushLiveScore } from "../game/liveboard";
import { addBoardEntry, formatClock, loadBest, saveBest, shareText, type Summary } from "../game/score";
import { HomeArt, HomeCast } from "./HomeArt";
import { Leaderboard } from "./Leaderboard";

export function StartScreen({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("");
  const best = loadBest();
  return (
    <div className="relative h-full overflow-hidden">
      <HomeArt />
      <div className="pointer-events-none absolute inset-4 sm:inset-6">
        <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-amber-200/80" />
        <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-amber-200/80" />
        <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-cyan-200/70" />
        <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-cyan-200/70" />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center px-5 pb-6 pt-8 sm:px-8 sm:pb-10 sm:pt-12">
        <header className="poster-copy mx-auto max-w-3xl text-center">
          <h1 className="font-extrabold leading-none">
            <span className="block text-[11px] uppercase tracking-[0.42em] text-cyan-100 sm:text-sm sm:tracking-[0.55em]">Phòng tuyến</span>
            <span className="relative mt-2 block text-6xl sm:text-8xl">
              <span className="absolute inset-0 scale-110 bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent blur-2xl" aria-hidden>
                Ánh chung
              </span>
              <span className="relative bg-gradient-to-b from-amber-50 via-amber-200 to-amber-400 bg-clip-text text-transparent">Ánh chung</span>
            </span>
          </h1>
          <p className="mt-4 text-sm text-slate-100 sm:text-lg">Mỗi lượt 20 câu — giữ ánh chung.</p>
        </header>
        <div className="relative min-h-[9.5rem] w-full flex-1 overflow-hidden">
          <HomeCast />
        </div>
        <form
          className="poster-copy w-full max-w-sm text-center"
          onSubmit={(e) => {
            e.preventDefault();
            onStart(name.trim());
          }}
        >
          <label htmlFor="poster-name" className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
            Tên trên bảng hạng
            <input
              id="poster-name"
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              placeholder="Người kết nối"
              className="mt-2 w-full rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-3 text-center text-base font-semibold normal-case tracking-normal text-slate-50 outline-none backdrop-blur-md placeholder:font-normal placeholder:text-slate-500 focus:border-amber-300"
            />
          </label>
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-gradient-to-b from-amber-200 to-amber-400 px-8 py-3.5 text-lg font-extrabold text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.45)] hover:from-amber-100 hover:to-amber-300"
          >
            Vào phòng tuyến
          </button>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => {
                window.location.hash = "#bang";
              }}
              className="rounded-full border border-amber-200/40 bg-slate-950/45 px-5 py-2 text-sm font-semibold text-amber-100 backdrop-blur-md hover:border-amber-100"
            >
              Màn hình lớp
            </button>
          </div>
          {best && <p className="mt-3 text-[11px] tracking-wide text-slate-400">Kỷ lục máy này: {best.score} · {best.rank}</p>}
        </form>
      </div>
    </div>
  );
}

const RANK_STYLE: Record<string, string> = {
  dong: "text-orange-300",
  bac: "text-slate-200",
  vang: "text-amber-300",
  anh: "text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]",
};

export function Results({ summary, onAgain }: { summary: Summary; onAgain: () => void }) {
  const [copied, setCopied] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [nick, setNick] = useState(summary.name);
  const [listed, setListed] = useState<"ask" | "saved" | "later">("ask");
  const [board, setBoard] = useState(false);

  useEffect(() => {
    const saved = saveBest(summary);
    setBestScore(saved.best.score);
    setIsNew(saved.isNew);
  }, [summary]);

  async function copy() {
    const text = shareText(summary, bestScore);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function saveNick() {
    const name = nick.trim() || "Ẩn danh";
    addBoardEntry({
      name,
      score: summary.score,
      rankId: summary.rank.id,
      rank: summary.rank.name,
      accuracy: summary.accuracy,
      avgSeconds: summary.avgSeconds,
      at: new Date().toISOString(),
    });
    void pushLiveScore({ name, score: summary.score, rank: summary.rank.name, status: summary.outcome }, true);
    setListed("saved");
  }

  const pct = Math.round(summary.accuracy * 100);
  return (
    <div className="grid h-full place-items-center overflow-auto p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-3xl rounded-3xl border border-cyan-500/40 bg-slate-900/80 p-6 backdrop-blur-md"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{summary.outcome === "won" ? "Giữ được phòng tuyến" : "Phòng tuyến đứt"}</p>
        <h2 className="text-3xl font-extrabold">{summary.name}</h2>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <p className={`text-5xl font-black ${RANK_STYLE[summary.rank.id]}`}>{summary.rank.name}</p>
          <p className="text-3xl font-bold text-amber-200">{summary.score} điểm</p>
          {isNew && <span className="rounded-full bg-amber-400/20 px-3 py-1 text-sm text-amber-200">Kỷ lục mới</span>}
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <Stat label="Độ đúng" value={`${pct}% (${summary.correct}/${summary.answered || 0})`} />
          <Stat label="TB thời gian" value={summary.correct ? `${summary.avgSeconds.toFixed(1)}s` : "–"} />
          <Stat label="Chuỗi dài nhất" value={String(summary.maxStreak)} />
          <Stat label="Bừng sáng" value={String(summary.feverCount)} />
          <Stat label="Điểm hạ virus" value={String(summary.killPoints)} />
          <Stat label="Điểm câu hỏi" value={String(summary.quizPoints)} />
          <Stat label="Sóng" value={`${summary.wavesCleared}/${summary.waves}`} />
          <Stat label="Đoàn kết" value={String(summary.solidarity)} />
          <Stat label="Thời gian" value={formatClock(summary.clock)} />
          <Stat label="Kỷ lục máy này" value={bestScore !== null ? String(bestScore) : "–"} />
        </dl>
        <blockquote className="mt-5 border-l-2 border-amber-300/70 pl-3 text-sm leading-relaxed text-amber-100">{CLOSING}</blockquote>
        <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">Vận dụng của nhóm — bốn câu tự kiểm</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-100">
            {FOUR.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        {listed === "ask" && (
          <div className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-400/10 p-4">
            <p className="text-sm font-bold text-amber-100">Ghi tên lên bảng lớp?</p>
            <p className="mt-1 text-xs text-slate-300">Bảng ở trên máy này. Bạn khác gửi điểm bằng nút Chép kết quả.</p>
            <input
              value={nick}
              maxLength={24}
              onChange={(e) => setNick(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-300"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={saveNick} className="rounded-full bg-amber-300 px-4 py-1.5 text-sm font-bold text-slate-950">
                Lưu vào bảng
              </button>
              <button type="button" onClick={() => setListed("later")} className="rounded-full border border-slate-500 px-4 py-1.5 text-sm">
                Để sau
              </button>
            </div>
          </div>
        )}
        {listed === "saved" && <p className="mt-3 text-sm text-emerald-200">Đã có mặt trên bảng.</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={onAgain} className="rounded-full bg-cyan-400 px-5 py-2 font-bold text-slate-950">
            Chơi lại
          </button>
          <button type="button" onClick={copy} className="rounded-full border border-slate-500 px-5 py-2 font-semibold">
            {copied ? "Đã chép" : "Chép kết quả"}
          </button>
          <button type="button" onClick={() => setBoard(true)} className="rounded-full border border-cyan-400/50 px-5 py-2 font-semibold text-cyan-100">
            Bảng xếp hạng
          </button>
        </div>
      </motion.div>
      {board && <Leaderboard onClose={() => setBoard(false)} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-950/70 px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="font-semibold text-slate-100">{value}</dd>
    </div>
  );
}
