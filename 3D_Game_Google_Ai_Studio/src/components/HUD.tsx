/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from '../lib/store';
import { 
  Pause, 
  Zap, 
  Shield, 
  Magnet, 
  Flame, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { POWERUP_DURATIONS } from '../lib/constants';

interface HUDProps {
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onJump?: () => void;
  onSlide?: () => void;
}

export const HUD: React.FC<HUDProps> = () => {
  const currentScore = useGameStore((s) => Math.floor(s.currentScore));
  const currentDistance = useGameStore((s) => Math.floor(s.currentDistance));
  const currentOrbs = useGameStore((s) => s.currentOrbs);
  const currentMultiplier = useGameStore((s) => s.currentMultiplier);
  const currentSpeed = useGameStore((s) => Math.floor(s.currentSpeed * 3.6)); // m/s to km/h
  const activePowerUps = useGameStore((s) => s.activePowerUps);
  const floatingPopups = useGameStore((s) => s.floatingPopups);
  const showTouchControls = useGameStore((s) => s.settings.showTouchControls);
  const pauseGame = useGameStore((s) => s.pauseGame);

  // Power-up icon helper
  const getPowerUpIcon = (type: string) => {
    switch (type) {
      case 'shield':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'magnet':
        return <Magnet className="w-4 h-4 text-cyan-400" />;
      case 'boost':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'multiplier2x':
        return <Sparkles className="w-4 h-4 text-pink-400" />;
      default:
        return <Flame className="w-4 h-4 text-white" />;
    }
  };

  const getPowerUpColor = (type: string) => {
    switch (type) {
      case 'shield': return 'from-emerald-500 to-teal-400';
      case 'magnet': return 'from-cyan-500 to-blue-400';
      case 'boost': return 'from-amber-400 to-yellow-300';
      case 'multiplier2x': return 'from-pink-500 to-rose-400';
      default: return 'from-purple-500 to-indigo-400';
    }
  };

  return (
    <div id="game-hud-overlay" className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 select-none z-10">
      {/* Top Header Bar */}
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex items-center justify-between gap-3">
          {/* Left: Score & Multiplier */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-[#0b0e24]/90 backdrop-blur-md border border-cyan-500/40 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg shadow-cyan-500/10">
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-cyan-400 uppercase font-orbitron block">
                Score
              </span>
              <span className="text-xl sm:text-2xl md:text-3xl font-black font-orbitron text-white tracking-wider">
                {currentScore.toLocaleString()}
              </span>
            </div>

            {/* Multiplier Badge */}
            <div className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl backdrop-blur-md border transition-all flex items-center gap-1.5 ${
              currentMultiplier > 1 
                ? 'bg-pink-950/90 border-pink-500 text-pink-300 shadow-lg shadow-pink-500/25 animate-pulse' 
                : 'bg-[#0b0e24]/80 border-slate-700/60 text-slate-400'
            }`}>
              <Flame className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${currentMultiplier > 1 ? 'text-pink-400 fill-pink-400' : 'text-slate-500'}`} />
              <span className="font-orbitron font-black text-sm sm:text-lg">
                x{currentMultiplier}
              </span>
            </div>
          </div>

          {/* Top Center: Compact Popup Banner (Non-blocking Top Placement) */}
          <div className="flex-1 max-w-xs flex justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              {floatingPopups.length > 0 && (
                <motion.div
                  key={floatingPopups[floatingPopups.length - 1].id}
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-black/90 px-3 sm:px-4 py-1 rounded-full border border-current shadow-lg shadow-cyan-500/20 font-orbitron font-black text-xs sm:text-sm tracking-wider whitespace-nowrap"
                  style={{ 
                    color: floatingPopups[floatingPopups.length - 1].color, 
                    borderColor: floatingPopups[floatingPopups.length - 1].color 
                  }}
                >
                  {floatingPopups[floatingPopups.length - 1].text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Distance, Orbs & Pause Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Distance */}
            <div className="bg-[#0b0e24]/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-right">
              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase font-orbitron block">
                Distance
              </span>
              <span className="text-sm sm:text-lg md:text-xl font-bold font-orbitron text-slate-100">
                {currentDistance}m
              </span>
            </div>

            {/* Energy Orbs Counter */}
            <div className="bg-[#0b0e24]/90 backdrop-blur-md border border-cyan-500/30 rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center animate-pulse">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-300" />
              </div>
              <span className="text-sm sm:text-lg md:text-xl font-bold font-orbitron text-cyan-300">
                {currentOrbs}
              </span>
            </div>

            {/* Pause Button */}
            <button
              id="hud-pause-btn"
              onClick={pauseGame}
              className="pointer-events-auto p-2 sm:p-2.5 bg-[#0b0e24]/90 hover:bg-cyan-950/80 border border-cyan-500/40 hover:border-cyan-400 rounded-xl text-cyan-300 transition-all hover:scale-105 active:scale-95 shadow-md shadow-cyan-500/10 cursor-pointer"
              aria-label="Pause Game"
            >
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Active Power-up Horizontal Mini Badges (Positioned cleanly under top bar) */}
        {activePowerUps.length > 0 && (
          <div className="w-full flex items-center justify-center gap-2 pointer-events-none">
            {activePowerUps.map((powerUp) => {
              const maxDur = POWERUP_DURATIONS[powerUp.type] || 10;
              const progressPercent = Math.max(0, Math.min(100, (powerUp.timeLeft / maxDur) * 100));

              return (
                <div
                  key={powerUp.type}
                  className="bg-[#070918]/90 backdrop-blur-md border border-slate-700/80 rounded-full px-2.5 py-1 flex items-center gap-2 shadow-md shadow-cyan-500/10"
                >
                  <div className="p-0.5 rounded-full bg-slate-800">
                    {getPowerUpIcon(powerUp.type)}
                  </div>
                  <span className="text-[10px] font-orbitron font-bold uppercase text-slate-200">
                    {powerUp.type}: {powerUp.timeLeft.toFixed(1)}s
                  </span>
                  <div className="w-10 sm:w-14 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getPowerUpColor(powerUp.type)} transition-all duration-100 rounded-full`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Center of Screen is 100% UNCLUTTERED for crystal-clear track vision */}
      <div className="flex-1" />

      {/* Bottom Controls Bar */}
      <div className="w-full flex items-end justify-between">
        {/* Speedometer Gauge */}
        <div className="bg-[#0b0e24]/80 backdrop-blur-md border border-slate-700/60 rounded-xl px-3.5 py-2 flex items-center gap-2.5">
          <Gauge className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="text-[10px] text-slate-400 block font-orbitron uppercase">Speed</span>
            <span className="text-base font-bold font-orbitron text-cyan-300">{currentSpeed} km/h</span>
          </div>
        </div>

        {/* Optional On-Screen Touch Buttons (Mobile / Touch friendly) */}
        {showTouchControls && (
          <div className="pointer-events-auto flex items-center gap-2 md:gap-3 bg-black/40 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
            <button
              onClick={() => {
                const e = new KeyboardEvent('keydown', { code: 'KeyA' });
                window.dispatchEvent(e);
              }}
              className="w-12 h-12 rounded-xl bg-slate-900/80 active:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
              aria-label="Move Left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  const e = new KeyboardEvent('keydown', { code: 'Space' });
                  window.dispatchEvent(e);
                }}
                className="w-12 h-12 rounded-xl bg-slate-900/80 active:bg-pink-500/30 border border-pink-500/40 text-pink-300 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                aria-label="Jump"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const e = new KeyboardEvent('keydown', { code: 'KeyS' });
                  window.dispatchEvent(e);
                }}
                className="w-12 h-12 rounded-xl bg-slate-900/80 active:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                aria-label="Slide"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => {
                const e = new KeyboardEvent('keydown', { code: 'KeyD' });
                window.dispatchEvent(e);
              }}
              className="w-12 h-12 rounded-xl bg-slate-900/80 active:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
              aria-label="Move Right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Controls Keyboard Hint */}
        <div className="hidden lg:flex items-center gap-3 bg-[#0b0e24]/80 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-2 text-[12px] text-slate-300 font-rajdhani">
          <span><strong className="text-cyan-400 font-orbitron">A / D</strong> Lanes</span>
          <span>•</span>
          <span><strong className="text-pink-400 font-orbitron">SPACE</strong> Jump</span>
          <span>•</span>
          <span><strong className="text-yellow-400 font-orbitron">SHIFT / S</strong> Slide</span>
        </div>
      </div>
    </div>
  );
};
