/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameStatus = 'menu' | 'playing' | 'paused' | 'game_over';

export type GameMode = 'endless' | 'daily' | 'rush';

export type Lane = -1 | 0 | 1;

export type PowerUpType = 'shield' | 'magnet' | 'boost' | 'multiplier2x';

export interface ActivePowerUp {
  type: PowerUpType;
  duration: number;
  timeLeft: number;
}

export type ObstacleType = 
  | 'barrier_jump'       // Low roadblock / construction barrier, requires jumping over
  | 'laser_gate_slide'   // Overhead gantry / clearance gate, requires sliding underneath
  | 'subway_train'       // Subway passenger train carriage blocking lane
  | 'drone_pillar'       // High concrete/utility pillar, requires switching lanes
  | 'tall_barricade'     // Hologram barricade blocking 1 lane
  | 'moving_drone';      // Drone moving side to side

export type CollectibleType = 'orb' | 'powerup';

export interface ObstacleInstance {
  id: number;
  type: ObstacleType;
  lane: Lane;
  secondLane?: Lane; // for 2-lane traps
  z: number;
  width: number;
  height: number;
  depth: number;
  cleared: boolean;
  nearMissChecked: boolean;
  oscillationOffset?: number;
}

export interface CollectibleInstance {
  id: number;
  type: CollectibleType;
  powerUpType?: PowerUpType;
  lane: Lane;
  z: number;
  y: number;
  collected: boolean;
  animOffset: number;
}

export interface BoardSkin {
  id: string;
  name: string;
  price: number;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  trailColor: string;
  glowColor: string;
  unlocked: boolean;
}

export interface RunStats {
  score: number;
  distance: number;
  orbsCollected: number;
  nearMissCount: number;
  currentMultiplier: number;
  maxMultiplier: number;
  speed: number;
  timeAlive: number;
  mode: GameMode;
  dateString: string;
  seed: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  distance: number;
  orbs: number;
  mode: GameMode;
  date: string;
  skinUsed: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardOrbs: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'score' | 'distance' | 'orbs' | 'acrobatic' | 'powerup';
}

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  audioMuted: boolean;
  graphicsQuality: 'high' | 'medium' | 'low';
  screenShakeEnabled: boolean;
  showTouchControls: boolean;
}

export interface Mission {
  id: string;
  text: string;
  reward: number;
  completed: boolean;
  current: number;
  target: number;
}
