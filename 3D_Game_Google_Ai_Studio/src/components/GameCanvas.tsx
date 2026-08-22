/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../lib/store';
import { GameEngine } from '../game/GameEngine';

interface GameCanvasProps {
  onShake?: (intensity: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ onShake }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const status = useGameStore((s) => s.status);
  const gameMode = useGameStore((s) => s.gameMode);
  const activeSkin = useGameStore((s) => s.getActiveSkin());
  const currentSeed = useGameStore((s) => s.currentSeed);
  const activePowerUps = useGameStore((s) => s.activePowerUps);
  const screenShakeEnabled = useGameStore((s) => s.settings.screenShakeEnabled);

  // Store action callbacks
  const updateRunProgress = useGameStore((s) => s.updateRunProgress);
  const collectOrb = useGameStore((s) => s.collectOrb);
  const triggerNearMiss = useGameStore((s) => s.triggerNearMiss);
  const applyPowerUp = useGameStore((s) => s.applyPowerUp);
  const endRun = useGameStore((s) => s.endRun);
  const consumeShield = useGameStore((s) => s.consumeShield);
  const tickPowerUps = useGameStore((s) => s.tickPowerUps);

  // Touch Swipe tracking
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // 1. Initialize Engine on Mount
  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new GameEngine(
      containerRef.current,
      {
        onScoreUpdate: (deltaDist, speed) => {
          updateRunProgress(deltaDist, speed);
          tickPowerUps(deltaDist / Math.max(20, speed));
        },
        onOrbCollect: () => collectOrb(1),
        onNearMiss: () => triggerNearMiss(),
        onPowerUpPickup: (type, duration) => applyPowerUp(type, duration),
        onCrash: () => endRun(),
        onShieldDeflect: () => consumeShield(),
        onScreenShake: (intensity) => {
          if (screenShakeEnabled && onShake) {
            onShake(intensity);
          }
        },
      },
      activeSkin,
      currentSeed
    );

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [currentSeed]);

  // 2. React to Status (Menu/Playing/Pause/GameOver)
  useEffect(() => {
    if (!engineRef.current) return;

    if (status === 'playing') {
      engineRef.current.resetRun(currentSeed, gameMode);
      engineRef.current.resume();
    } else if (status === 'menu') {
      engineRef.current.setMenuMode(true);
      engineRef.current.resume();
    } else if (status === 'paused') {
      engineRef.current.pause();
    } else if (status === 'game_over') {
      engineRef.current.stop();
    }
  }, [status, currentSeed, gameMode]);

  // 3. React to Active Power-ups
  useEffect(() => {
    if (!engineRef.current) return;
    const hasShield = activePowerUps.some((p) => p.type === 'shield');
    const hasMagnet = activePowerUps.some((p) => p.type === 'magnet');
    const hasBoost = activePowerUps.some((p) => p.type === 'boost');

    engineRef.current.setPowerUpState(hasShield, hasMagnet, hasBoost);
  }, [activePowerUps]);

  // 4. Keyboard Controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (status !== 'playing' || !engineRef.current) return;

      switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
          e.preventDefault();
          engineRef.current.moveLeft();
          break;
        case 'KeyD':
        case 'ArrowRight':
          e.preventDefault();
          engineRef.current.moveRight();
          break;
        case 'KeyW':
        case 'ArrowUp':
        case 'Space':
          e.preventDefault();
          engineRef.current.jump();
          break;
        case 'KeyS':
        case 'ArrowDown':
        case 'ShiftLeft':
        case 'ShiftRight':
          e.preventDefault();
          engineRef.current.slide();
          break;
        case 'Escape':
        case 'KeyP':
          e.preventDefault();
          useGameStore.getState().pauseGame();
          break;
      }
    },
    [status]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 5. Touch & Swipe Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !engineRef.current || status !== 'playing') return;

    if (e.changedTouches.length > 0) {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      const dt = Date.now() - touchStartRef.current.time;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const minSwipeDistance = 25;

      if (dt < 400 && (absDx > minSwipeDistance || absDy > minSwipeDistance)) {
        if (absDx > absDy) {
          // Horizontal Swipe
          if (dx > 0) {
            engineRef.current.moveRight();
          } else {
            engineRef.current.moveLeft();
          }
        } else {
          // Vertical Swipe
          if (dy < 0) {
            engineRef.current.jump();
          } else {
            engineRef.current.slide();
          }
        }
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      id="game-3d-canvas-container"
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
};
