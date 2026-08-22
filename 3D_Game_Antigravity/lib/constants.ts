export const LANES = [-2.4, 0, 2.4] as const;
export type LaneIndex = 0 | 1 | 2; // 0: Left (-2.4), 1: Center (0), 2: Right (2.4)

export const GAME_CONSTANTS = {
  LANE_POSITIONS: [-2.4, 0, 2.4] as const,
  INITIAL_SPEED: 24.0,
  MAX_SPEED: 58.0,
  ACCELERATION: 0.0035, // Speed increment per meter traveled
  
  JUMP_HEIGHT: 2.8,
  JUMP_DURATION: 0.58, // in seconds
  
  SLIDE_DURATION: 0.65, // in seconds
  
  SEGMENT_LENGTH: 45.0,
  VISIBLE_SEGMENTS: 7,
  
  // Powerups
  SHIELD_TIME: 15.0, // seconds or single hit
  MAGNET_TIME: 12.0,
  MAGNET_RADIUS: 8.5,
  BOOST_TIME: 6.5,
  BOOST_SPEED_MULTIPLIER: 1.6,

  // Scoring
  ORB_SCORE_VALUE: 50,
  NEAR_MISS_SCORE: 150,
  NEAR_MISS_DISTANCE: 1.6,
  
  // Audio & Vibration
  MASTER_VOLUME_DEFAULT: 0.7,
  SFX_VOLUME_DEFAULT: 0.8,
  MUSIC_VOLUME_DEFAULT: 0.5,
};

export const COLOR_PALETTE = {
  CYAN: "#00f0ff",
  MAGENTA: "#ff007f",
  YELLOW: "#ffe600",
  GREEN: "#00ff66",
  PURPLE: "#9d00ff",
  DARK_VOID: "#050714",
  ROAD_GRID: "#151c38",
  BUILDING_DARK: "#090d21",
};
