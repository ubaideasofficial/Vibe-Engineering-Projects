/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from '../lib/store';
import { GameMode } from '../types';
import { 
  Play, 
  Calendar, 
  Zap, 
  Trophy, 
  ShoppingBag, 
  Target, 
  Settings, 
  Volume2, 
  VolumeX,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const MainMenu: React.FC = () => {
  const highScores = useGameStore((s) => s.highScores);
  const totalOrbs = useGameStore((s) => s.totalOrbs);
  const activeSkin = useGameStore((s) => s.getActiveSkin());
  const dailySeedDate = useGameStore((s) => s.dailySeedDate);
  const isDailyCompleted = useGameStore((s) => s.isDailyCompletedToday);
  const audioMuted = useGameStore((s) => s.settings.audioMuted);

  const startNewRun = useGameStore((s) => s.startNewRun);
  const openModal = useGameStore((s) => s.openModal);
  const toggleAudio = useGameStore((s) => s.toggleAudio);

  const [selectedMode, setSelectedMode] = React.useState<GameMode>('endless');

  const handleLaunchGame = (mode?: GameMode) => {
    const targetMode = mode || selectedMode;
    startNewRun(targetMode);
  };

  return (
    <div 
      id="main-menu-overlay"
      className="absolute inset-0 w-full h-full flex flex-col justify-between items-center p-3 sm:p-5 md:p-6 z-20 overflow-y-auto pointer-events-auto select-none cyber-scanlines"
    >
      {/* Top Bar: Active Deck, Balance & Sound */}
      <header className="w-full max-w-5xl flex items-center justify-between z-30 shrink-0">
        {/* Active Board Info */}
        <button
          id="btn-active-skin-badge"
          onClick={() => openModal('garage')}
          className="flex items-center gap-2 bg-[#0a0d20]/90 hover:bg-[#12173a] backdrop-blur-md border border-cyan-500/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md shadow-cyan-500/10"
        >
          <div 
            className="w-3.5 h-3.5 rounded-full ring-2 ring-cyan-400/50 animate-pulse" 
            style={{ backgroundColor: activeSkin.primaryColor, boxShadow: `0 0 10px ${activeSkin.primaryColor}` }}
          />
          <div className="flex flex-col items-start text-left">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-orbitron">Board</span>
            <span className="text-xs font-orbitron font-bold text-slate-200 leading-none">
              {activeSkin.name}
            </span>
          </div>
        </button>

        {/* Right side: Bank Orbs & Mute Button */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-currency-garage"
            onClick={() => openModal('garage')}
            className="flex items-center gap-2 bg-[#0a0d20]/90 hover:bg-cyan-950/70 border border-cyan-500/40 px-3.5 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/10"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
            </div>
            <span className="font-orbitron font-bold text-cyan-300 text-xs sm:text-sm">
              {totalOrbs} Orbs
            </span>
          </button>

          <button
            id="btn-toggle-sound"
            onClick={toggleAudio}
            className="p-2 bg-[#0a0d20]/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Toggle Audio"
          >
            {audioMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />}
          </button>
        </div>
      </header>

      {/* Hero Title Section */}
      <motion.section 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center my-auto py-1 z-30 shrink-0 max-w-2xl"
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="text-[11px] sm:text-xs font-orbitron tracking-[0.25em] uppercase text-cyan-400 font-bold">
            Project Cyberpunk 2088
          </span>
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-orbitron tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
          Neon Hover Runner
        </h1>

        <p className="text-slate-300 font-rajdhani text-xs sm:text-sm md:text-base max-w-lg mt-0.5 font-medium px-2">
          Dodge subway trains, hit supersonic near-misses, and race down the infinite neon highway.
        </p>

        {/* High Score Pill */}
        <div className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-cyan-950/90 to-purple-950/90 border border-cyan-500/50 px-3.5 py-1 rounded-full shadow-lg">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[10px] sm:text-xs font-orbitron uppercase text-slate-300 tracking-wider">
            Best Score:
          </span>
          <span className="text-xs sm:text-sm font-black font-orbitron text-yellow-400">
            {highScores.endless.toLocaleString()} PTS
          </span>
        </div>

        {/* PRIMARY HERO "PLAY NOW" BUTTON - UNMISSABLE */}
        <motion.button
          id="btn-hero-play-now"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleLaunchGame(selectedMode)}
          className="mt-4 group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:px-12 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-400 text-black font-orbitron font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wider shadow-[0_0_35px_rgba(0,240,255,0.6)] hover:shadow-[0_0_50px_rgba(255,0,128,0.8)] transition-all cursor-pointer active:scale-95"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black flex items-center justify-center text-cyan-300 shadow-inner group-hover:rotate-12 transition-transform">
            <Play className="w-5 h-5 fill-cyan-300 text-cyan-300 ml-0.5" />
          </div>
          <span className="drop-shadow-sm">START PLAYING</span>
          <ChevronRight className="w-6 h-6 text-black group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.section>

      {/* Mode Selection Cards */}
      <section className="w-full max-w-3xl flex flex-col items-center gap-2 my-1 z-30 shrink-0">
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-orbitron font-bold">
          Select Game Mode
        </span>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {/* Mode 1: Endless Highway */}
          <motion.button
            id="btn-start-endless"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedMode('endless');
              handleLaunchGame('endless');
            }}
            className={`group relative overflow-hidden bg-gradient-to-b from-[#0e132e]/95 to-[#070a1a]/95 border-2 p-3 sm:p-3.5 rounded-2xl text-left transition-all shadow-lg cursor-pointer active:scale-95 ${
              selectedMode === 'endless' 
                ? 'border-cyan-400 shadow-cyan-500/25 ring-2 ring-cyan-500/30' 
                : 'border-cyan-500/40 hover:border-cyan-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              </div>
              <span className="text-[9px] font-orbitron font-bold text-cyan-400 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                Classic
              </span>
            </div>
            <h2 className="font-orbitron font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
              Endless Run
            </h2>
            <p className="text-[10px] text-slate-400 font-rajdhani mt-0.5">
              Infinite track with progressive speed curve.
            </p>
            <div className="mt-2 flex items-center gap-1 text-cyan-400 text-[10px] font-orbitron font-bold group-hover:translate-x-1 transition-transform">
              <span>PLAY ENDLESS</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.button>

          {/* Mode 2: Daily Challenge */}
          <motion.button
            id="btn-start-daily"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedMode('daily');
              handleLaunchGame('daily');
            }}
            className={`group relative overflow-hidden bg-gradient-to-b from-[#1b0d2a]/95 to-[#0a0614]/95 border-2 p-3 sm:p-3.5 rounded-2xl text-left transition-all shadow-lg cursor-pointer active:scale-95 ${
              selectedMode === 'daily' 
                ? 'border-pink-400 shadow-pink-500/25 ring-2 ring-pink-500/30' 
                : 'border-pink-500/40 hover:border-pink-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300 group-hover:scale-110 transition-transform">
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
              </div>
              {isDailyCompleted ? (
                <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/50 font-orbitron font-bold">
                  DONE
                </span>
              ) : (
                <span className="text-[8px] bg-pink-950 text-pink-400 px-1.5 py-0.5 rounded border border-pink-500/50 font-orbitron font-bold">
                  DAILY SEED
                </span>
              )}
            </div>
            <h2 className="font-orbitron font-bold text-sm sm:text-base text-white group-hover:text-pink-300 transition-colors">
              Daily Challenge
            </h2>
            <p className="text-[10px] text-slate-400 font-rajdhani mt-0.5">
              Seeded track for {dailySeedDate}. Compete!
            </p>
            <div className="mt-2 flex items-center gap-1 text-pink-400 text-[10px] font-orbitron font-bold group-hover:translate-x-1 transition-transform">
              <span>PLAY DAILY</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.button>

          {/* Mode 3: Hyper Rush */}
          <motion.button
            id="btn-start-rush"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedMode('rush');
              handleLaunchGame('rush');
            }}
            className={`group relative overflow-hidden bg-gradient-to-b from-[#221808]/95 to-[#0c0903]/95 border-2 p-3 sm:p-3.5 rounded-2xl text-left transition-all shadow-lg cursor-pointer active:scale-95 ${
              selectedMode === 'rush' 
                ? 'border-yellow-400 shadow-yellow-500/25 ring-2 ring-yellow-500/30' 
                : 'border-yellow-500/40 hover:border-yellow-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 group-hover:scale-110 transition-transform">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
              </div>
              <span className="text-[8px] font-orbitron font-bold text-yellow-400 bg-yellow-950/80 px-1.5 py-0.5 rounded border border-yellow-500/40">
                2X ORBS
              </span>
            </div>
            <h2 className="font-orbitron font-bold text-sm sm:text-base text-white group-hover:text-yellow-300 transition-colors">
              Hyper Rush
            </h2>
            <p className="text-[10px] text-slate-400 font-rajdhani mt-0.5">
              Instant high speed, dense trains & 2x loot.
            </p>
            <div className="mt-2 flex items-center gap-1 text-yellow-400 text-[10px] font-orbitron font-bold group-hover:translate-x-1 transition-transform">
              <span>PLAY RUSH</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.button>
        </div>

        {/* Quick Controls Guide Banner */}
        <div className="w-full bg-[#080b1e]/80 border border-slate-700/60 rounded-xl py-1.5 px-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-slate-300 font-rajdhani font-semibold">
          <span className="text-cyan-400 font-bold">CONTROLS:</span>
          <span><strong className="text-white font-orbitron">A / D / ← / →</strong> Switch Lanes</span>
          <span><strong className="text-white font-orbitron">SPACE / W / ↑</strong> Jump</span>
          <span><strong className="text-white font-orbitron">S / ↓</strong> Slide</span>
          <span className="text-slate-400">or <strong>Swipe</strong> on Mobile</span>
        </div>
      </section>

      {/* Bottom Hub Navigation - Always Visible & Clickable */}
      <footer className="w-full max-w-lg flex items-center justify-between gap-1.5 sm:gap-2 bg-[#090c1f]/95 backdrop-blur-lg border border-slate-700/80 p-1.5 sm:p-2 rounded-2xl shadow-2xl shadow-cyan-500/10 z-30 shrink-0 mt-1 mb-1">
        <button
          id="btn-nav-garage"
          type="button"
          onClick={() => openModal('garage')}
          className="flex-1 flex flex-col items-center gap-1 py-2 sm:py-2.5 px-2 rounded-xl hover:bg-cyan-950/60 active:bg-cyan-900/80 text-slate-300 hover:text-cyan-300 active:scale-95 transition-all cursor-pointer group"
          aria-label="Open Garage"
        >
          <ShoppingBag className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] sm:text-xs font-orbitron font-bold tracking-wider">Garage</span>
        </button>

        <button
          id="btn-nav-missions"
          type="button"
          onClick={() => openModal('missions')}
          className="flex-1 flex flex-col items-center gap-1 py-2 sm:py-2.5 px-2 rounded-xl hover:bg-pink-950/60 active:bg-pink-900/80 text-slate-300 hover:text-pink-300 active:scale-95 transition-all cursor-pointer group"
          aria-label="Open Missions"
        >
          <Target className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] sm:text-xs font-orbitron font-bold tracking-wider">Missions</span>
        </button>

        <button
          id="btn-nav-rankings"
          type="button"
          onClick={() => openModal('leaderboard')}
          className="flex-1 flex flex-col items-center gap-1 py-2 sm:py-2.5 px-2 rounded-xl hover:bg-yellow-950/60 active:bg-yellow-900/80 text-slate-300 hover:text-yellow-300 active:scale-95 transition-all cursor-pointer group"
          aria-label="Open Rankings"
        >
          <Trophy className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] sm:text-xs font-orbitron font-bold tracking-wider">Rankings</span>
        </button>

        <button
          id="btn-nav-settings"
          type="button"
          onClick={() => openModal('settings')}
          className="flex-1 flex flex-col items-center gap-1 py-2 sm:py-2.5 px-2 rounded-xl hover:bg-slate-800 active:bg-slate-700 text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer group"
          aria-label="Open Settings"
        >
          <Settings className="w-5 h-5 text-slate-300 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] sm:text-xs font-orbitron font-bold tracking-wider">Settings</span>
        </button>
      </footer>
    </div>
  );
};

