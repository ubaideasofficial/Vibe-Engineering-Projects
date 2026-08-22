"use client";

import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/lib/store/useGameStore";
import { GAME_CONSTANTS, LANES, type LaneIndex } from "@/lib/constants";
import {
  type CollectibleInstance,
  type PowerupType,
  type AABB,
  checkAABBOverlap,
} from "@/lib/physics/collision";
import { createMulberry32, getRandomInt } from "@/lib/rng";

export function Collectibles() {
  const itemsRef = useRef<CollectibleInstance[]>([]);
  const nextSpawnZ = useRef<number>(-25);
  const prngRef = useRef<() => number>(Math.random);
  const [, forceRender] = useState(0);
  const frameCountRef = useRef(0);

  const gameState = useGameStore((s) => s.gameState);
  const gameMode = useGameStore((s) => s.gameMode);
  const dailySeed = useGameStore((s) => s.dailySeed);

  useEffect(() => {
    if (gameState === "PLAYING") {
      prngRef.current = gameMode === "DAILY" ? createMulberry32(dailySeed + 777) : Math.random;
      itemsRef.current = [];
      nextSpawnZ.current = -30;
    }
  }, [gameState, gameMode, dailySeed]);

  useFrame((state, delta) => {
    const store = useGameStore.getState();
    if (store.gameState !== "PLAYING") return;

    const moveDist = store.speed * delta;
    const rng = prngRef.current;
    const playerX = LANES[store.laneIndex];

    let playerY = 0.55;
    if (store.isJumping) {
      playerY += Math.sin(store.jumpProgress * Math.PI) * GAME_CONSTANTS.JUMP_HEIGHT;
    } else if (store.isSliding) {
      playerY = 0.25;
    }

    const playerBox: AABB = {
      minX: playerX - 0.48,
      maxX: playerX + 0.48,
      minY: playerY - 0.35,
      maxY: playerY + 0.95,
      minZ: -0.75,
      maxZ: 0.75,
    };

    // 1. Move collectibles & handle Magnet physics
    for (let i = 0; i < itemsRef.current.length; i++) {
      const item = itemsRef.current[i];
      item.z += moveDist;

      if (store.powerups.magnet && !item.isPowerup && !item.collected) {
        const itemX = LANES[item.lane];
        const dist = Math.hypot(itemX - playerX, item.y - playerY, item.z);
        if (dist < GAME_CONSTANTS.MAGNET_RADIUS) {
          item.z += (0 - item.z) * 12 * delta;
          item.y += (playerY - item.y) * 12 * delta;
        }
      }
    }

    // 2. Spawn collectibles ahead
    while (nextSpawnZ.current > -240) {
      const isPowerup = rng() < 0.12;

      if (isPowerup) {
        const pChoice = rng();
        let pType: PowerupType = "SHIELD";
        if (pChoice < 0.35) pType = "SHIELD";
        else if (pChoice < 0.7) pType = "MAGNET";
        else pType = "BOOST";

        const lane = getRandomInt(0, 2, rng) as LaneIndex;
        itemsRef.current.push({
          id: Math.random().toString(36).slice(2),
          lane,
          z: nextSpawnZ.current,
          y: 0.85,
          isPowerup: true,
          powerupType: pType,
        });

        nextSpawnZ.current -= 28;
      } else {
        const lane = getRandomInt(0, 2, rng) as LaneIndex;
        const count = getRandomInt(3, 5, rng);
        const arc = rng() > 0.55;

        for (let j = 0; j < count; j++) {
          const zOffset = nextSpawnZ.current - j * 3.8;
          const yHeight = arc ? 0.6 + Math.sin((j / (count - 1)) * Math.PI) * 2.0 : 0.7;

          itemsRef.current.push({
            id: Math.random().toString(36).slice(2),
            lane,
            z: zOffset,
            y: yHeight,
            isPowerup: false,
          });
        }

        nextSpawnZ.current -= count * 3.8 + 16;
      }
    }

    // 3. Collision overlap check
    for (let i = 0; i < itemsRef.current.length; i++) {
      const item = itemsRef.current[i];
      if (item.collected) continue;

      const itemX = LANES[item.lane];
      const itemBox: AABB = {
        minX: itemX - 0.42,
        maxX: itemX + 0.42,
        minY: item.y - 0.42,
        maxY: item.y + 0.42,
        minZ: item.z - 0.45,
        maxZ: item.z + 0.45,
      };

      if (checkAABBOverlap(playerBox, itemBox)) {
        item.collected = true;
        if (item.isPowerup && item.powerupType) {
          store.activatePowerup(item.powerupType.toLowerCase() as "shield" | "magnet" | "boost");
        } else {
          store.collectOrb();
        }
      }
    }

    // 4. Cleanup
    itemsRef.current = itemsRef.current.filter((item) => !item.collected && item.z < 15);
    nextSpawnZ.current += moveDist;

    // Force re-render every 2 frames to sync visual positions
    frameCountRef.current++;
    if (frameCountRef.current % 2 === 0) {
      forceRender((n) => n + 1);
    }
  });

  const visible = itemsRef.current.filter((i) => !i.collected && i.z > -200 && i.z < 8);

  return (
    <group>
      {visible.map((item) => (
        <CollectibleVisual key={item.id} item={item} />
      ))}
    </group>
  );
}

function CollectibleVisual({ item }: { item: CollectibleInstance }) {
  const meshRef = useRef<THREE.Group>(null);
  const x = LANES[item.lane];

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 4;
      meshRef.current.rotation.z += delta * 2;
    }
  });

  if (item.isPowerup) {
    let color = "#00f0ff";
    if (item.powerupType === "MAGNET") color = "#ff007f";
    if (item.powerupType === "BOOST") color = "#ffe600";

    return (
      <group position={[x, item.y, item.z]}>
        <group ref={meshRef}>
          <mesh>
            <octahedronGeometry args={[0.42, 0]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.2, 10, 10]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
    );
  }

  // Energy Orb - bright glowing green/yellow
  return (
    <group position={[x, item.y, item.z]}>
      <group ref={meshRef}>
        {/* Main bright orb */}
        <mesh>
          <octahedronGeometry args={[0.28, 0]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
        {/* Inner bright core */}
        <mesh>
          <sphereGeometry args={[0.14, 10, 10]} />
          <meshBasicMaterial color="#ccffcc" />
        </mesh>
      </group>
      {/* Outer glow halo */}
      <mesh>
        <sphereGeometry args={[0.38, 10, 10]} />
        <meshBasicMaterial color="#00ff44" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
