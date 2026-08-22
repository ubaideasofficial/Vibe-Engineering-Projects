"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/lib/store/useGameStore";
import { GAME_CONSTANTS, LANES, type LaneIndex } from "@/lib/constants";
import {
  type ObstacleInstance,
  type ObstacleType,
  type AABB,
  checkAABBOverlap,
  checkNearMissAABB,
} from "@/lib/physics/collision";
import { createMulberry32, getRandomInt } from "@/lib/rng";

export function Obstacles() {
  const obstaclesRef = useRef<ObstacleInstance[]>([]);
  const nextSpawnZ = useRef<number>(-40);
  const prngRef = useRef<() => number>(Math.random);
  // Force re-render to sync visual positions
  const [, forceRender] = useState(0);
  const frameCountRef = useRef(0);

  const gameState = useGameStore((s) => s.gameState);
  const gameMode = useGameStore((s) => s.gameMode);
  const dailySeed = useGameStore((s) => s.dailySeed);

  useEffect(() => {
    if (gameState === "PLAYING") {
      prngRef.current = gameMode === "DAILY" ? createMulberry32(dailySeed) : Math.random;
      obstaclesRef.current = [];
      nextSpawnZ.current = -50;
    }
  }, [gameState, gameMode, dailySeed]);

  useFrame((_, delta) => {
    const store = useGameStore.getState();
    if (store.gameState !== "PLAYING") return;

    const moveDist = store.speed * delta;
    const rng = prngRef.current;

    // 1. Move active obstacles towards player
    for (let i = 0; i < obstaclesRef.current.length; i++) {
      obstaclesRef.current[i].z += moveDist;
    }

    // 2. Spawn new obstacles ahead
    while (nextSpawnZ.current > -240) {
      const typeChoice = rng();
      let type: ObstacleType = "HURDLE";
      if (typeChoice < 0.38) type = "HURDLE";
      else if (typeChoice < 0.72) type = "BARRIER";
      else type = "DRONE";

      const lane = getRandomInt(0, 2, rng) as LaneIndex;

      obstaclesRef.current.push({
        id: Math.random().toString(36).slice(2),
        lane,
        z: nextSpawnZ.current,
        type,
      });

      // Combo obstacle at higher speeds
      if (store.speed > 36 && rng() > 0.65) {
        const otherLane = ((lane + 1) % 3) as LaneIndex;
        const otherType: ObstacleType = rng() > 0.5 ? "HURDLE" : "BARRIER";
        obstaclesRef.current.push({
          id: Math.random().toString(36).slice(2),
          lane: otherLane,
          z: nextSpawnZ.current,
          type: otherType,
        });
      }

      const gap = Math.max(20, 38 - (store.speed - GAME_CONSTANTS.INITIAL_SPEED) * 0.4);
      nextSpawnZ.current -= gap;
    }

    // 3. Compute Player AABB
    const playerX = LANES[store.laneIndex];
    let playerMinY = 0.1;
    let playerMaxY = 1.6;

    if (store.isJumping) {
      const jumpY = Math.sin(store.jumpProgress * Math.PI) * GAME_CONSTANTS.JUMP_HEIGHT;
      playerMinY += jumpY;
      playerMaxY += jumpY;
    } else if (store.isSliding) {
      playerMinY = 0.05;
      playerMaxY = 0.5;
    }

    const playerBox: AABB = {
      minX: playerX - 0.35,
      maxX: playerX + 0.35,
      minY: playerMinY,
      maxY: playerMaxY,
      minZ: -0.7,
      maxZ: 0.7,
    };

    // 4. Collision & Near-Miss Checks
    for (let i = 0; i < obstaclesRef.current.length; i++) {
      const obs = obstaclesRef.current[i];
      if (obs.passed) continue;

      const obsX = LANES[obs.lane];
      let obsBox: AABB;

      if (obs.type === "HURDLE") {
        obsBox = {
          minX: obsX - 0.95,
          maxX: obsX + 0.95,
          minY: 0,
          maxY: 0.85,
          minZ: obs.z - 0.35,
          maxZ: obs.z + 0.35,
        };
      } else if (obs.type === "BARRIER") {
        obsBox = {
          minX: obsX - 0.95,
          maxX: obsX + 0.95,
          minY: 0.75,
          maxY: 3.2,
          minZ: obs.z - 0.35,
          maxZ: obs.z + 0.35,
        };
      } else {
        obsBox = {
          minX: obsX - 0.85,
          maxX: obsX + 0.85,
          minY: 0.2,
          maxY: 2.2,
          minZ: obs.z - 0.45,
          maxZ: obs.z + 0.45,
        };
      }

      if (checkAABBOverlap(playerBox, obsBox)) {
        obs.passed = true;
        const absorbed = store.hitObstacle();
        if (!absorbed) break;
      }

      if (!obs.nearMissed && Math.abs(obs.z) < 1.1) {
        if (checkNearMissAABB(playerBox, obsBox, 1.2)) {
          obs.nearMissed = true;
          store.triggerNearMiss();
        }
      }

      if (obs.z > 8) obs.passed = true;
    }

    // 5. Cleanup
    obstaclesRef.current = obstaclesRef.current.filter((obs) => obs.z < 15);
    nextSpawnZ.current += moveDist;

    // Force re-render every 2 frames to sync visual positions
    frameCountRef.current++;
    if (frameCountRef.current % 2 === 0) {
      forceRender((n) => n + 1);
    }
  });

  const visible = obstaclesRef.current.filter((o) => !o.passed && o.z > -200 && o.z < 8);

  return (
    <group>
      {visible.map((obs) => (
        <ObstacleItem key={obs.id} obstacle={obs} />
      ))}
    </group>
  );
}

