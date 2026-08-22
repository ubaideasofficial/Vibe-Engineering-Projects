/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BoardSkin, Mission, Achievement } from '../types';

export const LANE_WIDTH = 2.8;
export const LANE_POSITIONS: Record<number, number> = {
  [-1]: LANE_WIDTH,   // Left lane on screen (positive X when camera looks along +Z)
  0: 0,               // Center lane
  1: -LANE_WIDTH,     // Right lane on screen (negative X when camera looks along +Z)
};

export const BASE_SPEED = 28;
export const MAX_SPEED = 65;
export const ACCELERATION = 0.45; // Speed increase per 100m
export const JUMP_DURATION = 0.55; // seconds
export const JUMP_HEIGHT = 2.4;
export const SLIDE_DURATION = 0.6; // seconds

export const TRACK_SEGMENT_LENGTH = 80;
export const VISIBLE_SEGMENTS = 5;
export const SPAWN_DISTANCE_AHEAD = 180;
export const DESPAWN_DISTANCE_BEHIND = 25;

export const POWERUP_DURATIONS = {
  shield: 15,
  magnet: 10,
  boost: 6,
  multiplier2x: 12,
};

export const DEFAULT_SKINS: BoardSkin[] = [
  {
    id: 'cyber_cyan',
    name: 'Cyber Cyan 3000',
    price: 0,
    description: 'The standard issue atmospheric street glider.',
    primaryColor: '#00f0ff',
    secondaryColor: '#0c1527',
    trailColor: '#00f0ff',
    glowColor: '#00f0ff',
    unlocked: true,
  },
  {
    id: 'neon_pulse',
    name: 'Neon Magenta Pulse',
    price: 150,
    description: 'Tuned with hyper-frequency pink plasma thrusters.',
    primaryColor: '#ff007f',
    secondaryColor: '#2b0a24',
    trailColor: '#ff007f',
    glowColor: '#ff007f',
    unlocked: false,
  },
  {
    id: 'solar_flare',
    name: 'Solar Flare Gold',
    price: 350,
    description: 'Forged in orbital solar refiners with blazing golden exhaust.',
    primaryColor: '#ffe600',
    secondaryColor: '#2d2403',
    trailColor: '#ffaa00',
    glowColor: '#ffe600',
    unlocked: false,
  },
  {
    id: 'matrix_phantom',
    name: 'Matrix Phantom',
    price: 600,
    description: 'Ghostly emerald nanotech board that bends digital light.',
    primaryColor: '#00ff88',
    secondaryColor: '#052414',
    trailColor: '#00ff88',
    glowColor: '#00ff88',
    unlocked: false,
  },
  {
    id: 'void_reaper',
    name: 'Void Reaper 99',
    price: 1200,
    description: 'Dark matter chassis with an ominous ultraviolet warp drive.',
    primaryColor: '#b026ff',
    secondaryColor: '#120424',
    trailColor: '#d600ff',
    glowColor: '#b026ff',
    unlocked: false,
  },
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'dist_500',
    text: 'Travel 500 meters in a single run',
    reward: 50,
    completed: false,
    current: 0,
    target: 500,
  },
  {
    id: 'orbs_50',
    text: 'Collect 50 Energy Orbs in one run',
    reward: 75,
    completed: false,
    current: 0,
    target: 50,
  },
  {
    id: 'near_miss_3',
    text: 'Perform 3 Near-Misses in one run',
    reward: 100,
    completed: false,
    current: 0,
    target: 3,
  },
  {
    id: 'boost_powerup',
    text: 'Pick up 2 Turbo Boosts',
    reward: 120,
    completed: false,
    current: 0,
    target: 2,
  },
  {
    id: 'mult_4x',
    text: 'Reach a 4x Multiplier streak',
    reward: 150,
    completed: false,
    current: 0,
    target: 4,
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'novice_runner',
    title: 'First Flight',
    description: 'Complete your first run on the neon highway',
    rewardOrbs: 25,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    category: 'distance',
  },
  {
    id: 'marathon_1000',
    title: 'Neon Nomad',
    description: 'Reach a distance of 1,000m',
    rewardOrbs: 100,
    progress: 0,
    maxProgress: 1000,
    unlocked: false,
    category: 'distance',
  },
  {
    id: 'hyper_runner_3000',
    title: 'Grid Legend',
    description: 'Reach a distance of 3,000m',
    rewardOrbs: 300,
    progress: 0,
    maxProgress: 3000,
    unlocked: false,
    category: 'distance',
  },
  {
    id: 'orb_hoarder',
    title: 'Energy Magnet',
    description: 'Collect 500 total energy orbs',
    rewardOrbs: 200,
    progress: 0,
    maxProgress: 500,
    unlocked: false,
    category: 'orbs',
  },
  {
    id: 'daredevil',
    title: 'Edge of Chaos',
    description: 'Perform 20 total near-miss dodges',
    rewardOrbs: 250,
    progress: 0,
    maxProgress: 20,
    unlocked: false,
    category: 'acrobatic',
  },
];
