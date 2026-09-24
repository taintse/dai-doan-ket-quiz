import type { UltiId, UnitId, VirusId } from "./balance";
import type { Question } from "./questions";

export interface RuntimeQuestion {
  id: string;
  q: string;
  choices: string[];
  answer: number;
  explain: string;
  source: string;
  base: Question;
}

export interface Unit {
  id: number;
  type: UnitId;
  lane: number;
  col: number;
  hp: number;
  maxHp: number;
  shield: number;
  cooldown: number;
  prod: number;
  recoil: number;
  flash: number;
  pulse: number;
}

export interface Virus {
  id: number;
  type: VirusId;
  lane: number;
  x: number;
  hp: number;
  maxHp: number;
  slow: number;
  stun: number;
  flash: number;
  dying: number;
  dead: boolean;
  echoUp: boolean;
  bob: number;
}

export interface Shot {
  id: number;
  lane: number;
  x: number;
  dmg: number;
  slow: number;
  pierce: number;
  hit: number[];
  glow: boolean;
  kind: "phan" | "moc";
}

export interface Pulse {
  id: number;
  lane: number;
  x: number;
  life: number;
  max: number;
}

export interface Particle {
  id: number;
  x: number;
  lane: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
}

export interface Floater {
  id: number;
  x: number;
  lane: number;
  text: string;
  life: number;
  max: number;
  color: string;
}

export interface Popup {
  id: number;
  text: string;
  sub: string;
  life: number;
  kind: "good" | "bad";
}

export interface Banner {
  title: string;
  text: string;
  life: number;
}

export interface QuizState {
  kind: "ulti" | "clutch" | "lesson";
  ulti?: UltiId;
  question: RuntimeQuestion;
  time: number;
  budget: number;
  reveal: number;
  picked: number | null;
  speed: number;
  lane?: number;
  virusId?: number;
}

export interface Stats {
  correct: number;
  wrong: number;
  speedSum: number;
  timeSum: number;
  maxStreak: number;
  feverCount: number;
  breaches: number;
  wavesCleared: number;
  kills: number;
}

export type Phase = "prep" | "fight" | "calm" | "clear";
export type Status = "playing" | "won" | "lost";
export type Selection = UnitId | "shovel" | null;

export interface GameState {
  name: string;
  status: Status;
  rng: number;
  nextId: number;
  clock: number;
  sun: number;
  sunTick: number;
  solidarity: number;
  bonds: number[];
  units: Unit[];
  viruses: Virus[];
  shots: Shot[];
  pulses: Pulse[];
  particles: Particle[];
  floaters: Floater[];
  popups: Popup[];
  banner: Banner | null;
  toast: Banner | null;
  quiz: QuizState | null;
  recent: string[];
  forcedCursor: number;
  waveIndex: number;
  phase: Phase;
  phaseT: number;
  spawnCursor: number;
  lessonDone: boolean;
  ulti: number;
  fever: number;
  streak: number;
  glitch: number;
  shake: number;
  shakeId: number;
  clutchCd: number;
  firewall: number;
  laneShield: number[];
  selection: Selection;
  manualPause: boolean;
  stats: Stats;
  thu: boolean;
}
