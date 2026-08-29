"use client";

import { useGameStore } from "@/store/gameStore";

export function StartScreen() {
  const phase = useGameStore((s) => s.phase);
  const startGame = useGameStore((s) => s.startGame);

  if (phase !== "start") return null;

  return (
    <div className="pointer-events-auto flex h-full flex-col items-center justify-center bg-neon-dark/70 backdrop-blur-sm">
      <div className="text-center">
        <p className="mb-2 font-display text-sm uppercase tracking-[0.4em] text-neon-magenta">
          Cyberpunk Edition
        </p>
        <h1 className="font-display text-5xl font-black uppercase leading-tight text-white md:text-7xl">
          <span className="text-glow-cyan text-neon-cyan">Neon</span>
          <br />
          <span className="text-glow-magenta text-neon-magenta">Hover</span>
          <br />
          <span className="text-white/90">Runner</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md font-body text-lg text-white/60">
          Dodge obstacles, collect energy orbs, and survive the neon city.
        </p>
      </div>

      <button
        type="button"
        className="btn-neon mt-10"
        onClick={startGame}
      >
        Start Run
      </button>

      <div className="mt-8 font-body text-sm text-white/40">
        <p>A/D or ←/→ — Switch lanes</p>
        <p>Space — Jump · Shift — Slide</p>
      </div>
    </div>
  );
}
