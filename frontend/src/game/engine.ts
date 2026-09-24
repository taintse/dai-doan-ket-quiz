import {
  BONDS,
  CLUTCH_BUDGET,
  CLUTCH_CD,
  COLS,
  FEVER_DMG,
  FEVER_SUN,
  FEVER_TIME,
  GLITCH_TIME,
  LESSON_BUDGET,
  PASSIVE_AMOUNT,
  PASSIVE_EVERY,
  PREP_TIME,
  ROWS,
  SOLIDARITY_MAX,
  START_SUN,
  SUN_BASE,
  SUN_SPEED,
  ULTI_BUDGET,
  ULTI_MAX,
  ULTI_PER_KILL,
  ULTI_PER_SEC,
  UNITS,
  VIRUSES,
  WAVES,
  WRONG_SOLIDARITY,
  waveScale,
  type UltiId,
  type UnitId,
  type VirusId,
} from "./balance";
import { FORCED_IDS, QUESTIONS, type Question, type QuestionTag } from "./questions";
import type { GameState, QuizState, RuntimeQuestion, Unit, Virus } from "./types";

const CAU_RATE = 0.74;
const CAU_REGEN = 8;
const SLOW_FACTOR = 0.5;
const SPEED_KEY = "phong-tuyen-anh-chung-speed-v1";

export function loadTimeScale(): 1 | 2 | 3 {
  if (typeof localStorage === "undefined") return 1;
  try {
    const raw = localStorage.getItem(SPEED_KEY);
    if (raw === "2" || raw === "3") return Number(raw) as 2 | 3;
  } catch {
    /* private mode */
  }
  return 1;
}

function rememberSpeed(scale: 1 | 2 | 3) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(SPEED_KEY, String(scale));
  } catch {
    /* private mode */
  }
}

export function createGame(name: string, seed = Date.now(), opts?: { thu?: boolean }): GameState {
  const s: GameState = {
    name: (name || "Người kết nối").slice(0, 24),
    status: "playing",
    rng: seed >>> 0 || 1,
    nextId: 1,
    clock: 0,
    sun: opts?.thu ? 720 : START_SUN,
    sunTick: 0,
    solidarity: SOLIDARITY_MAX,
    bonds: Array.from({ length: ROWS }, () => BONDS),
    units: [],
    viruses: [],
    shots: [],
    pulses: [],
    particles: [],
    floaters: [],
    popups: [],
    banner: {
      title: "Chuẩn bị",
      text: "Mặt trời chỉ nhỏ giọt. Đặt tường phía virus, phản biện đứng sau.",
      life: 4,
    },
    toast: null,
    quiz: null,
    recent: [],
    forcedCursor: 0,
    waveIndex: 0,
    phase: "prep",
    phaseT: 0,
    spawnCursor: 0,
    lessonDone: false,
    ulti: opts?.thu ? ULTI_MAX : 0,
    fever: 0,
    streak: 0,
    glitch: 0,
    shake: 0,
    shakeId: 0,
    clutchCd: 8,
    firewall: 0,
    laneShield: Array.from({ length: ROWS }, () => 0),
    selection: null,
    manualPause: false,
    timeScale: loadTimeScale(),
    thu: !!opts?.thu,
    stats: {
      correct: 0,
      wrong: 0,
      speedSum: 0,
      timeSum: 0,
      maxStreak: 0,
      feverCount: 0,
      breaches: 0,
      wavesCleared: 0,
      kills: 0,
    },
  };
  return s;
}

export function rand(s: GameState): number {
  s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0;
  return s.rng / 4294967296;
}

function nid(s: GameState): number {
  return s.nextId++;
}

function toast(s: GameState, title: string, text = "") {
  s.toast = { title, text, life: 2.1 };
}

function popup(s: GameState, text: string, sub: string, kind: "good" | "bad") {
  s.popups.push({ id: nid(s), text, sub, life: 2.3, kind });
  if (s.popups.length > 4) s.popups.shift();
}

function floater(s: GameState, x: number, lane: number, text: string, color: string) {
  s.floaters.push({ id: nid(s), x, lane, text, life: 0.85, max: 0.85, color });
  if (s.floaters.length > 28) s.floaters.shift();
}

