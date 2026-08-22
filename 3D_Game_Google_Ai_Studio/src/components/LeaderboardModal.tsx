/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useGameStore } from '../lib/store';
import { GameMode } from '../types';
import { 
  Trophy, 
  X, 
  Medal, 
  Crown, 
  Calendar, 
  Play, 
  Zap 
} from 'lucide-react';
import { motion } from 'motion/react';

export const LeaderboardModal: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('endless');
  const leaderboard = useGameStore((s) => s.leaderboard);
  const closeModal = useGameStore((s) => s.closeModal);

  const filteredEntries = leaderboard
    .filter((e) => e.mode === selectedMode)
    .sort((a, b) => b.score - a.score);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-400 flex items-center justify-center text-yellow-300">
            <Crown className="w-4 h-4" />
          </div>
        );
      case 2:
        return (
          <div className="w-7 h-7 rounded-full bg-slate-300/20 border border-slate-300 flex items-center justify-center text-slate-200">
            <Medal className="w-4 h-4" />
          </div>
        );
      case 3:
        return (
          <div className="w-7 h-7 rounded-full bg-amber-700/20 border border-amber-500 flex items-center justify-center text-amber-400">
            <Medal className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <span className="w-7 text-center font-orbitron font-bold text-slate-500 text-sm">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div 
      id="leaderboard-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-xl bg-gradient-to-b from-[#0f1430] to-[#070919] border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-500/15 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-400/30 text-yellow-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black font-orbitron text-white">
                GRID LEADERBOARDS
              </h2>
              <p className="text-xs text-slate-400 font-rajdhani">
                Top pilots on the neon highway network
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Leaderboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-2 my-4 p-1 bg-[#090b1c] rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedMode('endless')}
            className={`flex-1 py-2 rounded-lg font-orbitron font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedMode === 'endless'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Endless</span>
          </button>

          <button
            onClick={() => setSelectedMode('daily')}
            className={`flex-1 py-2 rounded-lg font-orbitron font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedMode === 'daily'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily</span>
          </button>

          <button
            onClick={() => setSelectedMode('rush')}
            className={`flex-1 py-2 rounded-lg font-orbitron font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedMode === 'rush'
                ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Rush</span>
          </button>
        </div>

        {/* Scores Table */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-rajdhani">
              No flight records logged for this mode yet. Be the first!
            </div>
          ) : (
            filteredEntries.map((entry, index) => {
              const rank = index + 1;
              const isPlayer = entry.playerName.includes('YOU');

              return (
                <div
                  key={entry.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    isPlayer
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-sm'
                      : 'bg-[#0b0e24]/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getRankBadge(rank)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-orbitron font-bold text-sm ${isPlayer ? 'text-cyan-300' : 'text-slate-200'}`}>
                          {entry.playerName}
                        </span>
                        {isPlayer && (
                          <span className="text-[9px] bg-cyan-900 border border-cyan-400 text-cyan-300 px-1.5 py-0.2 rounded font-orbitron">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-rajdhani">
                        {entry.distance}m • {entry.orbs} Orbs • {entry.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-orbitron font-black text-base text-white tracking-wider">
                      {entry.score.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-orbitron">PTS</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};
