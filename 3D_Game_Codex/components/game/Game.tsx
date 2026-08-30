"use client";

import { useCallback, useState } from "react";
import { GameCanvas, type GameStats } from "./GameCanvas";

type Status = "ready" | "playing" | "gameover";
const emptyStats: GameStats = { score: 0, distance: 0, orbs: 0, multiplier: 1, speed: 1 };

export function Game() {
  const [status, setStatus] = useState<Status>("ready");
  const [stats, setStats] = useState<GameStats>(emptyStats);
  const [run, setRun] = useState(0);
  const start = useCallback(() => { setStats(emptyStats); setRun((n) => n + 1); setStatus("playing"); }, []);

  return <section className="game-shell">
    <GameCanvas key={run} active={status === "playing"} onStats={setStats} onGameOver={() => setStatus("gameover")} />
    <header className="brand"><span>NEON</span> HOVER RUNNER</header>
    {status === "playing" && <Hud stats={stats} />}
    {status !== "playing" && <div className="menu-card">
      <p className="eyebrow">{status === "ready" ? "READY FOR A NIGHT RUN?" : "RUN COMPLETE"}</p>
      <h1>{status === "ready" ? "Ride the glow." : `${stats.score.toLocaleString()} points`}</h1>
      <p>{status === "ready" ? "Dodge, jump, slide, and collect energy orbs." : `${Math.floor(stats.distance)}m travelled · ${stats.orbs} orbs collected`}</p>
      <button onClick={start}>{status === "ready" ? "START RUN" : "RUN AGAIN"}</button>
      <small>A / D or ← / → to move · Space to jump · Shift to slide</small>
    </div>}
    <div className="touch-hint">Swipe left, right, up, or down on mobile</div>
  </section>;
}

function Hud({ stats }: { stats: GameStats }) {
  return <div className="hud">
    <div><label>SCORE</label><strong>{stats.score.toLocaleString()}</strong></div>
    <div><label>DISTANCE</label><strong>{Math.floor(stats.distance)}m</strong></div>
    <div><label>ORBS</label><strong>{stats.orbs}</strong></div>
    <div><label>MULTIPLIER</label><strong>×{stats.multiplier}</strong></div>
    <div className="speed"><label>VELOCITY</label><strong>{stats.speed.toFixed(1)}x</strong></div>
  </div>;
}