function burst(s: GameState, x: number, lane: number, color: string, n = 12) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + rand(s);
    const sp = 0.4 + rand(s) * 1.1;
    s.particles.push({
      id: nid(s),
      x,
      lane,
      ox: 0,
      oy: 0,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: 0.38 + rand(s) * 0.28,
      max: 0.55,
      color,
      size: 3 + rand(s) * 4,
    });
  }
  if (s.particles.length > 120) s.particles.splice(0, s.particles.length - 120);
}

function shake(s: GameState, power = 0.42) {
  s.shake = Math.max(s.shake, power);
  s.shakeId++;
}

function living(v: Virus): boolean {
  return !v.dead && v.hp > 0;
}

function shuffleQuestion(s: GameState, q: Question): RuntimeQuestion {
  const order = q.choices.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand(s) * (i + 1));
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }
  return {
    id: q.id,
    q: q.q,
    choices: order.map((i) => q.choices[i]),
    answer: order.indexOf(q.answer),
    explain: q.explain,
    source: q.source,
    base: q,
  };
}

function drawQuestion(s: GameState, pred: (q: Question) => boolean, preferId?: string): RuntimeQuestion {
  if (preferId) {
    const found = QUESTIONS.find((q) => q.id === preferId);
    if (found) {
      s.recent.push(found.id);
      if (s.recent.length > 6) s.recent.shift();
      return shuffleQuestion(s, found);
    }
  }
  let pool = QUESTIONS.filter(pred).filter((q) => !s.recent.includes(q.id));
  if (!pool.length) pool = QUESTIONS.filter(pred);
  if (!pool.length) pool = [...QUESTIONS];
  const q = pool[Math.floor(rand(s) * pool.length)];
  s.recent.push(q.id);
  if (s.recent.length > 6) s.recent.shift();
  return shuffleQuestion(s, q);
}

function openQuiz(
  s: GameState,
  kind: QuizState["kind"],
  budget: number,
  tag: QuestionTag | "any",
  extra: Partial<QuizState> = {},
  preferId?: string,
) {
  if (s.quiz || s.status !== "playing") return;
  const question = drawQuestion(s, tag === "any" ? () => true : (q) => q.tags.includes(tag), preferId);
  s.quiz = {
    kind,
    question,
    time: budget,
    budget,
    reveal: 0,
    picked: null,
    speed: 0,
    ...extra,
  };
}

export function castUlti(s: GameState, ulti: UltiId) {
  if (s.status !== "playing" || s.manualPause || s.quiz) return;
  if (s.ulti < ULTI_MAX) {
    toast(s, "Tuyệt kỹ chưa đầy");
    return;
  }
  openQuiz(s, "ulti", ULTI_BUDGET, "skill", { ulti });
}

export function pickAnswer(s: GameState, index: number) {
  if (!s.quiz || s.quiz.reveal > 0 || s.status !== "playing") return;
  if (index < 0 || index >= s.quiz.question.choices.length) return;
  s.quiz.picked = index;
  s.quiz.speed = clamp(s.quiz.time / s.quiz.budget, 0, 1);
  s.quiz.reveal = 1.05;
}

export function togglePause(s: GameState) {
  if (s.status !== "playing" || s.quiz) return;
  s.manualPause = !s.manualPause;
}

export function cycleSpeed(s: GameState) {
  if (s.status !== "playing" || s.quiz) return;
  const next: 1 | 2 | 3 = s.timeScale === 1 ? 2 : s.timeScale === 2 ? 3 : 1;
  s.timeScale = next;
  rememberSpeed(next);
}

export function setSelection(s: GameState, selection: GameState["selection"]) {
  s.selection = s.selection === selection ? null : selection;
}

export function cellAction(s: GameState, lane: number, col: number) {
  if (s.status !== "playing" || s.quiz || s.manualPause) return;
  if (lane < 0 || lane >= ROWS || col < 0 || col >= COLS) return;
  if (s.selection === "shovel") digAt(s, lane, col);
  else if (s.selection) placeAt(s, lane, col, s.selection);
}

