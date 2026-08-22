import { create } from "zustand";
import { GAME_CONSTANTS, type LaneIndex } from "../constants";
import { soundManager } from "../audio/soundManager";
import { getDailySeed } from "../rng";

export type GameState = "MENU" | "PLAYING" | "PAUSED" | "GAMEOVER";
export type GameMode = "ENDLESS" | "DAILY";

export interface PowerupState {
  shield: boolean;
  shieldTime: number;
  magnet: boolean;
  magnetTime: number;
  boost: boolean;
  boostTime: number;
}

export interface GameStore {
  gameState: GameState;
  gameMode: GameMode;
  dailySeed: number;

  // Run stats
  distance: number;
  score: number;
  highScore: number;
  dailyHighScore: number;
  orbsCollected: number;
  multiplier: number;
  speed: number;
  baseSpeed: number;

  // Player controls & state
  laneIndex: LaneIndex; // 0 (Left), 1 (Center), 2 (Right)
  isJumping: boolean;
  jumpProgress: number; // 0 to 1
  isSliding: boolean;
  slideProgress: number; // 0 to 1

  // Powerups
  powerups: PowerupState;

  // Juice & Feedback
  screenShake: number;
  slowMoDuration: number;
  nearMissStreak: number;

  // Actions
  startGame: (mode?: GameMode) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  resetToMenu: () => void;

  // Movement
  moveLeft: () => void;
  moveRight: () => void;
  jump: () => void;
  slide: () => void;

  // Interactions
  collectOrb: () => void;
  activatePowerup: (type: "shield" | "magnet" | "boost") => void;
  hitObstacle: () => boolean; // returns true if shield absorbed, false if fatal
  triggerNearMiss: () => void;
  triggerShake: (intensity?: number) => void;

  // Frame tick
  updateFrame: (delta: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: "MENU",
  gameMode: "ENDLESS",
  dailySeed: getDailySeed(),

  distance: 0,
  score: 0,
  highScore: 0,
  dailyHighScore: 0,
  orbsCollected: 0,
  multiplier: 1,
  speed: GAME_CONSTANTS.INITIAL_SPEED,
  baseSpeed: GAME_CONSTANTS.INITIAL_SPEED,

  laneIndex: 1, // Start in Center lane
  isJumping: false,
  jumpProgress: 0,
  isSliding: false,
  slideProgress: 0,

  powerups: {
    shield: false,
    shieldTime: 0,
    magnet: false,
    magnetTime: 0,
    boost: false,
    boostTime: 0,
  },

  screenShake: 0,
  slowMoDuration: 0,
  nearMissStreak: 0,

  startGame: (mode = "ENDLESS") => {
    let savedHighScore = 0;
    let savedDailyScore = 0;
    if (typeof window !== "undefined") {
      try {
        savedHighScore = parseInt(localStorage.getItem("neon_runner_highscore") || "0", 10);
        const dateKey = `neon_runner_daily_${new Date().toISOString().slice(0, 10)}`;
        savedDailyScore = parseInt(localStorage.getItem(dateKey) || "0", 10);
      } catch (e) {}
    }

    try {
      soundManager.startMusic();
    } catch (e) {}

    set({
      gameState: "PLAYING",
      gameMode: mode,
      dailySeed: mode === "DAILY" ? getDailySeed() : Math.floor(Math.random() * 1000000),
      distance: 0,
      score: 0,
      highScore: savedHighScore,
      dailyHighScore: savedDailyScore,
      orbsCollected: 0,
      multiplier: 1,
      speed: GAME_CONSTANTS.INITIAL_SPEED,
      baseSpeed: GAME_CONSTANTS.INITIAL_SPEED,
      laneIndex: 1,
      isJumping: false,
      jumpProgress: 0,
      isSliding: false,
      slideProgress: 0,
      powerups: {
        shield: false,
        shieldTime: 0,
        magnet: false,
        magnetTime: 0,
        boost: false,
        boostTime: 0,
      },
      screenShake: 0,
      slowMoDuration: 0,
      nearMissStreak: 0,
    });
  },

  pauseGame: () => {
    const { gameState } = get();
    if (gameState === "PLAYING") {
      set({ gameState: "PAUSED" });
    }
  },

  resumeGame: () => {
    const { gameState } = get();
    if (gameState === "PAUSED") {
      set({ gameState: "PLAYING" });
    }
  },

  gameOver: () => {
    const { score, highScore, gameMode, dailyHighScore } = get();
    
    try {
      soundManager.stopMusic();
      soundManager.playGameOver();
    } catch (e) {}

    const newHigh = Math.max(score, highScore);
    const newDailyHigh = Math.max(score, dailyHighScore);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("neon_runner_highscore", newHigh.toString());
        if (gameMode === "DAILY") {
          const dateKey = `neon_runner_daily_${new Date().toISOString().slice(0, 10)}`;
          localStorage.setItem(dateKey, newDailyHigh.toString());
        }
      } catch (e) {}
    }

