export interface AABB {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export type ObstacleType = "BARRIER" | "HURDLE" | "DRONE";
export type PowerupType = "SHIELD" | "MAGNET" | "BOOST";

export interface ObstacleInstance {
  id: string;
  lane: 0 | 1 | 2;
  z: number;
  type: ObstacleType;
  passed?: boolean;
  nearMissed?: boolean;
}

export interface CollectibleInstance {
  id: string;
  lane: 0 | 1 | 2;
  z: number;
  y: number; // height off ground
  isPowerup?: boolean;
  powerupType?: PowerupType;
  collected?: boolean;
}

// Ultra-fast 3D AABB overlap check
export function checkAABBOverlap(a: AABB, b: AABB): boolean {
  return (
    a.minX <= b.maxX &&
    a.maxX >= b.minX &&
    a.minY <= b.maxY &&
    a.maxY >= b.minY &&
    a.minZ <= b.maxZ &&
    a.maxZ >= b.minZ
  );
}

// Check if player narrowly avoided an obstacle (near-miss detection)
export function checkNearMissAABB(player: AABB, obstacle: AABB, margin: number = 1.4): boolean {
  // Expanded box
  const expanded: AABB = {
    minX: obstacle.minX - margin,
    maxX: obstacle.maxX + margin,
    minY: obstacle.minY - margin * 0.5,
    maxY: obstacle.maxY + margin * 0.5,
    minZ: obstacle.minZ - margin * 0.5,
    maxZ: obstacle.maxZ + margin * 0.5,
  };

  return checkAABBOverlap(player, expanded) && !checkAABBOverlap(player, obstacle);
}
