import { firebaseConfig, isFirebaseConfigured } from "./firebaseConfig";
import { rankFor } from "./score";

export interface LiveRow {
  id: string;
  name: string;
  score: number;
  rank: string;
  status: string;
  updatedAt: number;
}

const OFF_NOTE = "Bảng thời gian thực đang tắt. Thêm cấu hình Firebase để cả lớp thấy điểm ngay.";
const POLL_MS = 2500;

type Listener = (rows: LiveRow[], note: string | null, enabled: boolean) => void;

let db: import("firebase/database").Database | null = null;
let starting: Promise<boolean> | null = null;
let sdkUnsub: (() => void) | null = null;
let sdkCancelled = false;
let sdkReady = false;
let restTimer: number | null = null;
let rows: LiveRow[] = [];
let suppressScoresUntil = 0;
let note: string | null = isFirebaseConfigured() ? null : OFF_NOTE;
const listeners = new Set<Listener>();
let lastPush = 0;
let lastSig = "";

function emit() {
  const enabled = isFirebaseConfigured();
  for (const cb of listeners) cb(rows, note, enabled);
}

export function scoresToRows(val: unknown): LiveRow[] {
  if (!val || typeof val !== "object" || Array.isArray(val)) return [];
  return Object.entries(val as Record<string, Partial<LiveRow>>)
    .flatMap(([id, v]) => {
      if (!v || typeof v !== "object" || typeof v.name !== "string" || !Number.isFinite(Number(v.score))) return [];
      const score = Number(v.score) || 0;
      return [
        {
          id,
          name: v.name.slice(0, 24) || "Ẩn danh",
          score,
          rank: String(v.rank || rankFor(score).name),
          status: String(v.status || ""),
          updatedAt: Number(v.updatedAt) || 0,
        },
      ];
    })
    .sort((a, b) => b.score - a.score || b.updatedAt - a.updatedAt);
}

function databaseUrl() {
  return firebaseConfig.databaseURL.replace(/\/+$/, "");
}

function onPages() {
  if (typeof location === "undefined") return false;
  return location.hostname === "github.io" || location.hostname.endsWith(".github.io");
}

function applyRows(next: LiveRow[]) {
  rows = Date.now() < suppressScoresUntil ? [] : next;
  note = null;
  emit();
}

function sdkErrorNote(error: { code?: string; message?: string }) {
  const code = String(error?.code || "error").trim() || "error";
  const message = String(error?.message || "").replace(/\s+/g, " ").trim();
  const detail = `${code}: ${message}`.replace(/^:\s*/, "").slice(0, 120);
  return `Không đọc được Firebase (${detail}).`;
}