function placeAt(s: GameState, lane: number, col: number, type: UnitId) {
  if (s.units.some((u) => u.lane === lane && u.col === col && u.hp > 0)) {
    toast(s, "Ô đã có đơn vị");
    return;
  }
  const spec = UNITS[type];
  if (s.sun < spec.cost) {
    toast(s, "Chưa đủ mặt trời");
    return;
  }
  if (s.glitch > 0 && rand(s) < 0.55) {
    toast(s, "Nhiễu thông tin", "Đặt không vào — chờ nhiễu tan.");
    shake(s, 0.2);
    return;
  }
  s.sun -= spec.cost;
  s.units.push({
    id: nid(s),
    type,
    lane,
    col,
    hp: spec.hp,
    maxHp: spec.hp,
    shield: 0,
    cooldown: rand(s) * 0.35,
    prod: spec.sunEvery ? spec.sunEvery * 0.65 : 0,
    recoil: 0,
    flash: 0,
    pulse: 1.2,
  });
}

function digAt(s: GameState, lane: number, col: number) {
  const u = s.units.find((x) => x.lane === lane && x.col === col && x.hp > 0);
  if (!u) return;
  const refund = Math.floor(UNITS[u.type].cost * 0.5);
  s.sun += refund;
  u.hp = 0;
  toast(s, `Thu hồi +${refund} mặt trời`);
  burst(s, u.col + 0.5, u.lane, "#fbbf24", 8);
}

function grantSun(s: GameState, amount: number, x = 1, lane = 2) {
  const n = Math.max(0, Math.round(amount));
  if (!n) return;
  s.sun += n;
  floater(s, x, lane, `+${n}`, "#fbbf24");
}

function hurtSolidarity(s: GameState, amount: number) {
  s.solidarity = Math.max(0, s.solidarity - amount);
  if (s.solidarity <= 0) s.status = "lost";
}

function spawnVirus(s: GameState, type: VirusId, lane: number, x = COLS + 0.28): Virus {
  const spec = VIRUSES[type];
  const scale = waveScale(s.waveIndex);
  const hp = spec.hp * scale.hp;
  const v: Virus = {
    id: nid(s),
    type,
    lane,
    x,
    hp,
    maxHp: hp,
    slow: 0,
    stun: 0,
    flash: 0,
    dying: 0,
    dead: false,
    echoUp: true,
    bob: rand(s) * 2,
  };
  s.viruses.push(v);
  return v;
}

function bonusVirus(s: GameState) {
  const wave = s.waveIndex;
  const type: VirusId = wave >= 5 ? "congkich" : wave >= 3 ? "spam" : "tin";
  const lane = Math.floor(rand(s) * ROWS);
  spawnVirus(s, type, lane, COLS + 0.1);
  floater(s, COLS - 0.2, lane, "nhiễu", "#fb7185");
}

function beginFight(s: GameState) {
  const wave = WAVES[s.waveIndex];
  s.phase = "fight";
  s.phaseT = 0;
  s.spawnCursor = 0;
  s.banner = { title: wave.name, text: wave.hint, life: 3.4 };
  if (wave.lesson && !s.lessonDone) {
    s.lessonDone = true;
    const id = FORCED_IDS[Math.min(s.forcedCursor, FORCED_IDS.length - 1)];
    s.forcedCursor++;
    openQuiz(s, "lesson", LESSON_BUDGET, "lesson", {}, id);
  }
}

function applyHit(s: GameState, v: Virus, dmg: number, slow: number) {
  if (!living(v)) return;
  let amount = dmg;
  if (v.type === "echo" && v.echoUp && echoShielded(s, v)) amount *= 0.62;
  v.hp -= amount;
  v.flash = 0.1;
  floater(s, v.x, v.lane, Math.round(amount).toString(), "#f8fafc");
  if (slow > 0) v.slow = Math.max(v.slow, slow);
  if (v.hp <= 0) killVirus(s, v);
}

function killVirus(s: GameState, v: Virus) {
  if (v.dead) return;
  v.dead = true;
  v.hp = 0;
  v.dying = 0.46;
  s.stats.kills++;
  s.ulti = Math.min(ULTI_MAX, s.ulti + ULTI_PER_KILL);
  const color = v.type === "echo" ? "#a78bfa" : v.type === "kichdong" ? "#e879f9" : "#fb7185";
  burst(s, v.x, v.lane, color, 14);
}

function echoShielded(s: GameState, v: Virus): boolean {
  return s.viruses.some((o) => o !== v && living(o) && o.lane === v.lane && Math.abs(o.x - v.x) < 1.45);
}

