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

type Listener = (rows: LiveRow[], note: string | null, enabled: boolean) => void;

let db: import("firebase/database").Database | null = null;
let starting: Promise<boolean> | null = null;
let rows: LiveRow[] = [];
let note: string | null = isFirebaseConfigured() ? null : OFF_NOTE;
const listeners = new Set<Listener>();
let lastPush = 0;
let lastSig = "";

function emit() {
  const enabled = isFirebaseConfigured();
  for (const cb of listeners) cb(rows, note, enabled);
}

export function subscribeLive(cb: Listener): () => void {
  listeners.add(cb);
  cb(rows, note, isFirebaseConfigured());
  void ensureListen();
  return () => {
    listeners.delete(cb);
  };
}

function ensureListen(): Promise<boolean> {
  if (!isFirebaseConfigured()) return Promise.resolve(false);
  if (db) return Promise.resolve(true);
  if (!starting) {
    starting = (async () => {
      try {
        const { initializeApp, getApps } = await import("firebase/app");
        const { getDatabase, ref, onValue } = await import("firebase/database");
        const app = getApps()[0] ?? initializeApp(firebaseConfig);
        const database = getDatabase(app);
        onValue(
          ref(database, "scores"),
          (snap) => {
            const val = snap.val() as Record<string, Partial<LiveRow>> | null;
            rows = Object.entries(val ?? {})
              .map(([id, v]) => {
                const score = Number(v?.score) || 0;
                return {
                  id,
                  name: String(v?.name || "Ẩn danh").slice(0, 24),
                  score,
                  rank: String(v?.rank || rankFor(score).name),
                  status: String(v?.status || ""),
                  updatedAt: Number(v?.updatedAt) || 0,
                };
              })
              .sort((a, b) => b.score - a.score || b.updatedAt - a.updatedAt);
            note = null;
            emit();
          },
          () => {
            note = "Không đọc được Firebase. Kiểm tra Realtime Database và rules.";
            emit();
          },
        );
        db = database;
        return true;
      } catch {
        note = "Không kết nối được Firebase.";
        emit();
        return false;
      } finally {
        starting = null;
      }
    })();
  }
  return starting;
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
  try {
    const ready = await ensureListen();
    if (!ready || !db) return;
    const { ref, set } = await import("firebase/database");
    await set(ref(db, `scores/${playerKey()}`), {
      name,
      score,
      rank: entry.rank,
      status: entry.status,
      updatedAt: now,
    });
  } catch {
    note = "Chưa gửi được điểm lên Firebase.";
    emit();
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