    set({
      gameState: "GAMEOVER",
      highScore: newHigh,
      dailyHighScore: newDailyHigh,
      screenShake: 0.5,
    });
  },

  resetToMenu: () => {
    try {
      soundManager.stopMusic();
    } catch (e) {}
    set({
      gameState: "MENU",
    });
  },

  moveLeft: () => {
    const { laneIndex, gameState } = get();
    if (gameState !== "PLAYING") return;
    if (laneIndex > 0) {
      try { soundManager.playLaneSwitch(); } catch (e) {}
      set({ laneIndex: (laneIndex - 1) as LaneIndex });
    }
  },

  moveRight: () => {
    const { laneIndex, gameState } = get();
    if (gameState !== "PLAYING") return;
    if (laneIndex < 2) {
      try { soundManager.playLaneSwitch(); } catch (e) {}
      set({ laneIndex: (laneIndex + 1) as LaneIndex });
    }
  },

  jump: () => {
    const { isJumping, gameState } = get();
    if (gameState !== "PLAYING" || isJumping) return;
    try { soundManager.playJump(); } catch (e) {}
    set({
      isJumping: true,
      jumpProgress: 0,
      isSliding: false,
      slideProgress: 0,
    });
  },

  slide: () => {
    const { isSliding, gameState } = get();
    if (gameState !== "PLAYING" || isSliding) return;
    try { soundManager.playSlide(); } catch (e) {}
    set({
      isSliding: true,
      slideProgress: 0,
      isJumping: false,
      jumpProgress: 0,
    });
  },

  collectOrb: () => {
    const { orbsCollected, multiplier, score } = get();
    const newOrbs = orbsCollected + 1;
    const addScore = GAME_CONSTANTS.ORB_SCORE_VALUE * multiplier;
    try { soundManager.playOrbCollect(newOrbs); } catch (e) {}
    set({
      orbsCollected: newOrbs,
      score: score + addScore,
    });
  },

  activatePowerup: (type) => {
    try { soundManager.playPowerup(); } catch (e) {}
    const { powerups } = get();

    if (type === "shield") {
      set({
        powerups: { ...powerups, shield: true, shieldTime: GAME_CONSTANTS.SHIELD_TIME },
      });
    } else if (type === "magnet") {
      set({
        powerups: { ...powerups, magnet: true, magnetTime: GAME_CONSTANTS.MAGNET_TIME },
      });
    } else if (type === "boost") {
      set({
        powerups: { ...powerups, boost: true, boostTime: GAME_CONSTANTS.BOOST_TIME },
        screenShake: 0.4,
      });
    }
  },

  hitObstacle: () => {
    const { powerups, gameOver, triggerShake } = get();
    if (powerups.boost) {
      triggerShake(0.3);
      return true;
    }
    if (powerups.shield) {
      try { soundManager.playShieldHit(); } catch (e) {}
      triggerShake(0.5);
      set({
        powerups: { ...powerups, shield: false, shieldTime: 0 },
      });
      return true; // Absorbed
    }

    // Fatal Hit -> Trigger GameOver smoothly
    gameOver();
    return false;
  },

  triggerNearMiss: () => {
    const { nearMissStreak, multiplier, score } = get();
    try { soundManager.playNearMiss(); } catch (e) {}
    const newStreak = nearMissStreak + 1;
    const newMult = Math.min(8, multiplier + (newStreak % 3 === 0 ? 1 : 0));
    set({
      nearMissStreak: newStreak,
      multiplier: newMult,
      score: score + GAME_CONSTANTS.NEAR_MISS_SCORE * newMult,
      slowMoDuration: 0.15,
      screenShake: 0.25,
    });
  },

  triggerShake: (intensity = 0.4) => {
    set({ screenShake: intensity });
  },

  updateFrame: (delta: number) => {
    const state = get();
    if (state.gameState !== "PLAYING") return;

    let effDelta = delta;
    if (state.slowMoDuration > 0) {
      effDelta = delta * 0.75;
      set({ slowMoDuration: Math.max(0, state.slowMoDuration - delta) });
    }

    const newBaseSpeed = Math.min(
      GAME_CONSTANTS.MAX_SPEED,
      state.baseSpeed + GAME_CONSTANTS.ACCELERATION * state.distance * effDelta
    );

    let currentSpeed = newBaseSpeed;
    if (state.powerups.boost) {
      currentSpeed *= GAME_CONSTANTS.BOOST_SPEED_MULTIPLIER;
    }

    const distAdded = currentSpeed * effDelta;
    const newDist = state.distance + distAdded;
    const newScore = state.score + Math.floor(distAdded * 0.5 * state.multiplier);

    // Jump
    let newIsJumping = state.isJumping;
    let newJumpProg = state.jumpProgress;
    if (state.isJumping) {
      newJumpProg += effDelta / GAME_CONSTANTS.JUMP_DURATION;
      if (newJumpProg >= 1) {
        newIsJumping = false;
        newJumpProg = 0;
      }
    }

    // Slide
    let newIsSliding = state.isSliding;
    let newSlideProg = state.slideProgress;
    if (state.isSliding) {
      newSlideProg += effDelta / GAME_CONSTANTS.SLIDE_DURATION;
      if (newSlideProg >= 1) {
        newIsSliding = false;
        newSlideProg = 0;
      }
    }

    // Powerups
    const newPowerups = { ...state.powerups };
    if (newPowerups.shieldTime > 0) {
      newPowerups.shieldTime = Math.max(0, newPowerups.shieldTime - effDelta);
      if (newPowerups.shieldTime === 0) newPowerups.shield = false;
    }
    if (newPowerups.magnetTime > 0) {
      newPowerups.magnetTime = Math.max(0, newPowerups.magnetTime - effDelta);
      if (newPowerups.magnetTime === 0) newPowerups.magnet = false;
    }
    if (newPowerups.boostTime > 0) {
      newPowerups.boostTime = Math.max(0, newPowerups.boostTime - effDelta);
      if (newPowerups.boostTime === 0) newPowerups.boost = false;
    }

    // Shake
    const newShake = Math.max(0, state.screenShake - effDelta * 4.0);

    set({
      distance: newDist,
      score: newScore,
      baseSpeed: newBaseSpeed,
      speed: currentSpeed,
      isJumping: newIsJumping,
      jumpProgress: newJumpProg,
      isSliding: newIsSliding,
      slideProgress: newSlideProg,
      powerups: newPowerups,
      screenShake: newShake,
    });
  },
}));