function hasteAura(s: GameState, v: Virus): boolean {
  return s.viruses.some(
    (o) => living(o) && o.type === "kichdong" && o.lane === v.lane && o !== v && Math.abs(o.x - v.x) < 2.05,
  );
}

function blocker(s: GameState, v: Virus): Unit | null {
  let best: Unit | null = null;
  for (const u of s.units) {
    if (u.hp <= 0 || u.lane !== v.lane) continue;
    if (v.x <= u.col + 1.04 && v.x >= u.col + 0.02) {
      if (!best || u.col > best.col) best = u;
    }
  }
  return best;
}

function hurtUnit(u: Unit, dmg: number) {
  let left = dmg;
  if (u.shield > 0) {
    const use = Math.min(u.shield, left);
    u.shield -= use;
    left -= use;
  }
  if (left > 0) u.hp -= left;
  u.flash = 0.08;
}

function hasCau(s: GameState, u: Unit): boolean {
  return s.units.some(
    (o) =>
      o.hp > 0 &&
      o.type === "cau" &&
      o.id !== u.id &&
      Math.max(Math.abs(o.lane - u.lane), Math.abs(o.col - u.col)) <= 1,
  );
}

function breach(s: GameState, v: Virus) {
  if (v.dead) return;
  const broken = s.bonds[v.lane] <= 0;
  if (s.bonds[v.lane] > 0) s.bonds[v.lane] -= 1;
  const spec = VIRUSES[v.type];
  const late = Math.max(0, s.waveIndex - 2);
  const dmg = spec.leak + late * 1.5 + (broken ? 9 : 0);
  v.dead = true;
  v.dying = 0.2;
  v.hp = 0;
  s.stats.breaches++;
  hurtSolidarity(s, dmg);
  shake(s, 0.55);
  floater(s, 0.2, v.lane, `−${Math.round(dmg)}`, "#fb7185");
  burst(s, 0.15, v.lane, "#fb7185", 10);
  s.banner = { title: "Đứt một nhịp", text: `${spec.name} đã chạm cộng đồng.`, life: 2.2 };
}

function bounce(s: GameState, v: Virus, dmg: number) {
  v.x = Math.max(v.x, 1.7);
  applyHit(s, v, dmg, 0.4);
}

function resolveQuiz(s: GameState) {
  const quiz = s.quiz;
  if (!quiz) return;
  const ok = quiz.picked === quiz.question.answer;
  s.quiz = null;
  if (ok) onCorrect(s, quiz);
  else onWrong(s, quiz);
}

function onCorrect(s: GameState, quiz: QuizState) {
  const speed = quiz.speed;
  const mult = s.fever > 0 ? FEVER_SUN : 1;
  const sun = Math.round((SUN_BASE + SUN_SPEED * speed) * mult * (quiz.kind === "clutch" ? 0.85 : 1));
  grantSun(s, sun, 2.2, quiz.lane ?? 1);
  if (s.solidarity < SOLIDARITY_MAX) s.solidarity = Math.min(SOLIDARITY_MAX, s.solidarity + 1);
  s.stats.correct++;
  s.stats.speedSum += speed;
  s.stats.timeSum += quiz.budget * (1 - speed);
  s.streak++;
  s.stats.maxStreak = Math.max(s.stats.maxStreak, s.streak);
  if (s.streak >= 3) {
    const was = s.fever > 0;
    s.fever = Math.min(FEVER_TIME, Math.max(s.fever, 14));
    if (!was) {
      s.stats.feverCount++;
      s.banner = { title: "Ánh chung bừng sáng", text: "Mặt trời ×2, đạn rực hơn.", life: 2.4 };
    }
  }
  popup(s, `+${sun} mặt trời`, "+điểm", "good");
  if (quiz.kind === "ulti" && quiz.ulti) {
    s.ulti = 0;
    if (quiz.ulti === "sang") castSang(s);
    else castFirewall(s);
  } else if (quiz.kind === "clutch" && quiz.lane !== undefined) {
    s.clutchCd = CLUTCH_CD;
    for (const v of s.viruses) {
      if (v.lane === quiz.lane && living(v)) v.x = Math.min(COLS - 0.2, v.x + 2.35);
    }
    s.laneShield[quiz.lane] = Math.max(s.laneShield[quiz.lane], 5.6);
    burst(s, 0.4, quiz.lane, "#22d3ee", 16);
  } else if (quiz.kind === "lesson") {
    for (const v of s.viruses) if (living(v)) v.stun = Math.max(v.stun, 1.5);
  }
}

