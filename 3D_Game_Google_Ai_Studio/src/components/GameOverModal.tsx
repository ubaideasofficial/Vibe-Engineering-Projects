/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useGameStore } from '../lib/store';
import { 
  RotateCcw, 
  Home, 
  Trophy, 
  Zap, 
  Sparkles, 
  Flame, 
  Share2,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

export const GameOverModal: React.FC = () => {
  const lastRunStats = useGameStore((s) => s.lastRunStats);
  const highScores = useGameStore((s) => s.highScores);
  const totalOrbs = useGameStore((s) => s.totalOrbs);
  const startNewRun = useGameStore((s) => s.startNewRun);
  const setStatus = useGameStore((s) => s.setStatus);
  const openModal = useGameStore((s) => s.openModal);
  const addPopup = useGameStore((s) => s.addPopup);
  const [copied, setCopied] = React.useState(false);

  const isNewRecord = lastRunStats && lastRunStats.score >= (highScores[lastRunStats.mode] || 0) && lastRunStats.score > 0;

  useEffect(() => {
    if (isNewRecord) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#ff007f', '#ffe600', '#00ff88'],
        });
      } catch {
        // ignore
      }
    }
  }, [isNewRecord]);

  if (!lastRunStats) return null;

  const handleShare = () => {
    const text = `I just scored ${lastRunStats.score.toLocaleString()} PTS in Neon Hover Runner! Can you beat my distance of ${lastRunStats.distance}m? 🛹⚡`;
    if (navigator.share) {
      navigator.share({ title: 'Neon Hover Runner', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      addPopup('📋 Score copied to clipboard!', '#00ff88');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-[#0e122b] to-[#060814] border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-500/10 text-center relative overflow-hidden"
      >
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* Header / Record Tag */}
        {isNewRecord ? (
          <div className="inline-flex items-center gap-1.5 bg-yellow-950/80 border border-yellow-400 text-yellow-300 text-xs font-orbitron font-bold px-3.5 py-1.5 rounded-full mb-3 shadow-lg shadow-yellow-500/20 animate-pulse">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>NEW HIGH SCORE RECORD!</span>
          </div>
        ) : (
          <span className="text-xs font-orbitron font-bold tracking-widest text-slate-400 uppercase block mb-1">
            RUN TERMINATED
          </span>
        )}

        <h2 className="text-3xl md:text-4xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 mb-4">
          DEBRIEF LOG
        </h2>

        {/* Big Score Box */}
        <div className="bg-[#090b1c]/90 border border-cyan-500/30 rounded-2xl p-4 mb-5 shadow-inner">
          <span className="text-xs font-semibold uppercase text-cyan-400 font-orbitron block">
            Total Score
          </span>
          <span className="text-4xl md:text-5xl font-black font-orbitron text-white tracking-wider my-1 block">
            {lastRunStats.score.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 font-rajdhani">
            Mode: <strong className="uppercase text-cyan-300">{lastRunStats.mode}</strong>
          </span>
        </div>

        {/* 4-Stat Grid Breakdown */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 text-left">
          {/* Distance */}
          <div className="bg-[#0b0e24]/70 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-orbitron block">Distance</span>
            <span className="text-lg font-bold font-orbitron text-slate-100">{lastRunStats.distance}m</span>
          </div>

          {/* Orbs Collected */}
          <div className="bg-[#0b0e24]/70 border border-cyan-500/20 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-cyan-400 uppercase font-orbitron block">Orbs Banked</span>
              <span className="text-lg font-bold font-orbitron text-cyan-300">+{lastRunStats.orbsCollected}</span>
            </div>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>

          {/* Near-Misses */}
          <div className="bg-[#0b0e24]/70 border border-pink-500/20 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-pink-400 uppercase font-orbitron block">Near-Misses</span>
              <span className="text-lg font-bold font-orbitron text-pink-300">{lastRunStats.nearMissCount}</span>
            </div>
            <Zap className="w-5 h-5 text-pink-400" />
          </div>

          {/* Max Multiplier */}
          <div className="bg-[#0b0e24]/70 border border-yellow-500/20 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-yellow-400 uppercase font-orbitron block">Peak Multiplier</span>
              <span className="text-lg font-bold font-orbitron text-yellow-300">x{lastRunStats.maxMultiplier}</span>
            </div>
            <Flame className="w-5 h-5 text-yellow-400" />
          </div>
        </div>

        {/* Currency Total */}
        <div className="flex items-center justify-center gap-2 mb-6 text-sm font-rajdhani text-slate-300">
          <span>Wallet Balance:</span>
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400/30 border border-cyan-400 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
          </div>
          <strong className="text-cyan-300 font-orbitron">{totalOrbs} Orbs</strong>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            id="btn-gameover-play-again"
            type="button"
            onClick={() => {
              startNewRun(lastRunStats.mode);
            }}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-orbitron font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-500/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[3]" />
            <span>PLAY AGAIN</span>
          </button>

          <div className="grid grid-cols-3 gap-2 w-full">
            <button
              id="btn-gameover-garage"
              type="button"
              onClick={() => {
                setStatus('menu');
                openModal('garage');
              }}
              className="py-2.5 bg-[#0e1329] hover:bg-slate-800 border border-slate-700 text-slate-200 font-orbitron font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Garage</span>
            </button>

            <button
              id="btn-gameover-share"
              type="button"
              onClick={handleShare}
              className="py-2.5 bg-[#0e1329] hover:bg-slate-800 border border-slate-700 text-slate-200 font-orbitron font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-pink-400" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              id="btn-gameover-menu"
              type="button"
              onClick={() => setStatus('menu')}
              className="py-2.5 bg-[#0e1329] hover:bg-slate-800 border border-slate-700 text-slate-200 font-orbitron font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
            >
              <Home className="w-3.5 h-3.5 text-yellow-400" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
