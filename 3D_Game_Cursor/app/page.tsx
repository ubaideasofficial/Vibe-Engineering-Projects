"use client";

import dynamic from "next/dynamic";
import { StartScreen } from "@/components/ui/StartScreen";
import { HUD } from "@/components/ui/HUD";
import { GameOverScreen } from "@/components/ui/GameOverScreen";
import { PauseMenu } from "@/components/ui/PauseMenu";

const GameCanvas = dynamic(
  () => import("@/components/game/GameCanvas").then((m) => m.GameCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-neon-dark">
        <p className="font-display text-neon-cyan text-glow-cyan animate-pulse">
          Loading...
        </p>
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-neon-dark">
      <div className="absolute inset-0">
        <GameCanvas />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        <HUD />
        <StartScreen />
        <PauseMenu />
        <GameOverScreen />
      </div>
    </main>
  );
}
