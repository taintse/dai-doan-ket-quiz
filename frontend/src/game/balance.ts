export const COLS = 8;
export const ROWS = 5;
export const CELL = 86;
export const COMM = 104;

export const PREP_TIME = 16;
export const START_SUN = 200;
export const PASSIVE_EVERY = 12;
export const PASSIVE_AMOUNT = 4;
export const SOLIDARITY_MAX = 100;
export const BONDS = 3;
export const GLITCH_TIME = 4.4;
export const FEVER_TIME = 16;
export const FEVER_SUN = 2;
export const FEVER_DMG = 1.32;
export const ULTI_MAX = 100;
export const ULTI_PER_KILL = 6;
export const ULTI_PER_SEC = 0.48;
export const ULTI_BUDGET = 5;
export const CLUTCH_BUDGET = 5;
export const LESSON_BUDGET = 7.2;
export const CLUTCH_CD = 26;
export const SUN_BASE = 18;
export const SUN_SPEED = 40;
export const WRONG_SOLIDARITY = 4;

export type UnitId = "den" | "tuong" | "phan" | "cau" | "moc";
export type VirusId = "tin" | "congkich" | "echo" | "spam" | "kichdong";
export type UltiId = "sang" | "tuonglua";

export interface UnitSpec {
  id: UnitId;
  name: string;
  cost: number;
  hp: number;
  blurb: string;
  rate?: number;
  dmg?: number;
  pierce?: number;
  slow?: number;
  sunEvery?: number;
  sunAmount?: number;
}

export const UNIT_LIST: UnitSpec[] = [
  {
    id: "den",
    name: "Đèn kiến thức",
    cost: 40,
    hp: 110,
    sunEvery: 16,
    sunAmount: 4,
    blurb: "Ánh nhỏ giọt, không đủ nuôi cả phòng tuyến. Đặt phía sau.",
  },
  {
    id: "tuong",
    name: "Tường chung",
    cost: 40,
    hp: 1280,
    blurb: "Chắn một hàng, máu dày. Đặt về phía virus — bên phải đơn vị bắn.",
  },
  {
    id: "phan",
    name: "Phản biện",
    cost: 90,
    hp: 240,
    rate: 0.55,
    dmg: 30,
    pierce: 1,
    blurb: "Bắn cùng hàng. Giữ tường phía trước để đạn còn kịp.",
  },
  {
    id: "cau",
    name: "Cầu đồng",
    cost: 110,
    hp: 160,
    blurb: "Nối đơn vị cạnh bên: bắn mau hơn, tường hồi máu, làm chậm virus gần đó.",
  },
  {
    id: "moc",
    name: "Mốc ranh",
    cost: 150,
    hp: 320,
    rate: 1.5,
    dmg: 40,
    pierce: 3,
    slow: 2.3,
    blurb: "Đòn nặng, xuyên hàng và làm chậm. Giữ đường ranh.",
  },
];

export const UNITS: Record<UnitId, UnitSpec> = Object.fromEntries(UNIT_LIST.map((u) => [u.id, u])) as Record<
  UnitId,
  UnitSpec
>;

export interface VirusSpec {
  id: VirusId;
  name: string;
  hp: number;
  speed: number;
  dps: number;
  leak: number;
  blurb: string;
}

export const VIRUS_LIST: VirusSpec[] = [
  { id: "tin", name: "Tin giả", hp: 84, speed: 0.34, dps: 12, leak: 6, blurb: "Tin không nguồn, đi đều." },
  { id: "congkich", name: "Công kích", hp: 58, speed: 0.6, dps: 22, leak: 7, blurb: "Nhắm vào người, đi nhanh." },
  { id: "echo", name: "Buồng vọng", hp: 300, speed: 0.2, dps: 10, leak: 8, blurb: "Máu dày. Đứng gần virus khác thì đỡ đòn." },
  { id: "spam", name: "Spam thù", hp: 30, speed: 0.72, dps: 7, leak: 4, blurb: "Bầy nhỏ, rất nhanh." },
  { id: "kichdong", name: "Kích động", hp: 420, speed: 0.3, dps: 26, leak: 14, blurb: "Kéo virus cùng hàng đi nhanh hơn. Chạm cộng đồng rất đau." },
];

export const VIRUSES: Record<VirusId, VirusSpec> = Object.fromEntries(VIRUS_LIST.map((v) => [v.id, v])) as Record<
  VirusId,
  VirusSpec
>;

export interface Spawn {
  t: number;
  type: VirusId;
  lane: number;
}

export interface WaveDef {
  name: string;
  hint: string;
  lesson: boolean;
  fight: number;
  calm: number;
  spawns: Spawn[];
}

function pack(t: number, type: VirusId, lane: number, n: number, gap = 0.42): Spawn[] {
  return Array.from({ length: n }, (_, i) => ({ t: +(t + i * gap).toFixed(2), type, lane }));
}

function row(entries: Array<[number, VirusId, number]>): Spawn[] {
  return entries.map(([t, type, lane]) => ({ t, type, lane }));
}

