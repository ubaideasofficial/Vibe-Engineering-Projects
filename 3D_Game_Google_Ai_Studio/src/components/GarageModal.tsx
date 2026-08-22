/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from '../lib/store';
import { 
  X, 
  Check, 
  Lock, 
  ShoppingBag, 
  Sparkles, 
  Zap 
} from 'lucide-react';
import { motion } from 'motion/react';

export const GarageModal: React.FC = () => {
  const totalOrbs = useGameStore((s) => s.totalOrbs);
  const skins = useGameStore((s) => s.skins);
  const activeSkinId = useGameStore((s) => s.activeSkinId);
  const closeModal = useGameStore((s) => s.closeModal);
  const equipSkin = useGameStore((s) => s.equipSkin);
  const unlockSkin = useGameStore((s) => s.unlockSkin);

  return (
    <div 
      id="garage-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-2xl bg-gradient-to-b from-[#0f1430] to-[#070919] border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-500/15 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black font-orbitron text-white">
                HOVERBOARD GARAGE
              </h2>
              <p className="text-xs text-slate-400 font-rajdhani">
                Customize your street deck and plasma exhaust trails
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Wallet */}
            <div className="flex items-center gap-1.5 bg-[#090c21] border border-cyan-500/30 px-3.5 py-1.5 rounded-xl">
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-400/30 border border-cyan-400 flex items-center justify-center animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
              </div>
              <span className="text-sm font-bold font-orbitron text-cyan-300">
                {totalOrbs} Orbs
              </span>
            </div>

            <button
              onClick={closeModal}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Garage"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Skins Grid */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {skins.map((skin) => {
            const isEquipped = activeSkinId === skin.id;
            const canAfford = totalOrbs >= skin.price;

            return (
              <div
                key={skin.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isEquipped
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : skin.unlocked
                    ? 'bg-[#0b0e24]/70 border-slate-700/60 hover:border-slate-500'
                    : 'bg-[#080a1a]/60 border-slate-800 opacity-90'
                }`}
              >
                {/* Board Color Visualizer & Info */}
                <div className="flex items-center gap-4">
                  {/* Color Sample Pill */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg relative overflow-hidden"
                    style={{
                      backgroundColor: skin.secondaryColor,
                      borderColor: skin.primaryColor,
                      boxShadow: `0 0 15px ${skin.glowColor}40`,
                    }}
                  >
                    <div
                      className="w-8 h-2 rounded-full transform -rotate-45"
                      style={{ backgroundColor: skin.primaryColor }}
                    />
                    <div
                      className="absolute bottom-1 w-2 h-2 rounded-full animate-ping"
                      style={{ backgroundColor: skin.trailColor }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-orbitron font-bold text-base text-white">
                        {skin.name}
                      </h3>
                      {isEquipped && (
                        <span className="text-[10px] bg-cyan-900/80 border border-cyan-400 text-cyan-300 font-orbitron font-bold px-2 py-0.5 rounded">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-rajdhani mt-0.5 max-w-sm">
                      {skin.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] font-rajdhani text-slate-300">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: skin.primaryColor }} />
                        Chassis
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: skin.trailColor }} />
                        Plasma Trail
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions (Equip / Unlock) */}
                <div className="w-full sm:w-auto flex items-center justify-end">
                  {skin.unlocked ? (
                    <button
                      onClick={() => equipSkin(skin.id)}
                      disabled={isEquipped}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isEquipped
                          ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                          : 'bg-slate-800 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-cyan-300'
                      }`}
                    >
                      {isEquipped ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>EQUIPPED</span>
                        </>
                      ) : (
                        <span>EQUIP</span>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => unlockSkin(skin.id)}
                      disabled={!canAfford}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-lg shadow-yellow-500/25 hover:scale-105 active:scale-95'
                          : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{skin.price} ORBS</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
