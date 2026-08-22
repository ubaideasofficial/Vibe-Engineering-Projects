"use client";

import React, { useState, useEffect } from "react";
import { useGameStore } from "@/lib/store/useGameStore";
import { RotateCcw, Home, Trophy, Send, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export function GameOverModal() {
  const gameState = useGameStore((s) => s.gameState);
  const gameMode = useGameStore((s) => s.gameMode);
  const score = useGameStore((s) => s.score);
  const highScore = useGameStore((s) => s.highScore);
  const distance = useGameStore((s) => s.distance);
  const orbs = useGameStore((s) => s.orbsCollected);
  const multiplier = useGameStore((s) => s.multiplier);
  const startGame = useGameStore((s) => s.startGame);
  const resetToMenu = useGameStore((s) => s.resetToMenu);

  const [runnerName, setRunnerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rank, setRank] = useState<number | null>(null);

  const isNewHighScore = score > 0 && score >= highScore;

  useEffect(() => {
    if (gameState === "GAMEOVER") {
      setSubmitted(false);
      setRank(null);

      if (isNewHighScore) {
        // Trigger celebratory confetti burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00f0ff", "#ff007f", "#ffe600", "#00ff66"],
        });
      }
    }
  }, [gameState, isNewHighScore]);

  if (gameState !== "GAMEOVER") return null;

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!runnerName.trim() || submitting || submitted) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: runnerName.trim(),
          score,
          distance,
          mode: gameMode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setRank(data.rank);
      }
    } catch (err) {
      console.error("Score submit error", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-mono animate-in fade-in zoom-in-95 duration-200">
      <div className="max-w-md w-full bg-[#090d22]/90 border border-cyan-500/40 rounded-3xl p-6 shadow-neon-cyan flex flex-col items-center text-center gap-5">
        {/* Header */}
        <div>
          <span className="text-xs uppercase tracking-widest text-pink-500 font-bold">
            MISSION TERMINATED
          </span>
          <h2 className="text-3xl font-black text-white tracking-wider drop-shadow-[0_0_15px_rgba(255,0,127,0.8)]">
            SYSTEM CRASH
          </h2>
        </div>

        {/* Score & New Highscore Banner */}
        <div className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
          {isNewHighScore && (
            <div className="flex items-center gap-1.5 px-3 py-0.5 mb-2 rounded-full bg-gradient-to-r from-yellow-500 to-pink-500 text-black font-black text-xs shadow-neon-yellow animate-bounce">
              <Trophy className="w-3.5 h-3.5 fill-black" />
              <span>NEW ALL-TIME RECORD!</span>
            </div>
          )}
          <span className="text-xs text-gray-400">FINAL SCORE</span>
          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 w-full text-center">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-[10px] text-gray-400 block">DISTANCE</span>
            <span className="text-sm font-bold text-white">{Math.floor(distance)}m</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-[10px] text-gray-400 block">ORBS</span>
            <span className="text-sm font-bold text-cyan-300">{orbs}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-[10px] text-gray-400 block">MAX MULT</span>
            <span className="text-sm font-bold text-pink-400">{multiplier}x</span>
          </div>
        </div>

        {/* Leaderboard Submission Form */}
        <div className="w-full bg-white/5 rounded-xl p-3 border border-white/10">
          {!submitted ? (
            <form onSubmit={handleSubmitScore} className="flex gap-2">
              <input
                type="text"
                placeholder="ENTER RUNNER CODENAME"
                maxLength={12}
                value={runnerName}
                onChange={(e) => setRunnerName(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-white text-xs font-bold uppercase placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!runnerName.trim() || submitting}
                className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-neon-magenta active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? "..." : "SUBMIT"}</span>
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-400 text-xs font-bold py-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>RECORD SAVED! {rank ? `GLOBAL RANK #${rank}` : ""}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={() => startGame(gameMode)}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-black font-extrabold text-sm tracking-wider shadow-neon-cyan transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4 stroke-[3]" />
            <span>RUN AGAIN</span>
          </button>

          <button
            onClick={resetToMenu}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white font-bold text-sm tracking-wider transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
}
