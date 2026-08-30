import type { Lane } from "./types";

export const LANES: Lane[] = [-1, 0, 1];

export const LANE_WIDTH = 2.2;

export const COLORS = {
  background: "#0a0612",
  fog: "#1a0a2e",
  road: "#0d0820",
  laneLine: "#00f5ff",
  neonCyan: "#00f5ff",
  neonMagenta: "#ff00aa",
  neonPurple: "#7b2fff",
  building: "#120a24",
  window: "#ff44cc",
} as const;

export const GAME = {
  baseSpeed: 12,
  maxSpeed: 28,
  speedRampPerMeter: 0.004,
  nearMissMultiplierBoost: 0.1,
  maxMultiplier: 3,
  orbValue: 10,
} as const;

export function laneToX(lane: Lane): number {
  return lane * LANE_WIDTH;
}