function onWrong(s: GameState, quiz: QuizState) {
  s.streak = 0;
  s.fever = 0;
  s.stats.wrong++;
  hurtSolidarity(s, WRONG_SOLIDARITY + (quiz.kind === "clutch" ? 2 : 0));
  s.glitch = GLITCH_TIME;
  shake(s, 0.62);
  popup(s, "Chưa đúng", "Nhiễu thông tin", "bad");
  s.banner = { title: "Nhiễu thông tin", text: quiz.question.explain, life: 3.2 };
  if (quiz.kind === "ulti") s.ulti = 0;
  if (quiz.kind === "clutch") {
    s.clutchCd = CLUTCH_CD;
    const v = s.viruses.find((x) => x.id === quiz.virusId && living(x));
    if (v) breach(s, v);
  } else {
    bonusVirus(s);
  }
}

function castSang(s: GameState) {
  for (const v of s.viruses) {
    if (!living(v)) continue;
    v.stun = Math.max(v.stun, 3.5);
    v.echoUp = false;
    applyHit(s, v, 26 + v.maxHp * 0.11, 0);
  }
  s.banner = { title: "Chiếu sáng sự thật", text: "Virus khựng lại, buồng vọng mất lớp vọng.", life: 2.3 };
  burst(s, 4, 2, "#fef3c7", 20);
}

function castFirewall(s: GameState) {
  s.firewall = Math.max(s.firewall, 6.6);
  for (const v of s.viruses) {
    if (!living(v)) continue;
    v.x = Math.min(COLS - 0.15, v.x + 1.5);
  }
  for (const u of s.units) {
    if (u.hp <= 0) continue;
    u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.22);
    if (u.type === "tuong") u.shield += 170;
  }
  s.banner = { title: "Tường lửa đoàn kết", text: "Đẩy lùi, hồi đơn vị, chắn cộng đồng một lúc.", life: 2.3 };
}

function fire(s: GameState, u: Unit, kind: "phan" | "moc", dmg: number, pierce: number, slow: number) {
  const glow = s.fever > 0;
  const boosted = kind === "moc" && hasCau(s, u) ? 1.22 : 1;
  s.shots.push({
    id: nid(s),
    lane: u.lane,
    x: u.col + 0.72,
    dmg: dmg * boosted * (glow ? FEVER_DMG : 1),
    slow,
    pierce,
    hit: [],
    glow,
    kind,
  });
  u.recoil = 0.12;
}

function updateUnits(s: GameState, dt: number) {
  const glitchSlow = s.glitch > 0 ? 1.2 : 1;
  for (const u of s.units) {
    if (u.hp <= 0) continue;
    u.recoil = Math.max(0, u.recoil - dt);
    u.flash = Math.max(0, u.flash - dt);
    if (u.type === "den" && UNITS.den.sunEvery && UNITS.den.sunAmount) {
      u.prod -= dt;
      if (u.prod <= 0) {
        u.prod = UNITS.den.sunEvery;
        grantSun(s, UNITS.den.sunAmount * (s.fever > 0 ? FEVER_SUN : 1), u.col + 0.5, u.lane);
      }
    }
    if (u.type === "tuong" && hasCau(s, u)) {
      u.hp = Math.min(u.maxHp, u.hp + CAU_REGEN * dt);
    }
    if (u.type === "cau") {
      u.pulse -= dt;
      if (u.pulse <= 0) {
        u.pulse = 2.15;
        s.pulses.push({ id: nid(s), lane: u.lane, x: u.col + 0.5, life: 0.7, max: 0.7 });
        for (const v of s.viruses) {
          if (living(v) && v.lane === u.lane && v.x > u.col && v.x < u.col + 3.4) v.slow = Math.max(v.slow, 1.15);
        }
      }
    }
    const spec = UNITS[u.type];
    if (!spec.rate || !spec.dmg) continue;
    const ready = s.viruses.some((v) => living(v) && v.lane === u.lane && v.x > u.col + 0.4);
    if (!ready) continue;
    u.cooldown -= dt;
    if (u.cooldown > 0) continue;
    const cau = hasCau(s, u) ? CAU_RATE : 1;
    u.cooldown = spec.rate * cau * glitchSlow;
    fire(s, u, u.type === "moc" ? "moc" : "phan", spec.dmg, spec.pierce ?? 1, spec.slow ?? 0);
  }
}

