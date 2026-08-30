export type GamePhase = "start" | "playing" | "paused" | "gameover";

export type Lane = -1 | 0 | 1;

export type PlayerAction = "idle" | "jumping" | "sliding";

export type PowerupType = "shield" | "magnet" | "boost";

export interface PowerupState {
  shield: boolean;
  magnet: number;
  boost: number;
}

export interface GameSettings {
  volume: number;
  muted: boolean;
}
