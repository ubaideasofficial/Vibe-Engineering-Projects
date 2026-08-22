/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from '../lib/store';
import { 
  Play, 
  RotateCcw, 
  Home, 
  Settings, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { motion } from 'motion/react';

export const PauseModal: React.FC = () => {
  const resumeGame = useGameStore((s) => s.resumeGame);
  const startNewRun = useGameStore((s) => s.startNewRun);
  const setStatus = useGameStore((s) => s.setStatus);
  const openModal = useGameStore((s) => s.openModal);
  const audioMuted = useGameStore((s) => s.settings.audioMuted);
  const toggleAudio = useGameStore((s) => s.toggleAudio);
  const gameMode = useGameStore((s) => s.gameMode);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-sm bg-gradient-to-b from-[#0f1430] to-[#070919] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl shadow-cyan-500/15 text-center flex flex-col items-center"
      >
        <span className="text-xs font-orbitron font-bold tracking-widest text-cyan-400 uppercase mb-1">
          SYSTEM ON HOLD
        </span>
        <h2 className="text-3xl font-black font-orbitron text-white mb-6">
          GAME PAUSED
        </h2>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={resumeGame}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-orbitron font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>RESUME RUN</span>
          </button>

          <button
            onClick={() => startNewRun(gameMode)}
            className="w-full py-3 bg-[#0e1329] hover:bg-slate-800 border border-slate-700 text-slate-200 font-orbitron font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Restart Run</span>
          </button>

          <button
            onClick={() => openModal('settings')}
            className="w-full py-3 bg-[#0e1329] hover:bg-slate-800 border border-slate-700 text-slate-200 font-orbitron font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-pink-400" />
            <span>Settings</span>
          </button>

          <button
            onClick={toggleAudio}
            className="w-full py-3 bg-[#0e1329] hover:bg-slate-800 border border-slate-700 text-slate-200 font-orbitron font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {audioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span>{audioMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
          </button>

          <button
            onClick={() => setStatus('menu')}
            className="w-full py-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-orbitron font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <Home className="w-4 h-4" />
            <span>Exit to Main Menu</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