function updateShots(s: GameState, dt: number) {
  const speed = 7.4;
  for (const shot of s.shots) {
    const next = shot.x + speed * dt;
    const hits = s.viruses
      .filter((v) => living(v) && v.lane === shot.lane && !shot.hit.includes(v.id) && v.x >= shot.x - 0.05 && v.x <= next + 0.08)
      .sort((a, b) => a.x - b.x);
    for (const v of hits) {
      if (shot.hit.length >= shot.pierce) break;
      shot.hit.push(v.id);
      applyHit(s, v, shot.dmg, shot.slow);
      shot.x = v.x;
    }
    if (shot.hit.length < shot.pierce) shot.x = next;
  }
  s.shots = s.shots.filter((shot) => shot.hit.length < shot.pierce && shot.x < COLS + 0.4);
}

function updateViruses(s: GameState, dt: number) {
  let clutch: Virus | null = null;
  const scale = waveScale(s.waveIndex);
  for (const v of s.viruses) {
    v.flash = Math.max(0, v.flash - dt);
    if (v.dead) {
      v.dying -= dt;
      continue;
    }
    v.slow = Math.max(0, v.slow - dt);
    v.stun = Math.max(0, v.stun - dt);
    if (v.stun > 0) continue;
    let speed = VIRUSES[v.type].speed * scale.speed;
    if (v.slow > 0) speed *= SLOW_FACTOR;
    if (hasteAura(s, v)) speed *= 1.22;
    if (s.bonds[v.lane] <= 0) speed *= 1.1;
    const block = blocker(s, v);
    if (block) {
      v.x = block.col + 0.84;
      const chew = VIRUSES[v.type].dps * scale.dps * (v.slow > 0 ? 0.72 : 1);
      hurtUnit(block, chew * dt);
    } else {
      v.x -= speed * dt;
      const shielded = s.firewall > 0 || s.laneShield[v.lane] > 0;
      if (shielded && v.x < 0.78) {
        bounce(s, v, 34);
      } else if (v.x <= 0.16) {
        breach(s, v);
        if (s.status === "lost") return;
      } else if (
        !clutch &&
        !s.quiz &&
        s.clutchCd <= 0 &&
        s.waveIndex >= 1 &&
        v.x <= 0.9 &&
        !s.manualPause
      ) {
        clutch = v;
      }
    }
  }
  if (clutch && s.status === "playing" && !s.quiz) {
    openQuiz(s, "clutch", CLUTCH_BUDGET, "clutch", { lane: clutch.lane, virusId: clutch.id });
  }
}

function reap(s: GameState) {
  const deadUnits = s.units.filter((u) => u.hp <= 0);
  if (deadUnits.length) {
    for (const u of deadUnits) burst(s, u.col + 0.5, u.lane, "#94a3b8", 8);
    s.units = s.units.filter((u) => u.hp > 0);
  }
  s.viruses = s.viruses.filter((v) => !(v.dead && v.dying <= 0));
}

function decayFx(s: GameState, dt: number) {
  s.shake = Math.max(0, s.shake - dt);
  s.glitch = Math.max(0, s.glitch - dt);
  s.fever = Math.max(0, s.fever - dt);
  s.firewall = Math.max(0, s.firewall - dt);
  s.clutchCd = Math.max(0, s.clutchCd - dt);
  s.laneShield = s.laneShield.map((n) => Math.max(0, n - dt));
  if (s.banner) {
    s.banner.life -= dt;
    if (s.banner.life <= 0) s.banner = null;
  }
  if (s.toast) {
    s.toast.life -= dt;
    if (s.toast.life <= 0) s.toast = null;
  }
  for (const p of s.particles) {
    p.life -= dt;
    p.ox += p.vx * dt * 46;
    p.oy += p.vy * dt * 46;
  }
  s.particles = s.particles.filter((p) => p.life > 0);
  for (const f of s.floaters) f.life -= dt;
  s.floaters = s.floaters.filter((f) => f.life > 0);
  for (const p of s.popups) p.life -= dt;
  s.popups = s.popups.filter((p) => p.life > 0);
  for (const p of s.pulses) p.life -= dt;
  s.pulses = s.pulses.filter((p) => p.life > 0);
}

