"use client";

import { useEffect } from "react";
import GameCanvas from "./game/GameCanvas";
import { useGameStore } from "@/lib/store";

export default function GameShell() {
  const status = useGameStore((state) => state.status);
  const score = useGameStore((state) => state.score);
  const distance = useGameStore((state) => state.distance);
  const orbs = useGameStore((state) => state.orbs);
  const multiplier = useGameStore((state) => state.multiplier);
  const speed = useGameStore((state) => state.speed);
  const start = useGameStore((state) => state.start);
  const restart = useGameStore((state) => state.restart);
  const pause = useGameStore((state) => state.pause);
  const resume = useGameStore((state) => state.resume);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") status === "playing" ? pause() : resume(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pause, resume, status]);

  return <main className="game-shell">
    <GameCanvas />
    <div className="hud">
      <div className="brand"><span className="brand-mark">NR</span><span>NEON<br /><b>HOVER RUNNER</b></span></div>
      <div className="stat-strip"><div><small>SCORE</small><strong>{Math.floor(score).toLocaleString()}</strong></div><div><small>DISTANCE</small><strong>{Math.floor(distance)}m</strong></div><div><small>ORBS</small><strong>{orbs.toString().padStart(2, "0")}</strong></div><div><small>MULTIPLIER</small><strong className="cyan">x{multiplier.toFixed(1)}</strong></div></div>
      <button className="pause-button" onClick={() => status === "playing" ? pause() : resume()} aria-label="Pause or resume">{status === "playing" ? "II" : "▶"}</button>
    </div>
    <div className="speed-readout"><span>SPEED</span><b>{Math.round(speed * 7.2)} KM/H</b><i><em style={{ width: `${Math.min(100, speed / 43 * 100)}%` }} /></i></div>
    {status === "ready" && <section className="overlay intro"><p className="eyebrow">CITY CIRCUIT // 07</p><h1>RUN THE<br /><span>NEON LINE</span></h1><p className="subcopy">Dodge the grid. Chase the signal.<br />How far can you ride?</p><button className="primary" onClick={start}>START RUN <span>→</span></button><p className="controls">← → CHANGE LANES &nbsp;·&nbsp; ↑ JUMP &nbsp;·&nbsp; ↓ SLIDE</p></section>}
    {status === "paused" && <section className="overlay centered"><p className="eyebrow">SYSTEM PAUSED</p><h2>Take a breath.</h2><button className="primary" onClick={resume}>RESUME RUN <span>→</span></button></section>}
    {status === "gameOver" && <section className="overlay centered"><p className="eyebrow">SIGNAL LOST</p><h2>RUN ENDED</h2><div className="final-score">{Math.floor(score).toLocaleString()} <small>POINTS</small></div><button className="primary" onClick={restart}>RUN IT BACK <span>↻</span></button></section>}
  </main>;
}