async function pullRest() {
  const res = await fetch(`${databaseUrl()}/scores.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(String(res.status));
  applyRows(scoresToRows(await res.json()));
}

function startRest() {
  const run = () => {
    void pullRest().catch((err: unknown) => {
      const status = err instanceof Error ? err.message : "lỗi";
      const base =
        note && note.startsWith("Không đọc được Firebase")
          ? note.replace(/\.?\s*REST[\s\S]*$/, "").replace(/\.$/, "")
          : "Không đọc được Firebase";
      note = `${base}. REST ${status}.`.slice(0, 180);
      emit();
    });
  };
  run();
  if (restTimer != null || typeof window === "undefined") return;
  restTimer = window.setInterval(run, POLL_MS);
}

function stopRest() {
  if (restTimer != null && typeof window !== "undefined") window.clearInterval(restTimer);
  restTimer = null;
}

function failSdk(error: { code?: string; message?: string }) {
  if (sdkCancelled) return;
  sdkCancelled = true;
  sdkReady = false;
  note = sdkErrorNote(error);
  emit();
  try {
    sdkUnsub?.();
  } catch {
    /* listener already cancelled */
  }
  sdkUnsub = null;
  startRest();
}

function ensureListen(): Promise<boolean> {
  if (!isFirebaseConfigured()) return Promise.resolve(false);
  if (sdkCancelled) return Promise.resolve(true);
  if (db && sdkUnsub) return Promise.resolve(true);
  if (!starting) {
    starting = (async () => {
      try {
        const { initializeApp, getApps } = await import("firebase/app");
        const { getDatabase, ref, onValue } = await import("firebase/database");
        const app = getApps()[0] ?? initializeApp(firebaseConfig);
        const database = getDatabase(app);
        sdkUnsub = onValue(
          ref(database, "scores"),
          (snap) => {
            if (sdkCancelled) return;
            sdkReady = true;
            applyRows(scoresToRows(snap.val()));
            stopRest();
          },
          (error: Error & { code?: string }) => {
            failSdk(error);
          },
        );
        db = database;
        return true;
      } catch (err) {
        const error = err as { code?: string; message?: string };
        failSdk({ code: error?.code || "init", message: error?.message || "Không kết nối được Firebase." });
        return true;
      } finally {
        starting = null;
      }
    })();
  }
  return starting;
}

export function subscribeLive(cb: Listener): () => void {
  listeners.add(cb);
  cb(rows, note, isFirebaseConfigured());
  if (isFirebaseConfigured()) {
    if (sdkCancelled || (onPages() && !sdkReady)) startRest();
    void ensureListen();
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && !sdkReady) stopRest();
  };
}

function playerKey(): string {
  const storageKey = "phong-tuyen-anh-chung-player-v1";
  try {
    const cur = localStorage.getItem(storageKey);
    if (cur && /^[a-zA-Z0-9_-]{6,40}$/.test(cur)) return cur;
    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 20);
    localStorage.setItem(storageKey, id);
    return id;
  } catch {
    return "guest";
  }
}

async function putRest(payload: { name: string; score: number; rank: string; status: string; updatedAt: number }) {
  const res = await fetch(`${databaseUrl()}/scores/${playerKey()}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(String(res.status));
}

export async function pushLiveScore(
  entry: { name: string; score: number; rank: string; status: string },
  force = false,
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const now = Date.now();
  const name = (entry.name || "Người kết nối").slice(0, 24);
  const score = Math.max(0, Math.round(entry.score));
  const sig = `${entry.status}|${score}|${name}`;
  if (!force && sig === lastSig) return;
  if (!force && now - lastPush < 2500) return;
  lastSig = sig;
  lastPush = now;
  const payload = { name, score, rank: entry.rank, status: entry.status, updatedAt: now };
  try {
    if (!sdkCancelled) void ensureListen();
    if (onPages() || sdkCancelled || !sdkReady || !db) {
      await putRest(payload);
      return;
    }
    const { ref, set } = await import("firebase/database");
    await set(ref(db, `scores/${playerKey()}`), payload);
  } catch (err) {
    const error = err as Error & { code?: string };
    if (!sdkCancelled && error?.code) failSdk(error);
    else if (!restTimer) startRest();
    try {
      await putRest(payload);
    } catch (restErr) {
      const status = restErr instanceof Error ? restErr.message : "lỗi";
      const base = note && note.startsWith("Không đọc được Firebase") ? note.replace(/\.$/, "") : sdkErrorNote(error);
      note = `${base}. REST ${status}.`.slice(0, 180);
      emit();
    }
  }
}

export async function resetLiveScores(): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error("off");
  rows = [];
  note = null;
  emit();
  suppressScoresUntil = Date.now() + 4000;
  try {
    if (db && sdkReady && !sdkCancelled && !onPages()) {
      const { ref, remove } = await import("firebase/database");
      await remove(ref(db, "scores"));
    } else {
      const res = await fetch(`${databaseUrl()}/scores.json`, { method: "DELETE" });
      if (!res.ok) throw new Error(String(res.status));
    }
  } catch (err) {
    suppressScoresUntil = 0;
    void pullRest().catch(() => undefined);
    throw err;
  }
}

export function pushFromGame(s: { name: string; score: number; status: string }, force = false) {
  return pushLiveScore(
    {
      name: s.name,
      score: s.score,
      rank: rankFor(s.score).name,
      status: s.status,
    },
    force,
  );
}
