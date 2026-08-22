"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/lib/store/useGameStore";
import { GAME_CONSTANTS, LANES } from "@/lib/constants";

export function CameraFollow() {
  const { camera } = useThree();
  const currentX = useRef(0);

  useFrame((_, delta) => {
    const store = useGameStore.getState();
    const targetX = LANES[store.laneIndex];

    let jumpY = 0;
    if (store.isJumping) {
      jumpY = Math.sin(store.jumpProgress * Math.PI) * GAME_CONSTANTS.JUMP_HEIGHT * 0.3;
    }

    // Smooth camera X follow
    currentX.current = THREE.MathUtils.lerp(currentX.current, targetX * 0.3, 8 * delta);

    // Screen shake
    let shakeX = 0, shakeY = 0;
    if (store.screenShake > 0.01) {
      shakeX = (Math.random() - 0.5) * store.screenShake * 0.4;
      shakeY = (Math.random() - 0.5) * store.screenShake * 0.3;
    }

    // Fixed high + far back position so all 3 lanes are visible
    camera.position.set(
      currentX.current + shakeX,
      5.5 + jumpY * 0.2 + shakeY,
      9.0
    );

    // Look ahead down the road - slightly forward of player
    camera.lookAt(currentX.current, 0.5, -8);

    // Dynamic FOV - wider as speed increases
    if ((camera as THREE.PerspectiveCamera).fov !== undefined) {
      const pCam = camera as THREE.PerspectiveCamera;
      const speedRatio = Math.min(1, (store.speed - GAME_CONSTANTS.INITIAL_SPEED) / (GAME_CONSTANTS.MAX_SPEED - GAME_CONSTANTS.INITIAL_SPEED));
      const targetFov = 72 + speedRatio * 14 + (store.powerups.boost ? 10 : 0);
      pCam.fov = THREE.MathUtils.lerp(pCam.fov, targetFov, 4 * delta);
      pCam.updateProjectionMatrix();
    }
  });

  return null;
}
