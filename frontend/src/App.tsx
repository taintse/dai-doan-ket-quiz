import { useCallback, useEffect, useRef, useState } from "react";
import { createGame, step } from "./game/engine";
import { summarize, type Summary } from "./game/score";
import type { GameState } from "./game/types";
import { Playfield } from "./components/Playfield";
import { Results, StartScreen } from "./components/Screens";

type Phase = "menu" | "play" | "end";

export function App() {
  const sim = useRef<GameState | null>(null);
  const [phase, setPhase] = useState<Phase>("menu");
  const [frame, setFrame] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);
  const thu = new URLSearchParams(window.location.search).has("thu");

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
        setSummary(summarize(state));
        setPhase("end");
        return;
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
    setSummary(null);
    setPhase("play");
  }

  return (
    <div className="stage-bg h-screen w-screen overflow-hidden text-slate-100">
      {phase === "menu" && <StartScreen onStart={start} />}
      {phase === "play" && sim.current && <Playfield state={sim.current} frame={frame} bump={bump} />}
      {phase === "end" && summary && <Results summary={summary} onAgain={() => setPhase("menu")} />}
    </div>
  );
}
