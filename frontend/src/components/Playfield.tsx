import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { CELL, COLS, COMM, ROWS, ULTI_MAX, UNIT_LIST, UNITS, WAVES, type UnitId } from "../game/balance";
import { castUlti, cellAction, cycleSpeed, debugLose, debugRush, debugThreat, debugWin, pickAnswer, setSelection, togglePause } from "../game/engine";
import { formatClock } from "../game/score";
import type { GameState } from "../game/types";
import { CommunityPod } from "../art/community";
import { UnitArt } from "../art/units";
import { VirusArt } from "../art/viruses";

const BOARD_W = COMM + COLS * CELL;
const BOARD_H = ROWS * CELL;

function xOf(x: number) {
  return COMM + x * CELL;
}
function yOf(lane: number) {
  return lane * CELL + CELL / 2;
}

export function Playfield({ state, frame, bump }: { state: GameState; frame: number; bump: () => void }) {
  const [hover, setHover] = useState<{ lane: number; col: number } | null>(null);
  const shake = useAnimation();
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduce || state.shakeId === 0) return;
    void shake.start({
      x: [0, -11, 9, -6, 3, 0],
      y: [0, 4, -3, 2, 0],
      transition: { duration: 0.4 },
    });
  }, [state.shakeId, reduce, shake]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      const quiz = state.quiz;
      if (e.code === "Space" || e.code === "Escape") e.preventDefault();
      if (quiz && quiz.reveal <= 0) {
        const map: Record<string, number> = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, KeyA: 0, KeyB: 1, KeyC: 2, KeyD: 3 };
        if (map[e.code] !== undefined && map[e.code] < quiz.question.choices.length) {
          pickAnswer(state, map[e.code]);
          bump();
        }
        return;
      }
      if (e.repeat) return;
      if (e.code === "Space" || e.code === "Escape") {
        e.preventDefault();
        if (e.code === "Escape" && !state.manualPause && state.selection) {
          state.selection = null;
          bump();
          return;
        }
        togglePause(state);
        bump();
        return;
      }
      const unitKeys: Record<string, UnitId> = { Digit1: "den", Digit2: "tuong", Digit3: "phan", Digit4: "cau", Digit5: "moc" };
      if (unitKeys[e.code]) {
        setSelection(state, unitKeys[e.code]);
        bump();
      }
      if (e.code === "Digit0") {
        setSelection(state, "shovel");
        bump();
      }
      if (e.code === "KeyQ") castUlti(state, "sang");
      if (e.code === "KeyE") castUlti(state, "tuonglua");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, bump]);

  const wave = WAVES[state.waveIndex];
  const selected = state.selection && state.selection !== "shovel" ? UNITS[state.selection] : null;

  return (
    <div className="grid h-full place-items-center">
      <Fit>
        <motion.div
          animate={shake}
          data-frame={frame}
          className="relative flex h-[700px] w-[1100px] flex-col gap-2 p-3"
          style={state.glitch > 0 ? { boxShadow: "inset 0 0 0 6px #fb7185" } : undefined}
        >
          <header className="pointer-events-none relative z-50 flex items-center gap-3">
            <div className="rounded-2xl border border-amber-400/40 bg-slate-950/70 px-3 py-2 shadow-amber">
              <p className="text-[10px] uppercase tracking-wider text-amber-200/80">Mặt trời</p>
              <p className="text-2xl font-black text-amber-300">{Math.floor(state.sun)}</p>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">{wave ? wave.name : "Sóng"}</span>
                <span className="text-slate-400">{formatClock(state.clock)}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-amber-300"
                  style={{ width: `${wave ? Math.min(100, (state.phaseT / Math.max(1, wave.fight)) * 100) : 0}%` }}
                />
              </div>
            </div>
            <Streak state={state} />
            <div className="w-40">
              <p className="text-[10px] uppercase tracking-wider text-emerald-200/80">Đoàn kết {Math.ceil(state.solidarity)}</p>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full bg-emerald-400" style={{ width: `${Math.max(0, state.solidarity)}%` }} />
              </div>
            </div>
            <button
              type="button"
              aria-label={`Tua nhanh, đang ${state.timeScale}x`}
              title="Tua nhanh. Câu hỏi vẫn đếm theo giây thật."
              disabled={!!state.quiz}
              onClick={() => {
                cycleSpeed(state);
                bump();
              }}
              className={`pointer-events-auto relative z-50 rounded-full border px-3 py-2 text-sm font-black ${
                state.quiz || state.timeScale === 1
                  ? "border-slate-600 bg-slate-950 text-slate-200"
                  : state.timeScale === 2
                    ? "border-cyan-300 bg-cyan-400/15 text-cyan-100 shadow-neon"
                    : "border-amber-300 bg-amber-400/15 text-amber-100 shadow-amber"
              }`}
            >
              Tua {state.quiz ? 1 : state.timeScale}x
            </button>
            <button
              type="button"
              aria-pressed={state.manualPause}
              onClick={() => {
                togglePause(state);
                bump();
              }}
              className="pointer-events-auto relative z-50 rounded-full border border-slate-600 bg-slate-950 px-3 py-2 text-sm font-semibold"
            >
              {state.manualPause ? "Tiếp tục" : "Tạm dừng"}
            </button>
          </header>

          <div className="relative mx-auto" style={{ width: BOARD_W, height: BOARD_H }}>
            <div className="absolute inset-y-0 left-0" style={{ width: COMM }}>
              <p className="absolute left-2 top-1 text-[10px] font-bold uppercase tracking-wider text-cyan-200/80">Cộng đồng</p>
              {state.bonds.map((bonds, lane) => (
                <div key={lane} className="absolute" style={{ left: 4, top: lane * CELL + 8, width: COMM - 8, height: CELL - 12 }}>
                  <div className={reduce ? "" : "bob"} style={{ animationDelay: `${lane * 0.15}s`, height: "100%" }}>
                    <CommunityPod bonds={bonds} uid={`lane-${lane}`} />
                  </div>
                </div>
              ))}
            </div>
            {Array.from({ length: ROWS }, (_, lane) =>
              Array.from({ length: COLS }, (_, col) => {
                const hot = hover?.lane === lane && hover?.col === col;
                return (
                  <button
                    key={`${lane}-${col}`}
                    type="button"
                    aria-label={`Ô hàng ${lane + 1} cột ${col + 1}`}
                    onMouseEnter={() => setHover({ lane, col })}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => {
                      cellAction(state, lane, col);
                      bump();
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      state.selection = "shovel";
                      cellAction(state, lane, col);
                      bump();
                    }}
                    className={`absolute border border-cyan-400/10 ${hot ? "bg-cyan-400/10" : "bg-slate-900/30"}`}
                    style={{ left: COMM + col * CELL, top: lane * CELL, width: CELL - 2, height: CELL - 2 }}
                  />
                );
              }),
            )}
            {state.units
              .filter((u) => u.type === "cau")
              .map((cau) =>
                state.units
                  .filter(
                    (u) =>
                      u.id !== cau.id &&
                      u.hp > 0 &&
                      Math.max(Math.abs(u.lane - cau.lane), Math.abs(u.col - cau.col)) <= 1,
                  )
                  .map((u) => (
                    <svg key={`${cau.id}-${u.id}`} className="pointer-events-none absolute inset-0 h-full w-full">
                      <line
                        x1={xOf(cau.col + 0.5)}
                        y1={yOf(cau.lane)}
                        x2={xOf(u.col + 0.5)}
                        y2={yOf(u.lane)}
                        stroke="#67e8f9"
                        strokeWidth="2"
                        strokeOpacity="0.55"
                      />
                    </svg>
                  )),
              )}
            {hover && state.selection && state.selection !== "shovel" && !state.units.some((u) => u.lane === hover.lane && u.col === hover.col) && (
              <div className="pointer-events-none absolute opacity-50" style={spriteStyle(hover.col + 0.5, hover.lane)}>
                <UnitArt type={state.selection} uid="ghost" />
              </div>
            )}
            {state.units.map((u) => (
              <div key={u.id} className="pointer-events-none absolute" style={spriteStyle(u.col + 0.5, u.lane, u.recoil > 0 ? -8 : 0)}>
                <div className={reduce ? "" : "bob"} style={{ animationDelay: `${u.col * 0.1}s` }}>
                  <div style={{ filter: u.flash > 0 ? "brightness(2.4)" : undefined }}>
                    <UnitArt type={u.type} uid={`u${u.id}`} />
                  </div>
                </div>
                <Bar pct={u.hp / u.maxHp} />
              </div>
            ))}
            {state.shots.map((shot) => (
              <div key={shot.id} className="pointer-events-none absolute" style={{ left: xOf(shot.x) - (shot.glow ? 52 : 36), top: yOf(shot.lane) - 4 }}>
                <div className={`shot-trail ${shot.glow ? "glow w-14" : "w-10"}`} />
              </div>
            ))}
            {state.viruses.map((v) => {
              const scale = v.dead ? Math.max(0, v.dying / 0.46) : 1;
              return (
                <div
                  key={v.id}
                  className="pointer-events-none absolute"
                  style={{ ...spriteStyle(v.x, v.lane), opacity: scale, transform: `translate(-50%, -50%) scale(${scale})` }}
                >
                  <div className={reduce || v.dead ? "" : "virus-bob"} style={{ animationDelay: `${v.bob}s`, filter: v.flash > 0 ? "brightness(2.6)" : undefined }}>
                    <VirusArt type={v.type} uid={`v${v.id}`} />
                  </div>
                  {!v.dead && <Bar pct={v.hp / v.maxHp} bad />}
                </div>
              );
            })}
            {state.particles.map((p) => (
              <span
                key={p.id}
                className="pointer-events-none absolute rounded-full"
                style={{
                  left: xOf(p.x) + p.ox,
                  top: yOf(p.lane) + p.oy,
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  boxShadow: `0 0 8px ${p.color}`,
                  opacity: Math.max(0, p.life / p.max),
                }}
              />
            ))}
            {state.floaters.map((f) => (
              <span key={f.id} className="floater pointer-events-none absolute text-sm font-black" style={{ left: xOf(f.x), top: yOf(f.lane) - 20, color: f.color }}>
                {f.text}
              </span>
            ))}
            {state.glitch > 0 && (
              <div
                className="glitch-overlay pointer-events-none absolute inset-0 z-20 overflow-hidden"
                style={{ background: "rgba(136, 19, 55, 0.28)", border: "3px solid #fb7185" }}
              >
                <span className="absolute left-3 top-3 text-sm font-black text-rose-100">NHIỄU THÔNG TIN /// TIN SAI /// ỒN</span>
              </div>
            )}
            {state.fever > 0 && (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-xl"
                animate={{ opacity: [0.25, 0.55, 0.25] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ boxShadow: "inset 0 0 40px rgba(251,191,36,0.35), inset 0 0 80px rgba(34,211,238,0.18)" }}
              />
            )}
            <AnimatePresence>
              {state.popups.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ y: 12, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 rounded-2xl px-4 py-2 text-center font-black ${
                    p.kind === "good" ? "bg-amber-300 text-slate-950" : "bg-rose-500 text-white"
                  }`}
                >
                  <div>{p.text}</div>
                  <div className="text-xs font-bold">{p.sub}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="min-h-7 text-center text-sm text-slate-300">
            {state.glitch > 0 ? (
              <span className="font-black text-rose-200">Nhiễu thông tin — đặt đơn vị dễ trượt · {state.glitch.toFixed(1)}s</span>
            ) : state.toast ? (
              <span className="text-rose-200">{state.toast.title}. {state.toast.text}</span>
            ) : state.banner ? (
              <span>{state.banner.title} — {state.banner.text}</span>
            ) : selected ? (
              <span>{selected.name} — {selected.blurb}</span>
            ) : (
              <span>Chọn đơn vị. Phím 1–5, 0 để thu hồi, Q/E tuyệt kỹ.</span>
            )}
          </div>

          <div className="flex items-stretch gap-2">
            {UNIT_LIST.map((unit, index) => {
              const on = state.selection === unit.id;
              const poor = state.sun < unit.cost;
              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => {
                    setSelection(state, unit.id);
                    bump();
                  }}
                  className={`flex w-[128px] flex-col items-center rounded-2xl border px-2 py-1 text-left ${
                    on ? "border-amber-300 shadow-amber" : "border-slate-700"
                  } ${poor ? "opacity-50" : ""} bg-slate-950/80`}
                >
                  <div className="h-12 w-12">
                    <UnitArt type={unit.id} uid={`tray-${unit.id}`} />
                  </div>
                  <span className="text-[11px] font-bold leading-tight">{index + 1}. {unit.name}</span>
                  <span className="text-xs font-black text-amber-300">{unit.cost}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setSelection(state, "shovel");
                bump();
              }}
              className={`w-24 rounded-2xl border text-sm font-bold ${state.selection === "shovel" ? "border-rose-300 text-rose-200" : "border-slate-700"}`}
            >
              Thu hồi
            </button>
            <div className="ml-auto flex w-[280px] flex-col justify-center gap-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full bg-cyan-300" style={{ width: `${(state.ulti / ULTI_MAX) * 100}%` }} />
              </div>
              <div className="flex gap-1">
                <UltiButton
                  ready={state.ulti >= ULTI_MAX && !state.quiz}
                  label="Chiếu sáng sự thật"
                  hint="Q"
                  onClick={() => {
                    castUlti(state, "sang");
                    bump();
                  }}
                />
                <UltiButton
                  ready={state.ulti >= ULTI_MAX && !state.quiz}
                  label="Tường lửa đoàn kết"
                  hint="E"
                  onClick={() => {
                    castUlti(state, "tuonglua");
                    bump();
                  }}
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {state.quiz && (
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                className="absolute bottom-28 left-1/2 z-40 w-[min(680px,92%)] -translate-x-1/2 rounded-2xl border border-cyan-500/40 bg-slate-900/80 p-4 shadow-neon backdrop-blur-md"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    {state.quiz.kind === "ulti" ? (state.quiz.ulti === "sang" ? "Chiếu sáng sự thật" : "Tường lửa đoàn kết") : state.quiz.kind === "clutch" ? "Cứu nguy khẩn cấp" : "Kiểm tra bài"}
                  </p>
                  <p className="font-mono text-sm text-amber-200">{Math.max(0, state.quiz.time).toFixed(1)}s</p>
                </div>
                <div className="mb-2 h-1 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-cyan-300" style={{ width: `${(state.quiz.time / state.quiz.budget) * 100}%` }} />
                </div>
                <p className="text-sm font-semibold leading-snug">{state.quiz.question.q}</p>
                <div className="mt-2 grid gap-1.5">
                  {state.quiz.question.choices.map((choice, i) => {
                    const reveal = state.quiz!.reveal > 0;
                    const correct = i === state.quiz!.question.answer;
                    const picked = state.quiz!.picked === i;
                    let tone = "border-slate-600 hover:border-cyan-300";
                    if (reveal && correct) tone = "border-emerald-300 bg-emerald-400/15";
                    else if (reveal && picked) tone = "border-rose-400 bg-rose-400/10";
                    return (
                      <button
                        key={choice}
                        type="button"
                        disabled={reveal}
                        onClick={() => {
                          pickAnswer(state, i);
                          bump();
                        }}
                        className={`rounded-xl border px-3 py-1.5 text-left text-sm ${tone}`}
                      >
                        <span className="mr-2 font-black text-cyan-200">{i + 1}</span>
                        {choice}
                      </button>
                    );
                  })}
                </div>
                {state.quiz.reveal > 0 && <p className="mt-2 text-xs text-slate-300">{state.quiz.question.explain}</p>}
                <p className="mt-1 text-[10px] text-slate-500">{state.quiz.question.source}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {state.manualPause && !state.quiz && (
            <button
              type="button"
              aria-label="Tiếp tục"
              onClick={() => {
                togglePause(state);
                bump();
              }}
              className="absolute inset-0 z-30 grid place-items-center bg-slate-950/55"
            >
              <span className="pointer-events-none rounded-2xl border border-cyan-400/50 bg-slate-900 px-8 py-4 text-center shadow-neon">
                <span className="block text-lg font-bold">Tạm dừng</span>
                <span className="mt-1 block text-sm font-semibold text-cyan-200">Tiếp tục</span>
                <span className="mt-1 block text-[11px] font-medium text-slate-400">Bấm lớp phủ, Tiếp tục, phím cách hoặc Esc</span>
              </span>
            </button>
          )}

          {state.thu && (
            <div className="absolute right-3 top-3 flex gap-1 text-[10px]">
              <Mini onClick={() => { debugRush(state); bump(); }} label="Virus" />
              <Mini onClick={() => { debugThreat(state); bump(); }} label="Cứu nguy" />
              <Mini onClick={() => { debugWin(state); bump(); }} label="Thắng" />
              <Mini onClick={() => { debugLose(state); bump(); }} label="Thua" />
            </div>
          )}
        </motion.div>
      </Fit>
    </div>
  );
}

function spriteStyle(x: number, lane: number, recoil = 0): CSSProperties {
  return {
    left: xOf(x) + recoil,
    top: yOf(lane),
    width: 74,
    height: 74,
    transform: "translate(-50%, -58%)",
  };
}

function Bar({ pct, bad }: { pct: number; bad?: boolean }) {
  return (
    <div className="mx-auto h-1 w-10 overflow-hidden rounded-full bg-slate-800">
      <div className={bad ? "h-full bg-rose-400" : "h-full bg-emerald-300"} style={{ width: `${Math.max(0, Math.min(1, pct)) * 100}%` }} />
    </div>
  );
}

function Streak({ state }: { state: GameState }) {
  return (
    <div className="w-36">
      <p className="text-[10px] uppercase tracking-wider text-slate-400">Chuỗi</p>
      <div className="mt-1 flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-2 flex-1 rounded-full ${state.streak > i ? "bg-amber-300 shadow-amber" : "bg-slate-700"}`} />
        ))}
      </div>
      {state.fever > 0 && <p className="fever-label text-[11px] font-black">Ánh chung bừng sáng</p>}
    </div>
  );
}

function UltiButton({ ready, label, hint, onClick }: { ready: boolean; label: string; hint: string; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={!ready}
      onClick={onClick}
      className={`flex-1 rounded-xl border px-2 py-1 text-left text-[11px] font-bold leading-tight ${
        ready ? "border-cyan-300 text-cyan-100 shadow-neon" : "border-slate-700 text-slate-500"
      }`}
    >
      {label}
      <span className="mt-0.5 block text-[10px] font-semibold text-slate-400">{hint}</span>
    </button>
  );
}

function Mini({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded border border-slate-600 bg-slate-900 px-1 py-0.5">
      {label}
    </button>
  );
}

function Fit({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.max(0.42, Math.min(window.innerWidth / 1100, window.innerHeight / 700, 1.2)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return (
    <div style={{ width: 1100 * scale, height: 700 * scale }}>
      <div style={{ width: 1100, height: 700, transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div>
    </div>
  );
}
