"use client";

import { useGameStore } from "@/store/gameStore";

export function HUD() {
  const phase = useGameStore((s) => s.phase);
  const score = useGameStore((s) => s.score);
  const distance = useGameStore((s) => s.distance);
  const orbs = useGameStore((s) => s.orbs);
  const multiplier = useGameStore((s) => s.multiplier);
  const speed = useGameStore((s) => s.speed);
  const pauseGame = useGameStore((s) => s.pauseGame);

  if (phase !== "playing" && phase !== "paused") return null;

  return (
    <div className="pointer-events-auto p-4 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 font-body">
          <div className="flex gap-6 text-sm md:text-base">
            <Stat label="Score" value={Math.floor(score).toLocaleString()} accent="cyan" />
            <Stat label="Distance" value={`${Math.floor(distance)}m`} accent="magenta" />
            <Stat label="Orbs" value={orbs.toString()} accent="cyan" />
            <Stat label="×" value={multiplier.toFixed(1)} accent="magenta" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-white/40">Speed</span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10 md:w-32">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all duration-300"
                style={{ width: `${((speed - 12) / (28 - 12)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={pauseGame}
          className="rounded border border-white/20 px-3 py-1 font-display text-xs uppercase tracking-widest text-white/70 transition hover:border-neon-cyan hover:text-neon-cyan"
        >
          Pause
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "cyan" | "magenta";
}) {
  const color = accent === "cyan" ? "text-neon-cyan" : "text-neon-magenta";
  return (
    <div>
      <span className="text-xs uppercase tracking-widest text-white/40">{label}</span>
      <p className={`font-display text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
