"use client";

import { useGameStore } from "@/store/gameStore";

export function GameOverScreen() {
  const phase = useGameStore((s) => s.phase);
  const score = useGameStore((s) => s.score);
  const distance = useGameStore((s) => s.distance);
  const orbs = useGameStore((s) => s.orbs);
  const startGame = useGameStore((s) => s.startGame);
  const resetGame = useGameStore((s) => s.resetGame);

  if (phase !== "gameover") return null;

  return (
    <div className="pointer-events-auto flex h-full flex-col items-center justify-center bg-neon-dark/85 backdrop-blur-sm">
      <h2 className="font-display text-4xl font-black uppercase text-neon-magenta text-glow-magenta">
        Game Over
      </h2>

      <div className="mt-8 space-y-2 text-center font-body">
        <p className="text-white/50">Final Score</p>
        <p className="font-display text-5xl font-bold text-neon-cyan text-glow-cyan">
          {Math.floor(score).toLocaleString()}
        </p>
        <p className="text-white/60">
          {Math.floor(distance)}m · {orbs} orbs
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        <button type="button" className="btn-neon" onClick={startGame}>
          Run Again
        </button>
        <button
          type="button"
          className="btn-neon border-white/30 text-white/70 hover:bg-white/5"
          onClick={resetGame}
        >
          Main Menu
        </button>
      </div>
    </div>
  );
}
