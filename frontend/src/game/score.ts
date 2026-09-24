import { SOLIDARITY_MAX, WAVES } from "./balance";
import type { GameState } from "./types";

export type RankId = "dong" | "bac" | "vang" | "anh";

export interface Rank {
  id: RankId;
  name: string;
}

export interface Summary {
  score: number;
  rank: Rank;
  accuracy: number;
  answered: number;
  correct: number;
  wrong: number;
  avgSpeed: number;
  avgSeconds: number;
  maxStreak: number;
  feverCount: number;
  wavesCleared: number;
  waves: number;
  solidarity: number;
  breaches: number;
  clock: number;
  outcome: "won" | "lost";
  name: string;
}

const BEST_KEY = "phong-tuyen-anh-chung-best-v1";

export interface BestScore {
  score: number;
  rank: string;
  name: string;
  accuracy: number;
  clock: number;
  at: string;
}

export function rankFor(score: number): Rank {
  if (score >= 10000) return { id: "anh", name: "Ánh chung" };
  if (score >= 6800) return { id: "vang", name: "Vàng" };
  if (score >= 3800) return { id: "bac", name: "Bạc" };
  return { id: "dong", name: "Đồng" };
}

export function summarize(s: GameState): Summary {
  const correct = s.stats.correct;
  const wrong = s.stats.wrong;
  const answered = correct + wrong;
  const accuracy = answered ? correct / answered : 0;
  const coverage = Math.min(1, answered / 8);
  const volume = Math.min(1, correct / 6);
  const avgSpeed = correct ? s.stats.speedSum / correct : 0;
  const avgSeconds = correct ? s.stats.timeSum / correct : 0;
  const survivalFactor = 0.42 + 0.58 * (s.stats.wavesCleared / WAVES.length);
  const quizCore = accuracy * coverage * volume * (4800 + 6400 * avgSpeed) * survivalFactor;
  const survival =
    (s.stats.wavesCleared / WAVES.length) * 1700 +
    (Math.max(0, s.solidarity) / SOLIDARITY_MAX) * 650 +
    Math.min(1, s.clock / (11 * 60)) * 450;
  const bonuses = s.stats.maxStreak * 30 + s.stats.feverCount * 110;
  const penalties = wrong * 70 + s.stats.breaches * 18 + (s.status === "lost" ? 180 : 0);
  const score = Math.max(0, Math.round(quizCore + survival + bonuses - penalties));
  return {
    score,
    rank: rankFor(score),
    accuracy,
    answered,
    correct,
    wrong,
    avgSpeed,
    avgSeconds,
    maxStreak: s.stats.maxStreak,
    feverCount: s.stats.feverCount,
    wavesCleared: s.stats.wavesCleared,
    waves: WAVES.length,
    solidarity: Math.max(0, Math.round(s.solidarity)),
    breaches: s.stats.breaches,
    clock: s.clock,
    outcome: s.status === "won" ? "won" : "lost",
    name: s.name || "Người kết nối",
  };
}

export function loadBest(): BestScore | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as BestScore;
    if (typeof data.score !== "number") return null;
    return data;
  } catch {
    return null;
  }
}

export function saveBest(summary: Summary): { best: BestScore; isNew: boolean } {
  const prev = loadBest();
  const next: BestScore = {
    score: summary.score,
    rank: summary.rank.name,
    name: summary.name,
    accuracy: summary.accuracy,
    clock: summary.clock,
    at: new Date().toISOString(),
  };
  if (!prev || summary.score > prev.score) {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(BEST_KEY, JSON.stringify(next));
    }
    return { best: next, isNew: true };
  }
  return { best: prev, isNew: false };
}

export function shareText(summary: Summary, best: number | null): string {
  const pct = Math.round(summary.accuracy * 100);
  const sec = summary.correct ? summary.avgSeconds.toFixed(1) : "–";
  const clock = formatClock(summary.clock);
  return [
    `Phòng tuyến Ánh chung — ${summary.name}`,
    `Hạng ${summary.rank.name} · ${summary.score} điểm`,
    `Đúng ${pct}% (${summary.correct}/${summary.answered || 0}) · TB ${sec}s · Chuỗi ${summary.maxStreak} · Bừng sáng ${summary.feverCount}`,
    `Sóng ${summary.wavesCleared}/${summary.waves} · Đoàn kết ${summary.solidarity} · ${clock} · ${summary.outcome === "won" ? "Giữ được phòng tuyến" : "Phòng tuyến đứt"}`,
    best !== null ? `Kỷ lục máy này: ${best}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatClock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
