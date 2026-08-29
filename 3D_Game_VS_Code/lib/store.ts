import { create } from "zustand";
import type { GameStatus, PowerupKind } from "./game";

type GameStore = {
  status: GameStatus;
  lane: number;
  score: number;
  distance: number;
  orbs: number;
  multiplier: number;
  speed: number;
  shield: boolean;
  magnet: boolean;
  boost: boolean;
  jumping: boolean;
  sliding: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  moveLane: (direction: number) => void;
  jump: () => void;
  slide: () => void;
  collectOrb: () => void;
  collectPowerup: (kind: PowerupKind) => void;
  hit: () => void;
  tick: (delta: number, speed: number) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  status: "ready", lane: 0, score: 0, distance: 0, orbs: 0, multiplier: 1, speed: 15, shield: false, magnet: false, boost: false, jumping: false, sliding: false,
  start: () => set({ status: "playing" }),
  pause: () => set((state) => state.status === "playing" ? { status: "paused" } : state),
  resume: () => set((state) => state.status === "paused" ? { status: "playing" } : state),
  restart: () => set({ status: "playing", lane: 0, score: 0, distance: 0, orbs: 0, multiplier: 1, speed: 15, shield: false, magnet: false, boost: false, jumping: false, sliding: false }),
  moveLane: (direction) => set((state) => ({ lane: Math.max(-1, Math.min(1, state.lane + direction)) })),
  jump: () => set((state) => state.status === "playing" && !state.sliding ? { jumping: true } : state),
  slide: () => set((state) => state.status === "playing" && !state.jumping ? { sliding: true } : state),
  collectOrb: () => set((state) => ({ orbs: state.orbs + 1, score: state.score + 10 * state.multiplier, multiplier: Math.min(9, state.multiplier + 0.05) })),
  collectPowerup: (kind) => set({ [kind]: true }),
  hit: () => set((state) => state.shield ? { shield: false, multiplier: 1 } : { status: "gameOver", multiplier: 1 }),
  tick: (delta, speed) => set((state) => ({ distance: state.distance + speed * delta, score: state.score + speed * delta * state.multiplier, speed }))
}));