export const WAVES: WaveDef[] = [
  {
    name: "Sóng 1 · Tin đồn",
    hint: "Một hàng giữa. Tường phía virus, phản biện đứng sau.",
    lesson: false,
    fight: 46,
    calm: 10,
    spawns: row([
      [3, "tin", 2],
      [9, "tin", 2],
      [15, "tin", 2],
      [22, "congkich", 2],
      [28, "tin", 2],
      [34, "tin", 2],
      [40, "congkich", 2],
    ]),
  },
  {
    name: "Sóng 2 · Vòng khép",
    hint: "Kiểm tra bài. Hai hàng bên cạnh sắp mở.",
    lesson: true,
    fight: 54,
    calm: 10,
    spawns: row([
      [2, "tin", 2],
      [8, "tin", 2],
      [14, "congkich", 2],
      [20, "tin", 1],
      [24, "tin", 3],
      [30, "tin", 2],
      [34, "congkich", 1],
      [38, "tin", 3],
      [44, "congkich", 2],
      [50, "tin", 1],
    ]),
  },
  {
    name: "Sóng 3 · Lửa lệch",
    hint: "Ba hàng giữa. Buồng vọng đi chậm nhưng máu dày.",
    lesson: false,
    fight: 58,
    calm: 9,
    spawns: [
      ...row([
        [2, "tin", 1],
        [6, "tin", 3],
        [10, "echo", 2],
        [16, "congkich", 1],
        [20, "tin", 3],
        [26, "congkich", 2],
        [32, "echo", 1],
        [40, "tin", 3],
        [46, "congkich", 2],
        [52, "echo", 3],
      ]),
      ...pack(28, "spam", 2, 3),
    ],
  },
  {
    name: "Sóng 4 · Năm ngón",
    hint: "Kiểm tra bài. Hàng ngoài bắt đầu có khách.",
    lesson: true,
    fight: 62,
    calm: 8,
    spawns: [
      ...row([
        [4, "tin", 2],
        [10, "echo", 2],
        [16, "tin", 1],
        [22, "congkich", 3],
        [28, "tin", 2],
        [34, "congkich", 1],
        [42, "echo", 3],
        [50, "tin", 2],
        [56, "congkich", 1],
      ]),
      ...pack(20, "spam", 2, 3),
    ],
  },
  {
    name: "Sóng 5 · Hai bờ",
    hint: "Đủ năm hàng. Kích động kéo cả hàng chạy nhanh.",
    lesson: false,
    fight: 66,
    calm: 8,
    spawns: [
      ...row([
        [4, "tin", 0],
        [8, "kichdong", 2],
        [14, "echo", 1],
        [20, "tin", 4],
        [26, "congkich", 3],
        [34, "echo", 1],
        [42, "congkich", 3],
        [50, "echo", 2],
        [58, "tin", 0],
      ]),
      ...pack(16, "spam", 2, 3),
      ...pack(36, "spam", 1, 3),
    ],
  },
  {
    name: "Sóng 6 · Tin không nguồn",
    hint: "Kiểm tra bài. Hàng trống sẽ đứt rất nhanh.",
    lesson: true,
    fight: 70,
    calm: 8,
    spawns: [
      ...row([
        [2, "kichdong", 1],
        [8, "echo", 0],
        [12, "echo", 4],
        [18, "congkich", 3],
        [26, "kichdong", 2],
        [34, "echo", 0],
        [42, "kichdong", 4],
        [50, "echo", 1],
        [58, "congkich", 3],
        [64, "kichdong", 0],
      ]),
      ...pack(6, "spam", 2, 5),
      ...pack(16, "spam", 4, 4),
      ...pack(28, "spam", 1, 4),
      ...pack(44, "spam", 3, 5),
      ...pack(56, "spam", 0, 4),
    ],
  },
  {
    name: "Sóng 7 · Kích động",
    hint: "Sóng dày. Tuyệt kỹ đúng lúc mới giữ được tường.",
    lesson: false,
    fight: 74,
    calm: 7,
    spawns: [
      ...row([
        [2, "kichdong", 2],
        [6, "echo", 0],
        [10, "echo", 4],
        [16, "kichdong", 1],
        [22, "congkich", 3],
        [30, "kichdong", 0],
        [36, "echo", 2],
        [44, "kichdong", 4],
        [52, "echo", 3],
        [60, "kichdong", 1],
        [68, "echo", 0],
      ]),
      ...pack(8, "spam", 3, 5),
      ...pack(18, "spam", 1, 5),
      ...pack(28, "spam", 4, 4),
      ...pack(40, "spam", 2, 5),
      ...pack(52, "spam", 0, 5),
      ...pack(62, "spam", 3, 4),
    ],
  },
  {
    name: "Sóng 8 · Đường ranh",
    hint: "Sóng cuối. Sai một nhịp là đoàn kết đứt.",
    lesson: true,
    fight: 86,
    calm: 0,
    spawns: [
      ...row([
        [2, "kichdong", 2],
        [6, "echo", 0],
        [10, "echo", 4],
        [14, "kichdong", 1],
        [20, "kichdong", 3],
        [28, "echo", 2],
        [34, "congkich", 0],
        [40, "kichdong", 4],
        [48, "echo", 1],
        [54, "kichdong", 0],
        [62, "echo", 3],
        [68, "kichdong", 2],
        [76, "kichdong", 4],
      ]),
      ...pack(4, "spam", 1, 5),
      ...pack(12, "spam", 3, 5),
      ...pack(22, "spam", 0, 5),
      ...pack(30, "spam", 4, 5),
      ...pack(38, "spam", 2, 5),
      ...pack(46, "spam", 1, 5),
      ...pack(56, "spam", 3, 5),
      ...pack(64, "spam", 0, 4),
      ...pack(72, "spam", 4, 5),
    ],
  },
];

export function waveScale(waveIndex: number) {
  const late = waveIndex >= 5 ? 1 + (waveIndex - 4) * 0.14 : 1;
  return {
    hp: (1 + waveIndex * 0.15) * late,
    speed: 1 + waveIndex * 0.038,
    dps: (1 + waveIndex * 0.09) * (waveIndex >= 6 ? 1.12 : 1),
  };
}
