import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CLOSING, FOUR } from "../game/questions";
import { formatClock, loadBest, saveBest, shareText, type Summary } from "../game/score";

export function StartScreen({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("");
  const best = loadBest();
  return (
    <div className="grid h-full place-items-center p-4">
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-3xl rounded-3xl border border-cyan-500/30 bg-slate-950/80 p-8 shadow-neon backdrop-blur-md"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Tư tưởng Hồ Chí Minh · Chương V</p>
        <h1 className="mt-2 text-4xl font-extrabold text-amber-300 drop-shadow-[0_0_18px_rgba(251,191,36,0.45)]">Phòng tuyến Ánh chung</h1>
        <p className="mt-2 text-lg text-slate-200">Đại đoàn kết trong không gian mạng</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          Virus chia rẽ đi từ phải sang cột cộng đồng. Mặt trời chỉ nhỏ giọt — muốn trụ đến sóng cuối phải trả lời đúng và nhanh.
          Ba câu đúng liên tiếp thắp <span className="text-amber-300">Ánh chung bừng sáng</span>.
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
          <li className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">Đặt tường về phía virus, phản biện đứng sau.</li>
          <li className="rounded-xl border border-cyan-400/30 bg-cyan-400/5 p-3">Tuyệt kỹ đầy thì hỏi một câu — đúng mới có hiệu lực.</li>
          <li className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-3">Virus sát cộng đồng: Cứu nguy khẩn cấp, khoảng 5 giây.</li>
          <li className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-3">Sai: nhiễu thông tin, mất đoàn kết, dễ thủng hàng.</li>
        </ul>
        <label className="mt-5 block text-sm text-slate-300">
          Tên trên bảng hạng
          <input
            value={name}
            maxLength={24}
            onChange={(e) => setName(e.target.value)}
            placeholder="Người kết nối"
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
          />
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onStart(name.trim())}
            className="rounded-full bg-amber-400 px-6 py-2.5 font-bold text-slate-950 shadow-amber hover:bg-amber-300"
          >
            Vào phòng tuyến
          </button>
          {best && <p className="text-sm text-slate-400">Kỷ lục máy này: {best.score} · {best.rank}</p>}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Bám Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương V. Bốn câu tự kiểm là vận dụng của nhóm, không phải nguyên văn giáo trình.
        </p>
      </motion.div>
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
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={onAgain} className="rounded-full bg-cyan-400 px-5 py-2 font-bold text-slate-950">
            Chơi lại
          </button>
          <button type="button" onClick={copy} className="rounded-full border border-slate-500 px-5 py-2 font-semibold">
            {copied ? "Đã chép" : "Chép kết quả"}
          </button>
        </div>
      </motion.div>
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
