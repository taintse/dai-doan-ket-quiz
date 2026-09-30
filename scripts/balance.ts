import { UNITS, WAVES, type UnitId } from "../frontend/src/game/balance";
import { cellAction, continueQuiz, createGame, openMarkQuiz, pickAnswer, step, castUlti } from "../frontend/src/game/engine";
import { summarize } from "../frontend/src/game/score";
import type { GameState } from "../frontend/src/game/types";

interface Profile {
  name: string;
  place: boolean;
  ulti: boolean;
  accuracy: number;
  speed: number;
  answer: boolean;
  /** hold: wall + phản biện only on lanes already in play. Never opens optional mark quizzes. */
  style?: "default" | "hold";
}

const PROFILES: Profile[] = [
  { name: "afk", place: false, ulti: false, accuracy: 0, speed: 0, answer: false },
  { name: "passive", place: true, ulti: false, accuracy: 0, speed: 0, answer: false },
  { name: "hold", place: true, ulti: false, accuracy: 0, speed: 0, answer: false, style: "hold" },
  { name: "noUlti", place: true, ulti: false, accuracy: 0.9, speed: 0.72, answer: true },
  { name: "poor", place: true, ulti: true, accuracy: 0.42, speed: 0.22, answer: true },
  { name: "shaky", place: true, ulti: true, accuracy: 0.7, speed: 0.4, answer: true },
  { name: "strong", place: true, ulti: true, accuracy: 0.9, speed: 0.72, answer: true },
  { name: "slowGod", place: true, ulti: true, accuracy: 1, speed: 0.12, answer: true },
  { name: "fastGod", place: true, ulti: true, accuracy: 1, speed: 0.9, answer: true },
];

function priority(): Array<{ lane: number; col: number; type: UnitId }> {
  const lanes = [2, 1, 3, 0, 4];
  const pri: Array<{ lane: number; col: number; type: UnitId }> = [];
  pri.push({ lane: 2, col: 7, type: "tuong" });
  pri.push({ lane: 2, col: 5, type: "phan" });
  pri.push({ lane: 2, col: 1, type: "den" });
  for (const lane of lanes) {
    if (lane === 2) continue;
    pri.push({ lane, col: 7, type: "tuong" });
    pri.push({ lane, col: 5, type: "phan" });
  }
  pri.push({ lane: 0, col: 1, type: "den" });
  for (const lane of [2, 1, 3]) pri.push({ lane, col: 6, type: "cau" });
  for (const lane of [0, 4]) pri.push({ lane, col: 6, type: "phan" });
  for (const lane of [2, 0, 4]) pri.push({ lane, col: 4, type: "moc" });
  for (const lane of [1, 3]) pri.push({ lane, col: 4, type: "phan" });
  for (const lane of lanes) pri.push({ lane, col: 3, type: "phan" });
  return pri;
}

const PRI = priority();

function holdSlots(s: GameState): Array<{ lane: number; col: number; type: UnitId }> {
  const lanes = [2, 1, 3, 0, 4];
  const seen = new Set<number>([2]);
  const wave = WAVES[Math.min(s.waveIndex, WAVES.length - 1)];
  for (const sp of wave.spawns) seen.add(sp.lane);
  if (s.phase === "calm" || s.phase === "clear") {
    const next = WAVES[s.waveIndex + 1];
    if (next) for (const sp of next.spawns) seen.add(sp.lane);
  }
  for (const v of s.viruses) if (!v.dead) seen.add(v.lane);
  const open: Array<{ lane: number; col: number; type: UnitId }> = [];
  for (const lane of lanes) {
    if (!seen.has(lane)) continue;
    const alive = s.units.filter((u) => u.hp > 0 && u.lane === lane);
    const hasWall = alive.some((u) => u.type === "tuong");
    const shots = alive.filter((u) => u.type === "phan" || u.type === "moc").length;
    if (!hasWall) open.push({ lane, col: 7, type: "tuong" });
    if (shots < 1) open.push({ lane, col: 5, type: "phan" });
    else if (shots < 2 && hasWall) open.push({ lane, col: 4, type: "phan" });
  }
  return open;
}

