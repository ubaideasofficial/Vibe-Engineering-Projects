"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useGameStore } from "@/lib/store/useGameStore";
import { HUD } from "@/components/ui/HUD";
import { MainMenu } from "@/components/ui/MainMenu";
import { GameOverModal } from "@/components/ui/GameOverModal";
import { LeaderboardModal } from "@/components/ui/LeaderboardModal";
import { MobileControls } from "@/components/ui/MobileControls";

// Dynamic import of 3D Canvas to disable SSR for WebGL context
const GameCanvas = dynamic(
  () => import("@/components/game/GameCanvas").then((mod) => mod.GameCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#050714] text-cyan-400 font-mono gap-3">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin shadow-neon-cyan" />
        <span className="text-sm font-bold tracking-widest animate-pulse">
          INITIALIZING CYBER ENGINE...
        </span>
      </div>
    ),
  }
);

export default function Home() {
  const gameState = useGameStore((s) => s.gameState);
  const moveLeft = useGameStore((s) => s.moveLeft);
  const moveRight = useGameStore((s) => s.moveRight);
  const jump = useGameStore((s) => s.jump);
  const slide = useGameStore((s) => s.slide);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);

  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Global Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling on arrow keys and space
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        moveLeft();
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        moveRight();
      } else if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        jump();
      } else if (
        e.code === "ShiftLeft" ||
        e.code === "ShiftRight" ||
        e.code === "ArrowDown" ||
        e.code === "KeyS"
      ) {
        slide();
      } else if (e.code === "KeyP" || e.code === "Escape") {
        if (gameState === "PLAYING") pauseGame();
        else if (gameState === "PAUSED") resumeGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, moveLeft, moveRight, jump, slide, pauseGame, resumeGame]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050714] scanlines">
      {/* 3D WebGL Canvas Layer */}
      <GameCanvas />

      {/* Heads-up Display */}
      <HUD />

      {/* Main Menu Screen */}
      <MainMenu onOpenLeaderboard={() => setShowLeaderboard(true)} />

      {/* Game Over Screen */}
      <GameOverModal />

      {/* Hall of Fame / Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />

      {/* Mobile Swipe & Touch Controls */}
      <MobileControls />
    </main>
  );
}
