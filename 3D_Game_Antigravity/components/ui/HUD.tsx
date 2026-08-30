"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/lib/store/useGameStore";
import { Pause, Play, Volume2, VolumeX, Shield, Magnet, Zap } from "lucide-react";
import { soundManager } from "@/lib/audio/soundManager";

export function HUD() {
  const gameState = useGameStore((s) => s.gameState);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);

  const [isMuted, setIsMuted] = useState(false);

  // High-frequency UI elements updated directly via RAF to avoid 60fps React DOM thrashing
  const scoreRef = useRef<HTMLSpanElement>(null);
  const distanceRef = useRef<HTMLSpanElement>(null);
  const orbsRef = useRef<HTMLSpanElement>(null);
  const multiplierRef = useRef<HTMLSpanElement>(null);
  const speedTextRef = useRef<HTMLSpanElement>(null);
  const speedBarRef = useRef<HTMLDivElement>(null);
  const powerupContainerRef = useRef<HTMLDivElement>(null);

  const [hasShield, setHasShield] = useState(false);
  const [hasMagnet, setHasMagnet] = useState(false);
  const [hasBoost, setHasBoost] = useState(false);
  const [magnetTime, setMagnetTime] = useState("0");
  const [boostTime, setBoostTime] = useState("0");
  const [currentMultiplier, setCurrentMultiplier] = useState(1);

  useEffect(() => {
    let animId: number;
    let lastUiUpdate = 0;

    const updateUI = (timestamp: number) => {
      // Throttle React state updates to 15fps for powerups/multipliers, but direct DOM for numbers
      const store = useGameStore.getState();

      if (store.gameState === "PLAYING") {
        if (scoreRef.current) {
          scoreRef.current.textContent = store.score.toLocaleString();
        }
        if (distanceRef.current) {
          distanceRef.current.textContent = `${Math.floor(store.distance)}m`;
        }
        if (orbsRef.current) {
          orbsRef.current.textContent = store.orbsCollected.toString();
        }
        if (speedTextRef.current) {
          speedTextRef.current.textContent = `${Math.round(store.speed * 3.6)} KM/H`;
        }
        if (speedBarRef.current) {
          const pct = Math.min(100, Math.max(10, ((store.speed - 20) / 45) * 100));
          speedBarRef.current.style.width = `${pct}%`;
        }

        // Low frequency powerup & multiplier checks (every 100ms)
        if (timestamp - lastUiUpdate > 100) {
          lastUiUpdate = timestamp;
          setHasShield(store.powerups.shield);
          setHasMagnet(store.powerups.magnet);
          setHasBoost(store.powerups.boost);
          setMagnetTime(store.powerups.magnetTime.toFixed(1));
          setBoostTime(store.powerups.boostTime.toFixed(1));
          setCurrentMultiplier(store.multiplier);
        }
      }

      animId = requestAnimationFrame(updateUI);
    };

    animId = requestAnimationFrame(updateUI);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (gameState !== "PLAYING" && gameState !== "PAUSED") return null;

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 md:p-6 select-none font-mono">
      {/* Top Header Row */}
      <div className="flex items-start justify-between">
        {/* Score & Multiplier */}
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">SCORE</span>
            <span
              ref={scoreRef}
              className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]"
            >
              0
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentMultiplier > 1 && (
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs shadow-neon-magenta animate-pulse">
                {currentMultiplier}X MULTIPLIER
              </span>
            )}
            <span ref={distanceRef} className="text-xs text-gray-400 tracking-wider">
              0m
            </span>
          </div>
        </div>

        {/* Top Right Controls & Orbs */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Orbs Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-cyan-500/40 backdrop-blur-md shadow-neon-cyan">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-pulse" />
            <span ref={orbsRef} className="text-cyan-300 font-bold text-sm">
              0
            </span>
          </div>

          {/* Audio Button */}
          <button
            onClick={handleToggleMute}
            aria-label="Toggle Sound"
            className="p-2.5 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-400/60 text-white hover:text-cyan-300 transition-all backdrop-blur-md active:scale-95"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-pink-500" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Pause Button */}
          <button
            onClick={() => (gameState === "PLAYING" ? pauseGame() : resumeGame())}
            aria-label="Pause Game"
            className="p-2.5 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-400/60 text-white hover:text-cyan-300 transition-all backdrop-blur-md active:scale-95"
          >
            {gameState === "PLAYING" ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 text-green-400" />}
          </button>
        </div>
      </div>

      {/* Active Powerups Status Bars */}
      <div className="flex flex-col gap-2 max-w-xs">
        {hasShield && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 border border-cyan-400/60 backdrop-blur-md shadow-neon-cyan animate-pulse">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide">SHIELD ACTIVE</span>
          </div>
        )}

        {hasMagnet && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 border border-pink-500/60 backdrop-blur-md shadow-neon-magenta">
            <Magnet className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold text-pink-300 uppercase tracking-wide">
              MAGNET ({magnetTime}s)
            </span>
          </div>
        )}

        {hasBoost && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 border border-yellow-400/70 backdrop-blur-md shadow-neon-yellow animate-bounce">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-300 uppercase tracking-wide">
              SUPER BOOST ({boostTime}s)
            </span>
          </div>
        )}
      </div>

      {/* Bottom Speed & Velocity Bar */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1 w-48">
          <div className="flex justify-between text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
            <span>VELOCITY</span>
            <span ref={speedTextRef}>0 KM/H</span>
          </div>
          <div className="w-full h-1.5 bg-black/70 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              ref={speedBarRef}
              className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 transition-all duration-75"
              style={{ width: "20%" }}
            />
          </div>
        </div>

        {/* Pause Overlay */}
        {gameState === "PAUSED" && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto gap-4">
            <h2 className="text-4xl font-black text-white tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
              SYSTEM PAUSED
            </h2>
            <p className="text-sm text-gray-400">Take a breath, Cyber Runner.</p>
            <button
              onClick={resumeGame}
              className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold tracking-wider transition-all shadow-neon-cyan active:scale-95"
            >
              RESUME MISSION
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
