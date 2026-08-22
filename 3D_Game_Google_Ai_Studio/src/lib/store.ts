/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { 
  GameStatus, 
  GameMode, 
  ActivePowerUp, 
  PowerUpType, 
  BoardSkin, 
  RunStats, 
  LeaderboardEntry, 
  Mission, 
  Achievement, 
  GameSettings 
} from '../types';
import { DEFAULT_SKINS, INITIAL_MISSIONS, INITIAL_ACHIEVEMENTS } from './constants';
import { getDailySeedString } from './rng';
import { audio } from './audio';

interface GameState {
  // Navigation & Flow
  status: GameStatus;
  gameMode: GameMode;
  activeModal: 'none' | 'garage' | 'leaderboard' | 'missions' | 'settings' | 'controls';
  
  // Player & Customization
  totalOrbs: number;
  activeSkinId: string;
  skins: BoardSkin[];
  
  // Real-time Gameplay Stats
  currentScore: number;
  currentDistance: number;
  currentOrbs: number;
  currentMultiplier: number;
  maxMultiplierReached: number;
  nearMisses: number;
  currentSpeed: number;
  activePowerUps: ActivePowerUp[];
  lastNearMissTime: number;
  
  // Game seed & Mode details
  currentSeed: number;
  dailySeedDate: string;
  isDailyCompletedToday: boolean;
  
  // End of Run Cache
  lastRunStats: RunStats | null;
  highScores: Record<GameMode, number>;
  leaderboard: LeaderboardEntry[];
  
  // Missions & Progression
  missions: Mission[];
  achievements: Achievement[];
  
  // Audio & Hardware Settings
  settings: GameSettings;
  
  // Floating Notifications & Feedback
  floatingPopups: Array<{ id: string; text: string; color: string }>;

  // Actions
  setStatus: (status: GameStatus) => void;
  setGameMode: (mode: GameMode) => void;
  openModal: (modal: 'none' | 'garage' | 'leaderboard' | 'missions' | 'settings' | 'controls') => void;
  closeModal: () => void;
  
  // Game Loop Actions
  startNewRun: (mode?: GameMode) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endRun: () => void;
  
  // Live Updates from 3D Engine
  updateRunProgress: (deltaDist: number, speed: number) => void;
  collectOrb: (amount?: number) => void;
  triggerNearMiss: () => void;
  applyPowerUp: (type: PowerUpType, duration: number) => void;
  consumeShield: () => boolean; // returns true if shield was active
  tickPowerUps: (deltaTime: number) => void;
  hasPowerUp: (type: PowerUpType) => boolean;

  // Economy & Customization
  unlockSkin: (skinId: string) => boolean;
  equipSkin: (skinId: string) => void;
  getActiveSkin: () => BoardSkin;
  
  // Missions & Achievements
  checkMissionsProgress: () => void;
  claimMissionReward: (missionId: string) => void;
  claimAchievementReward: (achId: string) => void;

  // Settings
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  toggleAudio: () => void;
  
  // UI Alerts
  addPopup: (text: string, color?: string) => void;
  removePopup: (id: string) => void;
}

const STORAGE_KEYS = {
  ORBS: 'neon_runner_orbs',
  SKINS: 'neon_runner_skins',
  ACTIVE_SKIN: 'neon_runner_active_skin',
  HIGH_SCORES: 'neon_runner_high_scores',
  LEADERBOARD: 'neon_runner_leaderboard',
  MISSIONS: 'neon_runner_missions',
  ACHIEVEMENTS: 'neon_runner_achievements',
  SETTINGS: 'neon_runner_settings',
  DAILY_DATE: 'neon_runner_daily_date',
};