function buy(s: GameState, profile: Profile) {
  if (profile.style === "hold") {
    for (const slot of holdSlots(s)) {
      if (s.sun < UNITS[slot.type].cost) continue;
      s.selection = slot.type;
      cellAction(s, slot.lane, slot.col);
      return;
    }
    return;
  }
  const open = PRI.filter((slot) => !s.units.some((u) => u.hp > 0 && u.lane === slot.lane && u.col === slot.col));
  const ranked = open
    .map((slot, index) => {
      const laneUnits = s.units.filter((u) => u.hp > 0 && u.lane === slot.lane);
      const hasShot = laneUnits.some((u) => u.type === "phan" || u.type === "moc");
      let score = index;
      if (slot.type === "tuong" && hasShot) score += 30;
      if ((slot.type === "phan" || slot.type === "moc") && !hasShot) score -= 8;
      return { slot, score };
    })
    .sort((a, b) => a.score - b.score);
  for (const { slot } of ranked) {
    if (s.sun < UNITS[slot.type].cost) continue;
    s.selection = slot.type;
    cellAction(s, slot.lane, slot.col);
    return;
  }
}

function maybeAnswer(s: GameState, profile: Profile, rand: () => number) {
  const q = s.quiz;
  if (!q) return;
  if (q.outcome === "wrong") {
    continueQuiz(s);
    return;
  }
  if (q.outcome === "correct") return;
  if (!profile.answer) {
    const idx = q.question.choices.findIndex((_, i) => i !== q.question.answer);
    pickAnswer(s, idx < 0 ? 0 : idx);
    continueQuiz(s);
    return;
  }
  if (q.wait < 0.35 + (1 - profile.speed) * 1.1) return;
  const correct = rand() < profile.accuracy;
  const idx = correct ? q.question.answer : q.question.choices.findIndex((_, i) => i !== q.question.answer);
  pickAnswer(s, idx < 0 ? 0 : idx);
}

function maybeMark(s: GameState, profile: Profile) {
  if (profile.style === "hold" || !profile.answer || s.quiz || s.manualPause) return;
  const v = s.viruses.find((x) => !x.dead && x.marked && !x.asked && !x.lit && x.x < 8);
  if (!v) return;
  openMarkQuiz(s, v.id);
}

function maybeUlti(s: GameState, profile: Profile, flip: { n: number }) {
  if (!profile.ulti || s.quiz || s.ulti < 100) return;
  if (s.phase === "prep") return;
  const hurt = s.units.some((u) => u.type === "tuong" && u.hp < u.maxHp * 0.45);
  const crowd = s.viruses.filter((v) => !v.dead).length;
  if (crowd < 3 && !hurt) return;
  castUlti(s, flip.n++ % 2 === 0 ? "sang" : "tuonglua");
}

function run(profile: Profile, seed: number) {
  const s = createGame(profile.name, seed);
  let rng = seed >>> 0 || 1;
  const rnd = () => {
    rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
    return rng / 4294967296;
  };
  const flip = { n: 0 };
  let buyT = 0;
  const dt = 0.05;
  while (s.status === "playing" && s.clock < 60 * 16) {
    if (!s.quiz && !s.manualPause && profile.place) {
      buyT += dt;
      if (buyT >= 0.35) {
        buyT = 0;
        buy(s, profile);
      }
      maybeUlti(s, profile, flip);
      maybeMark(s, profile);
    }
    maybeAnswer(s, profile, rnd);
    step(s, dt);
  }
  if (s.status === "playing") s.status = "lost";
  const sum = summarize(s);
  const kinds = s.units.reduce<Record<string, number>>((m, u) => {
    m[u.type] = (m[u.type] ?? 0) + 1;
    return m;
  }, {});
  return {
    profile: profile.name,
    seed,
    status: s.status,
    clock: Math.round(s.clock),
    wave: Math.min(WAVES.length, s.waveIndex + (s.status === "won" ? 1 : 1)),
    waveName: WAVES[Math.min(s.waveIndex, WAVES.length - 1)].name,
    sol: Math.round(s.solidarity),
    correct: sum.correct,
    wrong: sum.wrong,
    acc: Math.round(sum.accuracy * 100),
    avg: sum.avgSeconds.toFixed(1),
    score: sum.score,
    rank: sum.rank.name,
    sun: Math.round(s.sun),
    units: s.units.length,
    kinds,
    breaches: sum.breaches,
    fever: sum.feverCount,
    streak: sum.maxStreak,
    kills: s.stats.kills,
  };
}

const seeds = [3, 7, 11, 13, 19, 23, 29, 31, 37, 41, 47, 53];
for (const profile of PROFILES) {
  for (const seed of seeds) {
    const r = run(profile, seed);
    console.log(
      `${r.profile.padEnd(8)} seed ${r.seed} ${r.status.padEnd(4)} ${r.clock}s ${r.waveName} sol ${r.sol} acc ${r.acc}% (${r.correct}/${r.correct + r.wrong}) avg ${r.avg}s score ${r.score} ${r.rank} sun ${r.sun} units ${r.units} ${JSON.stringify(r.kinds)} leak ${r.breaches} fever ${r.fever} streak ${r.streak} kills ${r.kills}`,
    );
  }
}
