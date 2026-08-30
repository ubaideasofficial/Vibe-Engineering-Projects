"use client";

import React from "react";
import { useGameStore } from "@/lib/store/useGameStore";
import { Play, Calendar, Trophy, Zap, Keyboard, Smartphone } from "lucide-react";

interface MainMenuProps {
  onOpenLeaderboard: () => void;
}

export function MainMenu({ onOpenLeaderboard }: MainMenuProps) {
  const gameState = useGameStore((s) => s.gameState);
  const highScore = useGameStore((s) => s.highScore);
  const dailyHighScore = useGameStore((s) => s.dailyHighScore);
  const startGame = useGameStore((s) => s.startGame);

  if (gameState !== "MENU") return null;

  const todayStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-black/80 via-[#050714]/85 to-black/95 backdrop-blur-sm select-none font-mono">
      <div className="max-w-md w-full flex flex-col items-center text-center gap-6">
        {/* Antigravity Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs tracking-widest uppercase shadow-neon-cyan">
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Antigravity Engine</span>
        </div>

        {/* Title Header */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(0,240,255,0.75)]">
            NEON HOVER
          </h1>
          <h2 className="text-3xl sm:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 drop-shadow-[0_0_20px_rgba(255,0,127,0.7)]">
            RUNNER
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 tracking-wider pt-2">
            Infinite 3D Cyberpunk Hoverboard Experience
          </p>
        </div>

        {/* High Scores summary pill */}
        <div className="grid grid-cols-2 gap-3 w-full bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-400 tracking-wider">ALL-TIME BEST</span>
            <span className="text-lg font-black text-cyan-300">
              {highScore.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center border-l border-white/10">
            <span className="text-[10px] text-gray-400 tracking-wider">DAILY BEST</span>
            <span className="text-lg font-black text-pink-400">
              {dailyHighScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          {/* Endless Mode Button */}
          <button
            onClick={() => startGame("ENDLESS")}
            className="group relative flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-lg tracking-wider transition-all duration-200 shadow-neon-cyan active:scale-95"
          >
            <Play className="w-6 h-6 fill-black transition-transform group-hover:scale-110" />
            <span>LAUNCH ENDLESS RUN</span>
          </button>

          {/* Daily Challenge Button */}
          <button
            onClick={() => startGame("DAILY")}
            className="group flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-black/60 border border-pink-500/60 hover:border-pink-400 text-pink-300 hover:text-white font-bold text-sm tracking-wider transition-all shadow-neon-magenta hover:bg-pink-950/40 active:scale-95"
          >
            <Calendar className="w-5 h-5 text-pink-400" />
            <span>DAILY SEED ({todayStr})</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 text-gray-300 hover:text-white font-bold text-xs tracking-wider transition-all hover:bg-white/10 active:scale-95"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>GLOBAL HALL OF FAME</span>
          </button>
        </div>

        {/* Controls Instructions Card */}
        <div className="w-full text-left bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-gray-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Keyboard className="w-3.5 h-3.5" />
            <span>CONTROLS:</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            <div><strong className="text-white">A / D / ← →</strong> : Switch Lanes</div>
            <div><strong className="text-white">SPACE / ↑</strong> : Jump</div>
            <div><strong className="text-white">SHIFT / ↓</strong> : Slide</div>
            <div className="flex items-center gap-1 text-gray-300">
              <Smartphone className="w-3 h-3 text-pink-400" /> Swipe gestures on Mobile
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
