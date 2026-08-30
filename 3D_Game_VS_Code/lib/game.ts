export type GameStatus = "ready" | "playing" | "paused" | "gameOver";
export type ObstacleKind = "barrier" | "gate" | "drone";
export type PowerupKind = "shield" | "magnet" | "boost";

export type Entity = {
  id: number;
  lane: number;
  z: number;
  kind: ObstacleKind;
  phase?: number;
};

export type Orb = { id: number; lane: number; z: number; y: number };
export type Powerup = { id: number; lane: number; z: number; kind: PowerupKind };

export const LANES = [-1, 0, 1] as const;
export const LANE_WIDTH = 2.65;
export const PLAYER_Z = 3;
export const START_SPEED = 15;
export const MAX_SPEED = 34;
export const BOOST_SPEED = 43;
export const ROAD_LENGTH = 150;
export const COLLISION_Z = 1.35;

export function laneX(lane: number) {
  return lane * LANE_WIDTH;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function aabbHit(a: { x: number; y: number; z: number; width: number; height: number; depth: number }, b: { x: number; y: number; z: number; width: number; height: number; depth: number }) {
  return Math.abs(a.x - b.x) < (a.width + b.width) / 2 && Math.abs(a.y - b.y) < (a.height + b.height) / 2 && Math.abs(a.z - b.z) < (a.depth + b.depth) / 2;
}
