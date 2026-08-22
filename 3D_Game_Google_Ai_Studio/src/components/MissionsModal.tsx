/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useGameStore } from '../lib/store';
import { 
  Target, 
  X, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Gift 
} from 'lucide-react';
import { motion } from 'motion/react';

export const MissionsModal: React.FC = () => {
  const [tab, setTab] = useState<'missions' | 'achievements'>('missions');
  const missions = useGameStore((s) => s.missions);
  const achievements = useGameStore((s) => s.achievements);
  const closeModal = useGameStore((s) => s.closeModal);
  const claimMissionReward = useGameStore((s) => s.claimMissionReward);
  const claimAchievementReward = useGameStore((s) => s.claimAchievementReward);

  return (
    <div 
      id="missions-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-xl bg-gradient-to-b from-[#0f1430] to-[#070919] border border-pink-500/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-pink-500/15 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/20 border border-pink-400/30 text-pink-300">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black font-orbitron text-white">
                MISSIONS & BOUNTIES
              </h2>
              <p className="text-xs text-slate-400 font-rajdhani">
                Complete objectives to earn Energy Orbs
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Missions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 my-4 p-1 bg-[#090b1c] rounded-xl border border-slate-800">
          <button
            onClick={() => setTab('missions')}
            className={`flex-1 py-2 rounded-lg font-orbitron font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'missions'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Active Bounties ({missions.length})</span>
          </button>

          <button
            onClick={() => setTab('achievements')}
            className={`flex-1 py-2 rounded-lg font-orbitron font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'achievements'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Career Milestones</span>
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {tab === 'missions' ? (
            missions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-rajdhani">
                All daily bounties completed! Check back tomorrow for more.
              </div>
            ) : (
              missions.map((mission) => {
                const progressPct = Math.min(100, Math.floor((mission.current / mission.target) * 100));

                return (
                  <div
                    key={mission.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      mission.completed
                        ? 'bg-pink-950/30 border-pink-500/60 shadow-md shadow-pink-500/10'
                        : 'bg-[#0b0e24]/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-orbitron font-bold text-sm text-white">
                          {mission.text}
                        </h4>
                        <span className="text-xs text-slate-400 font-rajdhani">
                          Progress: {mission.current} / {mission.target}
                        </span>
                      </div>

                      {/* Reward Badge / Claim Button */}
                      {mission.completed ? (
                        <button
                          onClick={() => claimMissionReward(mission.id)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-orbitron font-bold text-xs rounded-xl shadow-lg shadow-pink-500/25 flex items-center gap-1.5 cursor-pointer animate-pulse hover:scale-105 active:scale-95"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>CLAIM +{mission.reward}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-cyan-400 font-orbitron font-bold text-xs bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                          <Sparkles className="w-3 h-3" />
                          <span>+{mission.reward}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-300 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )
          ) : (
            achievements.map((ach) => {
              const progressPct = Math.min(100, Math.floor((ach.progress / ach.maxProgress) * 100));
              const canClaim = ach.unlocked && ach.rewardOrbs > 0;

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    ach.unlocked
                      ? 'bg-cyan-950/30 border-cyan-500/50'
                      : 'bg-[#0b0e24]/70 border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${ach.unlocked ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-orbitron font-bold text-sm text-white">
                          {ach.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-rajdhani">
                          {ach.description}
                        </p>
                      </div>
                    </div>

                    {canClaim ? (
                      <button
                        onClick={() => claimAchievementReward(ach.id)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-orbitron font-black text-xs rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 cursor-pointer animate-pulse hover:scale-105"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        <span>CLAIM +{ach.rewardOrbs}</span>
                      </button>
                    ) : ach.unlocked ? (
                      <div className="flex items-center gap-1 text-emerald-400 font-orbitron font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>UNLOCKED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-cyan-400 font-orbitron font-bold text-xs bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Sparkles className="w-3 h-3" />
                        <span>+{ach.rewardOrbs}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 rounded-full"
                      style={{ width: `${progressPct}%` }}
                    />
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
