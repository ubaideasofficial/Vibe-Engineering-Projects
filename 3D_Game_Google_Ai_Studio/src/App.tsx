/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { useGameStore } from './lib/store';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { GarageModal } from './components/GarageModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { MissionsModal } from './components/MissionsModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const status = useGameStore((s) => s.status);
  const activeModal = useGameStore((s) => s.activeModal);
  const [shakeStyle, setShakeStyle] = useState<string>('');

  const triggerScreenShake = useCallback((intensity: number) => {
    const px = Math.min(18, Math.max(4, Math.round(intensity * 24)));
    setShakeStyle(`translate(${Math.random() > 0.5 ? px : -px}px, ${Math.random() > 0.5 ? px : -px}px)`);
    setTimeout(() => {
      setShakeStyle('');
    }, 120);
  }, []);

  return (
    <main 
      id="app-root-container"
      className="relative w-screen h-screen overflow-hidden bg-[#070714] select-none"
      style={{
        transform: shakeStyle,
        transition: shakeStyle ? 'transform 0.05s ease-out' : 'transform 0.15s ease-in',
      }}
    >
      {/* 3D WebGL Three.js Canvas Layer */}
      <GameCanvas onShake={triggerScreenShake} />

      {/* Main Menu Layer */}
      {status === 'menu' && <MainMenu />}

      {/* In-Game Active HUD Layer */}
      {(status === 'playing' || status === 'paused') && <HUD />}

      {/* Pause Menu Modal */}
      {status === 'paused' && activeModal === 'none' && <PauseModal />}

      {/* Game Over / Debrief Modal */}
      {status === 'game_over' && <GameOverModal />}

      {/* Modals & Dialogs */}
      {activeModal === 'garage' && <GarageModal />}
      {activeModal === 'leaderboard' && <LeaderboardModal />}
      {activeModal === 'missions' && <MissionsModal />}
      {activeModal === 'settings' && <SettingsModal />}
    </main>
  );
}
