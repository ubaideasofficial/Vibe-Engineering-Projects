import { create } from "zustand";
import type {
  GamePhase,
  GameSettings,
  Lane,
  PlayerAction,
  PowerupState,
} from "@/lib/types";
import { GAME } from "@/lib/constants";

interface GameStore {
  phase: GamePhase;
  lane: Lane;
  action: PlayerAction;
  distance: number;
  score: number;
  orbs: number;
  multiplier: number;
  speed: number;
  nearMissStreak: number;
  powerups: PowerupState;
  settings: GameSettings;

  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  setLane: (lane: Lane) => void;
  setAction: (action: PlayerAction) => void;
  tick: (delta: number) => void;
}

const initialPowerups: PowerupState = {
  shield: false,
  magnet: 0,
  boost: 0,
};

const initialSettings: GameSettings = {
  volume: 0.7,
  muted: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  phase: "start",
  lane: 0,
  action: "idle",
  distance: 0,
  score: 0,
  orbs: 0,
  multiplier: 1,
  speed: GAME.baseSpeed,
  nearMissStreak: 0,
  powerups: { ...initialPowerups },
  settings: { ...initialSettings },

  startGame: () =>
    set({
      phase: "playing",
      lane: 0,
      action: "idle",
      distance: 0,
      score: 0,
      orbs: 0,
      multiplier: 1,
      speed: GAME.baseSpeed,
      nearMissStreak: 0,
      powerups: { ...initialPowerups },
    }),

  pauseGame: () => {
    if (get().phase === "playing") set({ phase: "paused" });
  },

  resumeGame: () => {
    if (get().phase === "paused") set({ phase: "playing" });
  },

  endGame: () => set({ phase: "gameover" }),

  resetGame: () =>
    set({
      phase: "start",
      lane: 0,
      action: "idle",
      distance: 0,
      score: 0,
      orbs: 0,
      multiplier: 1,
      speed: GAME.baseSpeed,
      nearMissStreak: 0,
      powerups: { ...initialPowerups },
    }),

  setLane: (lane) => set({ lane }),

  setAction: (action) => set({ action }),

  tick: (delta) => {
    const state = get();
    if (state.phase !== "playing") return;

    const newDistance = state.distance + state.speed * delta;
    const newSpeed = Math.min(
      GAME.maxSpeed,
      GAME.baseSpeed + newDistance * GAME.speedRampPerMeter
    );

    set({
      distance: newDistance,
      speed: newSpeed,
      score: Math.floor(newDistance) + state.orbs * GAME.orbValue * state.multiplier,
    });
  },
}));