function simulate(s: GameState, dt: number) {
  s.phaseT += dt;
  if (s.phase === "fight" || s.phase === "calm" || s.phase === "clear") {
    s.ulti = Math.min(ULTI_MAX, s.ulti + ULTI_PER_SEC * dt);
  }
  s.sunTick += dt;
  if (s.sunTick >= PASSIVE_EVERY) {
    s.sunTick -= PASSIVE_EVERY;
    grantSun(s, PASSIVE_AMOUNT * (s.fever > 0 ? FEVER_SUN : 1), 0.3, 0);
  }

  const wave = WAVES[s.waveIndex];
  if (s.phase === "prep" && s.phaseT >= PREP_TIME) beginFight(s);
  else if (s.phase === "fight" && wave) {
    while (s.spawnCursor < wave.spawns.length && wave.spawns[s.spawnCursor].t <= s.phaseT) {
      const sp = wave.spawns[s.spawnCursor];
      spawnVirus(s, sp.type, sp.lane);
      s.spawnCursor++;
    }
    if (s.phaseT >= wave.fight) {
      if (s.waveIndex >= WAVES.length - 1) s.phase = "clear";
      else {
        s.phase = "calm";
        s.phaseT = 0;
        s.banner = { title: "Khoảng lặng", text: "Giữ hàng. Sóng sau dày hơn.", life: 2.4 };
      }
    }
  } else if (s.phase === "calm" && wave && s.phaseT >= wave.calm) {
    s.stats.wavesCleared = Math.max(s.stats.wavesCleared, s.waveIndex + 1);
    s.waveIndex++;
    s.lessonDone = false;
    beginFight(s);
  } else if (s.phase === "clear" && s.viruses.length === 0 && !s.quiz) {
    s.stats.wavesCleared = WAVES.length;
    s.status = "won";
    return;
  }

  if (s.status !== "playing") return;
  updateUnits(s, dt);
  updateShots(s, dt);
  updateViruses(s, dt);
  reap(s);
}

function advanceQuiz(s: GameState, delta: number) {
  // Question windows stay on wall-clock time so a 2x/3x run is not a shorter exam.
  s.manualPause = false;
  s.clock += delta;
  if (!s.quiz) return;
  if (s.quiz.reveal > 0) {
    s.quiz.reveal -= delta;
    if (s.quiz.reveal <= 0) resolveQuiz(s);
  } else {
    s.quiz.time -= delta;
    if (s.quiz.time <= 0) {
      s.quiz.picked = -1;
      s.quiz.speed = 0;
      s.quiz.reveal = 1.05;
    }
  }
}

export function step(s: GameState, dt: number) {
  if (s.status !== "playing") return;
  const frame = Math.max(0, Math.min(0.05, dt));
  if (!frame) return;
  if (s.quiz) {
    advanceQuiz(s, frame);
    return;
  }
  if (s.manualPause) return;
  const scale = s.timeScale === 2 || s.timeScale === 3 ? s.timeScale : 1;
  let left = frame * scale;
  while (left > 1e-8) {
    const slice = Math.min(0.05, left);
    s.clock += slice;
    simulate(s, slice);
    decayFx(s, slice);
    left -= slice;
    if (s.status !== "playing" || s.quiz) return;
  }
}

export function debugRush(s: GameState) {
  s.manualPause = false;
  s.quiz = null;
  spawnVirus(s, "tin", 2, 6.4);
  spawnVirus(s, "spam", 2, 7.2);
  spawnVirus(s, "echo", 1, 7.4);
}

export function debugThreat(s: GameState) {
  s.manualPause = false;
  s.clutchCd = 0;
  s.waveIndex = Math.max(s.waveIndex, 1);
  s.quiz = null;
  spawnVirus(s, "congkich", 2, 0.72);
}

export function debugWin(s: GameState) {
  s.quiz = null;
  s.viruses = [];
  s.stats.wavesCleared = WAVES.length;
  s.status = "won";
}

export function debugLose(s: GameState) {
  s.quiz = null;
  s.solidarity = 0;
  s.status = "lost";
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
