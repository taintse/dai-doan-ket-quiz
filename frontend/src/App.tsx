import { useCallback, useEffect, useRef, useState } from "react";
import { createGame, step } from "./game/engine";
import { pushFromGame } from "./game/liveboard";
import { summarize, type Summary } from "./game/score";
import type { GameState } from "./game/types";
import { ProjectorBoard } from "./components/LiveBoard";
import { Playfield } from "./components/Playfield";
import { Results, StartScreen } from "./components/Screens";

type Phase = "menu" | "play" | "end";

export function App() {
  const sim = useRef<GameState | null>(null);
  const liveSig = useRef({ answered: -1, status: "" });
  const [phase, setPhase] = useState<Phase>("menu");
  const [frame, setFrame] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [projector, setProjector] = useState(() => window.location.hash === "#bang");
  const thu = new URLSearchParams(window.location.search).has("thu");

  useEffect(() => {
    const sync = () => setProjector(window.location.hash === "#bang");
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (phase !== "play") return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const state = sim.current;
      if (state && state.status === "playing") step(state, dt);
      if (state && state.status !== "playing") {
        void pushFromGame(state, true);
        setSummary(summarize(state));
        setPhase("end");
        return;
      }
      if (state && state.status === "playing") {
        const answered = state.stats.correct + state.stats.wrong;
        const force = answered !== liveSig.current.answered || state.status !== liveSig.current.status;
        liveSig.current = { answered, status: state.status };
        void pushFromGame(state, force);
      }
      setFrame((n) => (n + 1) % 1000000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const bump = useCallback(() => setFrame((n) => n + 1), []);

  function start(name: string) {
    sim.current = createGame(name, Date.now(), { thu });
    liveSig.current = { answered: -1, status: "" };
    setSummary(null);
    setPhase("play");
  }

  return (
    <div className="stage-bg h-screen w-screen overflow-hidden text-slate-100">
      {projector && <ProjectorBoard onBack={() => { window.location.hash = ""; }} />}
      {!projector && phase === "menu" && <StartScreen onStart={start} />}
      {!projector && phase === "play" && sim.current && <Playfield state={sim.current} frame={frame} bump={bump} />}
      {!projector && phase === "end" && summary && <Results summary={summary} onAgain={() => setPhase("menu")} />}
    </div>
  );
}
