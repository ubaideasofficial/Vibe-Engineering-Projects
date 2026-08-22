/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from '../lib/store';
import { 
  Settings, 
  X, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Vibrate, 
  Keyboard, 
  Info 
} from 'lucide-react';
import { motion } from 'motion/react';

export const SettingsModal: React.FC = () => {
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const closeModal = useGameStore((s) => s.closeModal);

  return (
    <div 
      id="settings-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-lg bg-gradient-to-b from-[#0f1430] to-[#070919] border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-500/15 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-cyan-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black font-orbitron text-white">
                SETTINGS & SYSTEM
              </h2>
              <p className="text-xs text-slate-400 font-rajdhani">
                Configure audio synthesis, visuals & input modes
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Audio Mute Switch */}
          <div className="p-3.5 bg-[#0b0e24]/70 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                {settings.audioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-orbitron font-bold text-sm text-white block">Master Audio</span>
                <span className="text-xs text-slate-400 font-rajdhani">Procedural synthwave BGM & interactive SFX</span>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ audioMuted: !settings.audioMuted })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.audioMuted ? 'bg-slate-800' : 'bg-cyan-500'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                  settings.audioMuted ? 'left-1' : 'left-7'
                }`}
              />
            </button>
          </div>

          {/* Music Volume Slider */}
          <div className="p-3.5 bg-[#0b0e24]/70 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs font-orbitron">
              <span className="text-slate-300">Synthwave Music Volume</span>
              <span className="text-cyan-400 font-bold">{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => updateSettings({ musicVolume: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* SFX Volume Slider */}
          <div className="p-3.5 bg-[#0b0e24]/70 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs font-orbitron">
              <span className="text-slate-300">Sound Effects (SFX) Volume</span>
              <span className="text-pink-400 font-bold">{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => updateSettings({ sfxVolume: parseFloat(e.target.value) })}
              className="w-full accent-pink-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* On-Screen Touch Buttons */}
          <div className="p-3.5 bg-[#0b0e24]/70 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="font-orbitron font-bold text-sm text-white block">Touch / Mobile HUD D-Pad</span>
                <span className="text-xs text-slate-400 font-rajdhani">Show directional touch buttons overlay</span>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ showTouchControls: !settings.showTouchControls })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                !settings.showTouchControls ? 'bg-slate-800' : 'bg-yellow-500'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                  !settings.showTouchControls ? 'left-1' : 'left-7'
                }`}
              />
            </button>
          </div>

          {/* Screen Shake Toggle */}
          <div className="p-3.5 bg-[#0b0e24]/70 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                <Vibrate className="w-5 h-5" />
              </div>
              <div>
                <span className="font-orbitron font-bold text-sm text-white block">Near-Miss Screen Vibration</span>
                <span className="text-xs text-slate-400 font-rajdhani">Camera shake on close dodges and hits</span>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ screenShakeEnabled: !settings.screenShakeEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                !settings.screenShakeEnabled ? 'bg-slate-800' : 'bg-pink-500'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                  !settings.screenShakeEnabled ? 'left-1' : 'left-7'
                }`}
              />
            </button>
          </div>

          {/* Quick Guide Card */}
          <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl">
            <div className="flex items-center gap-2 text-cyan-400 font-orbitron font-bold text-xs mb-2">
              <Keyboard className="w-4 h-4" />
              <span>PILOT CONTROLS CHEAT SHEET</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-rajdhani text-slate-300">
              <div>• <strong className="text-cyan-300">A / Left Arrow</strong>: Switch Lane Left</div>
              <div>• <strong className="text-cyan-300">D / Right Arrow</strong>: Switch Lane Right</div>
              <div>• <strong className="text-pink-300">W / Space / Up</strong>: Jump over Lasers</div>
              <div>• <strong className="text-yellow-300">S / Shift / Down</strong>: Crouch Slide</div>
              <div>• <strong className="text-slate-300">Swipe Screen</strong>: Full gesture support</div>
              <div>• <strong className="text-emerald-300">Near-Miss</strong>: Boosts Multiplier</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
