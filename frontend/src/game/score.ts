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
const BOARD_KEY = "phong-tuyen-anh-chung-board-v1";

export interface BoardEntry {
  id: string;
  name: string;
  score: number;
  rankId: RankId;
  rank: string;
  accuracy: number;
  avgSeconds: number;
  at: string;
}

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

export function shareText(summary: Summary, best: number | null, at = new Date().toISOString()): string {
  const pct = Math.round(summary.accuracy * 100);
  const sec = summary.correct ? summary.avgSeconds.toFixed(1) : "–";
  const clock = formatClock(summary.clock);
  const token = `#ptac1|${encodeURIComponent(summary.name)}|${summary.score}|${summary.rank.id}|${pct}|${summary.correct ? summary.avgSeconds.toFixed(1) : "0"}|${at}`;
  return [
    `Phòng tuyến Ánh chung — ${summary.name}`,
    `Hạng ${summary.rank.name} · ${summary.score} điểm`,
    `Đúng ${pct}% (${summary.correct}/${summary.answered || 0}) · TB ${sec}s · Chuỗi ${summary.maxStreak} · Bừng sáng ${summary.feverCount}`,
    `Sóng ${summary.wavesCleared}/${summary.waves} · Đoàn kết ${summary.solidarity} · ${clock} · ${summary.outcome === "won" ? "Giữ được phòng tuyến" : "Phòng tuyến đứt"}`,
    best !== null ? `Kỷ lục máy này: ${best}` : "",
    token,
  ]
    .filter(Boolean)
    .join("\n");
}

function boardId(name: string, score: number, at: string) {
  return `${name}|${score}|${at}`;
}

function rankIdFromName(name: string | undefined): RankId {
  if (name === "Ánh chung") return "anh";
  if (name === "Vàng") return "vang";
  if (name === "Bạc") return "bac";
  return "dong";
}

export function loadBoard(): BoardEntry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOARD_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as BoardEntry[];
    if (!Array.isArray(data)) return [];
    return data
      .filter((e) => e && typeof e.score === "number" && typeof e.name === "string")
      .sort((a, b) => b.score - a.score || a.at.localeCompare(b.at));
  } catch {
    return [];
  }
}

function writeBoard(entries: BoardEntry[]) {
  const next = entries
    .sort((a, b) => b.score - a.score || a.at.localeCompare(b.at))
    .slice(0, 40);
  if (typeof localStorage !== "undefined") localStorage.setItem(BOARD_KEY, JSON.stringify(next));
  return next;
}

export function addBoardEntry(entry: Omit<BoardEntry, "id">): BoardEntry[] {
  const name = (entry.name || "Ẩn danh").slice(0, 24);
  const row: BoardEntry = { ...entry, name, id: boardId(name, entry.score, entry.at) };
  const cur = loadBoard().filter((e) => e.id !== row.id);
  return writeBoard([row, ...cur]);
}

export function clearBoard() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(BOARD_KEY);
}

function entryFromToken(line: string): BoardEntry | null {
  const m = line.trim().match(/^#ptac1\|([^|]*)\|(\d+)\|([a-z]+)\|(\d+(?:\.\d+)?)\|(\d+(?:\.\d+)*)\|(.+)$/);
  if (!m) return null;
  let name = "Ẩn danh";
  try {
    name = decodeURIComponent(m[1]).slice(0, 24) || "Ẩn danh";
  } catch {
    name = m[1].slice(0, 24) || "Ẩn danh";
  }
  const score = Number(m[2]);
  const rankId = (["dong", "bac", "vang", "anh"].includes(m[3]) ? m[3] : "dong") as RankId;
  const accuracy = Number(m[4]) / 100;
  const avgSeconds = Number(m[5]);
  const at = m[6];
  if (!Number.isFinite(score) || !at) return null;
  return { id: boardId(name, score, at), name, score, rankId, rank: rankFor(score).name, accuracy, avgSeconds, at };
}

function entryFromProse(text: string): BoardEntry | null {
  const name = text.match(/Phòng tuyến Ánh chung —\s*(.+)/)?.[1]?.trim().slice(0, 24);
  const score = Number(text.match(/(\d+)\s*điểm/)?.[1]);
  const rankName = text.match(/Hạng\s+([^·\n]+)/)?.[1]?.trim();
  const pct = Number(text.match(/Đúng\s+(\d+(?:\.\d+)?)%/)?.[1]);
  const sec = text.match(/TB\s+([\d.]+)s/);
  if (!name || !Number.isFinite(score)) return null;
  const at = new Date().toISOString();
  const rankId = rankName ? rankIdFromName(rankName) : rankFor(score).id;
  return {
    id: boardId(name, score, at.slice(0, 16)),
    name,
    score,
    rankId,
    rank: rankFor(score).name,
    accuracy: Number.isFinite(pct) ? pct / 100 : 0,
    avgSeconds: sec ? Number(sec[1]) : 0,
    at,
  };
}

export function importBoardText(text: string): { added: number; entries: BoardEntry[] } {
  const tokens = text
    .split(/\r?\n/)
    .map(entryFromToken)
    .filter((e): e is BoardEntry => !!e);
  const found = tokens.length ? tokens : [entryFromProse(text)].filter((e): e is BoardEntry => !!e);
  if (!found.length) return { added: 0, entries: loadBoard() };
  const cur = loadBoard();
  const ids = new Set(cur.map((e) => e.id));
  let added = 0;
  for (const row of found) {
    if (ids.has(row.id)) continue;
    ids.add(row.id);
    cur.push(row);
    added++;
  }
  return { added, entries: writeBoard(cur) };
}

export function formatClock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