function ObstacleItem({ obstacle }: { obstacle: ObstacleInstance }) {
  const x = LANES[obstacle.lane];
  const z = obstacle.z;

  if (obstacle.type === "HURDLE") {
    // Jump-over obstacle: bright orange/red laser bar close to ground
    return (
      <group position={[x, 0, z]}>
        {/* Left post - glowing orange */}
        <mesh position={[-1.0, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1.0, 8]} />
          <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={0.8} metalness={0.5} />
        </mesh>
        {/* Right post */}
        <mesh position={[1.0, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1.0, 8]} />
          <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={0.8} metalness={0.5} />
        </mesh>
        {/* Bright laser bar - thick and very visible */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.0, 0.28, 0.25]} />
          <meshBasicMaterial color="#ff6600" />
        </mesh>
        {/* Glow halo */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.1, 0.45, 0.35]} />
          <meshBasicMaterial color="#ff3300" transparent opacity={0.3} />
        </mesh>
        {/* Warning triangle on top */}
        <mesh position={[0, 1.15, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.25, 0.25, 0.08]} />
          <meshBasicMaterial color="#ffcc00" />
        </mesh>
      </group>
    );
  }

  if (obstacle.type === "BARRIER") {
    // Slide-under obstacle: tall bright red/orange gate
    return (
      <group position={[x, 0, z]}>
        {/* Left pillar */}
        <mesh position={[-1.05, 1.4, 0]}>
          <boxGeometry args={[0.22, 2.8, 0.22]} />
          <meshStandardMaterial color="#cc0000" emissive="#ff0000" emissiveIntensity={0.6} />
        </mesh>
        {/* Right pillar */}
        <mesh position={[1.05, 1.4, 0]}>
          <boxGeometry args={[0.22, 2.8, 0.22]} />
          <meshStandardMaterial color="#cc0000" emissive="#ff0000" emissiveIntensity={0.6} />
        </mesh>
        {/* Top beam */}
        <mesh position={[0, 2.85, 0]}>
          <boxGeometry args={[2.4, 0.22, 0.22]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
        {/* Laser curtain - SLIDE UNDER THIS */}
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[2.0, 2.2, 0.18]} />
          <meshBasicMaterial color="#ff0044" transparent opacity={0.75} />
        </mesh>
        {/* Inner bright core */}
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[1.6, 1.6, 0.1]} />
          <meshBasicMaterial color="#ff4466" transparent opacity={0.55} />
        </mesh>
      </group>
    );
  }

  // DRONE - floating obstacle, dodge sideways
  return (
    <group position={[x, 1.3, z]}>
      {/* Body hexagon */}
      <mesh>
        <cylinderGeometry args={[0.45, 0.35, 0.22, 6]} />
        <meshStandardMaterial color="#220011" metalness={0.95} roughness={0.05} emissive="#ff0033" emissiveIntensity={0.4} />
      </mesh>
      {/* Red menacing eye */}
      <mesh position={[0, 0.0, -0.4]}>
        <sphereGeometry args={[0.15, 10, 10]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      {/* 4 rotor arms */}
      {[[-0.55, 0, -0.55], [0.55, 0, -0.55], [-0.55, 0, 0.55], [0.55, 0, 0.55]].map(([rx, ry, rz], i) => (
        <group key={i} position={[rx, ry as number, rz]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 12]} />
            <meshBasicMaterial color="#ff3300" transparent opacity={0.7} />
          </mesh>
        </group>
      ))}
      {/* Danger ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.055, 8, 24]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  );
}