// Safe LocalStorage helpers
function loadJSON<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const useGameStore = create<GameState>((set, get) => {
  const storedOrbs = loadJSON<number>(STORAGE_KEYS.ORBS, 50); // bonus start currency
  const storedSkins = loadJSON<BoardSkin[]>(STORAGE_KEYS.SKINS, DEFAULT_SKINS);
  const storedActiveSkin = loadJSON<string>(STORAGE_KEYS.ACTIVE_SKIN, 'cyber_cyan');
  const storedHighScores = loadJSON<Record<GameMode, number>>(STORAGE_KEYS.HIGH_SCORES, {
    endless: 0,
    daily: 0,
    rush: 0,
  });
  const storedLeaderboard = loadJSON<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, [
    { id: '1', playerName: 'K41-CYBER', score: 18450, distance: 2310, orbs: 142, mode: 'endless', date: '2026-08-20', skinUsed: 'void_reaper' },
    { id: '2', playerName: 'NEO_GLIDER', score: 14200, distance: 1890, orbs: 98, mode: 'endless', date: '2026-08-21', skinUsed: 'solar_flare' },
    { id: '3', playerName: 'SYNTH_GHOST', score: 11050, distance: 1450, orbs: 85, mode: 'endless', date: '2026-08-22', skinUsed: 'neon_pulse' },
    { id: '4', playerName: 'ZERO_COOL', score: 8700, distance: 1120, orbs: 64, mode: 'daily', date: '2026-08-22', skinUsed: 'cyber_cyan' },
    { id: '5', playerName: 'BLADE_RUN', score: 6200, distance: 820, orbs: 45, mode: 'rush', date: '2026-08-21', skinUsed: 'cyber_cyan' },
  ]);
  const storedMissions = loadJSON<Mission[]>(STORAGE_KEYS.MISSIONS, INITIAL_MISSIONS);
  const storedAchievements = loadJSON<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS);
  const storedSettings = loadJSON<GameSettings>(STORAGE_KEYS.SETTINGS, {
    musicVolume: 0.6,
    sfxVolume: 0.8,
    audioMuted: false,
    graphicsQuality: 'high',
    screenShakeEnabled: true,
    showTouchControls: true,
  });

  return {
    status: 'menu',
    gameMode: 'endless',
    activeModal: 'none',

    totalOrbs: storedOrbs,
    activeSkinId: storedActiveSkin,
    skins: storedSkins,

    currentScore: 0,
    currentDistance: 0,
    currentOrbs: 0,
    currentMultiplier: 1,
    maxMultiplierReached: 1,
    nearMisses: 0,
    currentSpeed: 28,
    activePowerUps: [],
    lastNearMissTime: 0,

    currentSeed: Date.now(),
    dailySeedDate: getDailySeedString(),
    isDailyCompletedToday: loadJSON<string>(STORAGE_KEYS.DAILY_DATE, '') === getDailySeedString(),

    lastRunStats: null,
    highScores: storedHighScores,
    leaderboard: storedLeaderboard,

    missions: storedMissions,
    achievements: storedAchievements,
    settings: storedSettings,
    floatingPopups: [],

    setStatus: (status) => set({ status }),
    setGameMode: (gameMode) => set({ gameMode }),
    openModal: (activeModal) => {
      audio.playButtonClick();
      set({ activeModal });
    },
    closeModal: () => {
      audio.playButtonClick();
      set({ activeModal: 'none' });
    },

    startNewRun: (mode) => {
      const selectedMode = mode || get().gameMode;
      const seed = selectedMode === 'daily' 
        ? Math.abs(parseInt(get().dailySeedDate.replace(/-/g, ''), 10)) 
        : Date.now();

      audio.startBGM();

      set({
        status: 'playing',
        gameMode: selectedMode,
        activeModal: 'none',
        currentScore: 0,
        currentDistance: 0,
        currentOrbs: 0,
        currentMultiplier: 1,
        maxMultiplierReached: 1,
        nearMisses: 0,
        currentSpeed: selectedMode === 'rush' ? 38 : 28,
        activePowerUps: [],
        lastNearMissTime: 0,
        currentSeed: seed,
        lastRunStats: null,
      });
    },

    pauseGame: () => {
      if (get().status === 'playing') {
        audio.playButtonClick();
        set({ status: 'paused' });
      }
    },

    resumeGame: () => {
      if (get().status === 'paused') {
        audio.playButtonClick();
        set({ status: 'playing' });
      }
    },

    endRun: () => {
      const state = get();
      audio.stopBGM();
      audio.playGameOver();

      const finalScore = Math.floor(state.currentScore);
      const finalDistance = Math.floor(state.currentDistance);
      const finalOrbs = state.currentOrbs;
      const mode = state.gameMode;

      const runStats: RunStats = {
        score: finalScore,
        distance: finalDistance,
        orbsCollected: finalOrbs,
        nearMissCount: state.nearMisses,
        currentMultiplier: state.currentMultiplier,
        maxMultiplier: state.maxMultiplierReached,
        speed: Math.floor(state.currentSpeed),
        timeAlive: Math.floor(finalDistance / Math.max(20, state.currentSpeed)),
        mode: mode,
        dateString: new Date().toISOString().slice(0, 10),
        seed: state.currentSeed,
      };

      // Update High Scores
      const newHighScores = { ...state.highScores };
      let isNewRecord = false;
      if (finalScore > (newHighScores[mode] || 0)) {
        newHighScores[mode] = finalScore;
        isNewRecord = true;
        saveJSON(STORAGE_KEYS.HIGH_SCORES, newHighScores);
      }

      // Add to Leaderboard
      const newLeaderboard = [
        {
          id: String(Date.now()),
          playerName: 'YOU (PILOT)',
          score: finalScore,
          distance: finalDistance,
          orbs: finalOrbs,
          mode: mode,
          date: runStats.dateString,
          skinUsed: state.activeSkinId,
        },
        ...state.leaderboard,
      ].sort((a, b) => b.score - a.score).slice(0, 20);

      saveJSON(STORAGE_KEYS.LEADERBOARD, newLeaderboard);

      // Save Currency
      const newTotalOrbs = state.totalOrbs + finalOrbs;
      saveJSON(STORAGE_KEYS.ORBS, newTotalOrbs);

      if (mode === 'daily') {
        saveJSON(STORAGE_KEYS.DAILY_DATE, state.dailySeedDate);
      }

      set({
        status: 'game_over',
        totalOrbs: newTotalOrbs,
        lastRunStats: runStats,
        highScores: newHighScores,
        leaderboard: newLeaderboard,
        isDailyCompletedToday: mode === 'daily' ? true : state.isDailyCompletedToday,
      });

      // Progress missions & achievements
      get().checkMissionsProgress();

      if (isNewRecord) {
        get().addPopup('🏆 NEW HIGH SCORE RECORD!', '#ffe600');
      }
    },

    updateRunProgress: (deltaDist, speed) => {
      const state = get();
      if (state.status !== 'playing') return;

      const has2x = state.activePowerUps.some(p => p.type === 'multiplier2x');
      const boostBonus = state.activePowerUps.some(p => p.type === 'boost') ? 1.5 : 1.0;
      
      const effectiveMultiplier = state.currentMultiplier * (has2x ? 2 : 1);
      const pointsAdded = deltaDist * effectiveMultiplier * boostBonus;

      const newDistance = state.currentDistance + deltaDist;
      const newScore = state.currentScore + pointsAdded;

      set({
        currentDistance: newDistance,
        currentScore: newScore,
        currentSpeed: speed,
      });
    },

    collectOrb: (amount = 1) => {
      const state = get();
      if (state.status !== 'playing') return;

      const has2x = state.activePowerUps.some(p => p.type === 'multiplier2x');
      const earnedOrbs = amount * (has2x ? 2 : 1);
      const bonusScore = earnedOrbs * 10 * state.currentMultiplier;

      audio.playOrbCollect(state.currentOrbs);

      set({
        currentOrbs: state.currentOrbs + earnedOrbs,
        currentScore: state.currentScore + bonusScore,
      });
    },

    triggerNearMiss: () => {
      const state = get();
      if (state.status !== 'playing') return;

      const now = Date.now();
      if (now - state.lastNearMissTime < 400) return; // Debounce

      audio.playNearMiss();
      
      const newMultiplier = Math.min(8, state.currentMultiplier + 1);
      const bonusScore = 150 * newMultiplier;

      get().addPopup(`NEAR MISS! +${bonusScore} (x${newMultiplier})`, '#00f0ff');

      set({
        nearMisses: state.nearMisses + 1,
        currentMultiplier: newMultiplier,
        maxMultiplierReached: Math.max(state.maxMultiplierReached, newMultiplier),
        currentScore: state.currentScore + bonusScore,
        lastNearMissTime: now,
      });
    },

    applyPowerUp: (type, duration) => {
      const state = get();
      if (state.status !== 'playing') return;

      audio.playPowerUpPickup();

      if (type === 'boost') {
        audio.setBoostActive(true);
      }

      const existingIndex = state.activePowerUps.findIndex(p => p.type === type);
      let updated: ActivePowerUp[];

      if (existingIndex >= 0) {
        updated = [...state.activePowerUps];
        updated[existingIndex] = {
          type,
          duration: Math.max(updated[existingIndex].duration, duration),
          timeLeft: duration,
        };
      } else {
        updated = [...state.activePowerUps, { type, duration, timeLeft: duration }];
      }

      const labelMap: Record<PowerUpType, { name: string; color: string }> = {
        shield: { name: '🛡️ PLASMA SHIELD ONLINE', color: '#00ff88' },
        magnet: { name: '🧲 ORB MAGNET ACTIVE', color: '#00f0ff' },
        boost: { name: '⚡ HYPER BOOST ENGAGED', color: '#ffe600' },
        multiplier2x: { name: '✨ 2X SCORE MULTIPLIER', color: '#ff007f' },
      };

      get().addPopup(labelMap[type].name, labelMap[type].color);
      set({ activePowerUps: updated });
    },

    consumeShield: () => {
      const state = get();
      const shieldIndex = state.activePowerUps.findIndex(p => p.type === 'shield');
      const boostIndex = state.activePowerUps.findIndex(p => p.type === 'boost');

      // Boost grants absolute invincibility
      if (boostIndex >= 0) {
        audio.playShieldDeflect();
        get().addPopup('💥 OBSTACLE SMASHED!', '#ffe600');
        return true;
      }

      if (shieldIndex >= 0) {
        audio.playShieldDeflect();
        const updated = state.activePowerUps.filter((_, i) => i !== shieldIndex);
        get().addPopup('🛡️ SHIELD BROKEN!', '#ff007f');
        set({ activePowerUps: updated });
        return true;
      }

      return false;
    },

    tickPowerUps: (deltaTime) => {
      const state = get();
      if (state.activePowerUps.length === 0) return;

      let hadBoost = false;
      const updated: ActivePowerUp[] = [];

      for (const p of state.activePowerUps) {
        const nextTime = p.timeLeft - deltaTime;
        if (p.type === 'boost' && nextTime > 0) hadBoost = true;

        if (nextTime > 0) {
          updated.push({ ...p, timeLeft: nextTime });
        }
      }

      if (!hadBoost && state.activePowerUps.some(p => p.type === 'boost')) {
        audio.setBoostActive(false);
      }

      set({ activePowerUps: updated });
    },

    hasPowerUp: (type) => {
      return get().activePowerUps.some(p => p.type === type && p.timeLeft > 0);
    },

    unlockSkin: (skinId) => {
      const state = get();
      const targetSkin = state.skins.find(s => s.id === skinId);
      if (!targetSkin || targetSkin.unlocked || state.totalOrbs < targetSkin.price) {
        return false;
      }

      const newTotalOrbs = state.totalOrbs - targetSkin.price;
      const updatedSkins = state.skins.map(s => s.id === skinId ? { ...s, unlocked: true } : s);

      saveJSON(STORAGE_KEYS.ORBS, newTotalOrbs);
      saveJSON(STORAGE_KEYS.SKINS, updatedSkins);
      saveJSON(STORAGE_KEYS.ACTIVE_SKIN, skinId);

      audio.playFanfare();
      get().addPopup(`🎉 UNLOCKED ${targetSkin.name.toUpperCase()}!`, targetSkin.primaryColor);

      set({
        totalOrbs: newTotalOrbs,
        skins: updatedSkins,
        activeSkinId: skinId,
      });

      return true;
    },

    equipSkin: (skinId) => {
      const state = get();
      const targetSkin = state.skins.find(s => s.id === skinId);
      if (targetSkin && targetSkin.unlocked) {
        saveJSON(STORAGE_KEYS.ACTIVE_SKIN, skinId);
        audio.playButtonClick();
        set({ activeSkinId: skinId });
      }
    },

    getActiveSkin: () => {
      const state = get();
      return state.skins.find(s => s.id === state.activeSkinId) || DEFAULT_SKINS[0];
    },

    checkMissionsProgress: () => {
      const state = get();
      const stats = state.lastRunStats;
      if (!stats) return;

      const updatedMissions = state.missions.map(m => {
        if (m.completed) return m;
        let progress = m.current;
        if (m.id === 'dist_500') progress = Math.max(progress, stats.distance);
        if (m.id === 'orbs_50') progress = Math.max(progress, stats.orbsCollected);
        if (m.id === 'near_miss_3') progress = Math.max(progress, stats.nearMissCount);
        if (m.id === 'mult_4x') progress = Math.max(progress, stats.maxMultiplier);
        return {
          ...m,
          current: progress,
          completed: progress >= m.target,
        };
      });

      const updatedAchievements = state.achievements.map(a => {
        let p = a.progress;
        if (a.id === 'novice_runner') p = 1;
        if (a.id === 'marathon_1000') p = Math.max(p, stats.distance);
        if (a.id === 'hyper_runner_3000') p = Math.max(p, stats.distance);
        if (a.id === 'orb_hoarder') p = p + stats.orbsCollected;
        if (a.id === 'daredevil') p = p + stats.nearMissCount;
        return {
          ...a,
          progress: p,
          unlocked: a.unlocked || p >= a.maxProgress,
        };
      });

      saveJSON(STORAGE_KEYS.MISSIONS, updatedMissions);
      saveJSON(STORAGE_KEYS.ACHIEVEMENTS, updatedAchievements);

      set({
        missions: updatedMissions,
        achievements: updatedAchievements,
      });
    },

    claimMissionReward: (missionId) => {
      const state = get();
      const mission = state.missions.find(m => m.id === missionId);
      if (!mission || !mission.completed) return;

      const reward = mission.reward;
      const newTotalOrbs = state.totalOrbs + reward;
      const updatedMissions = state.missions.filter(m => m.id !== missionId);

      saveJSON(STORAGE_KEYS.ORBS, newTotalOrbs);
      saveJSON(STORAGE_KEYS.MISSIONS, updatedMissions);

      audio.playFanfare();
      get().addPopup(`+${reward} ORBS REWARD CLAIMED!`, '#ffe600');

      set({
        totalOrbs: newTotalOrbs,
        missions: updatedMissions,
      });
    },

    claimAchievementReward: (achId) => {
      const state = get();
      const ach = state.achievements.find(a => a.id === achId);
      if (!ach || !ach.unlocked) return;

      const reward = ach.rewardOrbs;
      const newTotalOrbs = state.totalOrbs + reward;
      const updatedAch = state.achievements.map(a => a.id === achId ? { ...a, rewardOrbs: 0 } : a);

      saveJSON(STORAGE_KEYS.ORBS, newTotalOrbs);
      saveJSON(STORAGE_KEYS.ACHIEVEMENTS, updatedAch);

      audio.playFanfare();
      get().addPopup(`ACHIEVEMENT CLAIMED: +${reward} ORBS!`, '#00ff88');

      set({
        totalOrbs: newTotalOrbs,
        achievements: updatedAch,
      });
    },

    updateSettings: (newSettings) => {
      const state = get();
      const merged = { ...state.settings, ...newSettings };
      saveJSON(STORAGE_KEYS.SETTINGS, merged);
      audio.setVolumes(merged.musicVolume, merged.sfxVolume, merged.audioMuted);
      set({ settings: merged });
    },

    toggleAudio: () => {
      const state = get();
      const newMuted = !state.settings.audioMuted;
      get().updateSettings({ audioMuted: newMuted });
    },

    addPopup: (text, color = '#00f0ff') => {
      const id = `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      set(state => ({
        floatingPopups: [...state.floatingPopups.slice(-3), { id, text, color }],
      }));

      setTimeout(() => {
        get().removePopup(id);
      }, 1600);
    },

    removePopup: (id) => {
      set(state => ({
        floatingPopups: state.floatingPopups.filter(p => p.id !== id),
      }));
    },
  };
});
