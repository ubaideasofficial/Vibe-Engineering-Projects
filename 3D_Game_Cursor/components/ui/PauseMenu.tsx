"use client";

import { useGameStore } from "@/store/gameStore";

export function PauseMenu() {
  const phase = useGameStore((s) => s.phase);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const resetGame = useGameStore((s) => s.resetGame);

  if (phase !== "paused") return null;

  return (
    <div className="pointer-events-auto flex h-full flex-col items-center justify-center bg-neon-dark/80 backdrop-blur-sm">
      <h2 className="font-display text-3xl font-bold uppercase tracking-widest text-neon-cyan text-glow-cyan">
        Paused
      </h2>
      <div className="mt-8 flex flex-col gap-4">
        <button type="button" className="btn-neon" onClick={resumeGame}>
          Resume
        </button>
        <button
          type="button"
          className="btn-neon border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10"
          onClick={resetGame}
        >
          Quit to Menu
        </button>
      </div>
    </div>
  );
}
