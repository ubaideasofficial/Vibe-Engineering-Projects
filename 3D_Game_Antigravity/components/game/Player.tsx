"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/lib/store/useGameStore";
import { GAME_CONSTANTS, LANES } from "@/lib/constants";

export function Player() {
  const rootRef = useRef<THREE.Group>(null);
  const riderRef = useRef<THREE.Group>(null);
  const flameGroupRef = useRef<THREE.Group>(null);

  const currentX = useRef(0);
  const currentRotZ = useRef(0);

  useFrame((state, delta) => {
    if (!rootRef.current) return;

    const store = useGameStore.getState();
    const time = state.clock.getElapsedTime();
    const targetX = LANES[store.laneIndex];

    // Smooth X lane position
    currentX.current = THREE.MathUtils.lerp(currentX.current, targetX, 1 - Math.pow(0.001, delta));
    rootRef.current.position.x = currentX.current;

    // Roll when switching lanes
    const diff = targetX - currentX.current;
    const targetRollZ = -diff * 0.35;
    currentRotZ.current = THREE.MathUtils.lerp(currentRotZ.current, targetRollZ, 12 * delta);
    rootRef.current.rotation.z = currentRotZ.current;

    // Jump arc - parabolic
    let yPos = 0.0;
    if (store.isJumping) {
      yPos = Math.sin(store.jumpProgress * Math.PI) * GAME_CONSTANTS.JUMP_HEIGHT;
    } else if (store.isSliding) {
      yPos = -0.2;
    } else {
      // Gentle hover bob
      yPos = Math.sin(time * 6) * 0.06;
    }
    rootRef.current.position.y = yPos;

    // Rider crouch on slide
    if (riderRef.current) {
      if (store.isSliding) {
        riderRef.current.scale.y = 0.5;
        riderRef.current.position.y = -0.1;
      } else {
        riderRef.current.scale.y = THREE.MathUtils.lerp(riderRef.current.scale.y, 1.0, 10 * delta);
        riderRef.current.position.y = 0;
      }
    }

    // Flame pulse
    if (flameGroupRef.current) {
      const flameScale = store.powerups.boost
        ? 1.6 + Math.sin(time * 25) * 0.3
        : 1.0 + Math.sin(time * 15) * 0.15;
      flameGroupRef.current.scale.z = flameScale;
    }
  });

  const powerups = useGameStore((s) => s.powerups);

  return (
    <group ref={rootRef} position={[0, 0, 0]}>

      {/* ===== HOVERBOARD - Flat cyan glowing plank ===== */}
      {/* Main board body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.1, 2.2]} />
        <meshStandardMaterial
          color={powerups.boost ? "#ffe600" : "#00ccff"}
          emissive={powerups.boost ? "#ffe600" : "#00ccff"}
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Board nose - slightly tilted up at front */}
      <mesh position={[0, 0.04, -1.15]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.3]} />
        <meshStandardMaterial color="#0099cc" emissive="#0099cc" emissiveIntensity={0.6} />
      </mesh>

      {/* Board tail fin */}
      <mesh position={[0, 0.05, 1.15]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.8, 0.08, 0.25]} />
        <meshStandardMaterial color="#0099cc" emissive="#0099cc" emissiveIntensity={0.6} />
      </mesh>

      {/* Left engine pod */}
      <mesh position={[-0.4, -0.05, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.45, 12]} />
        <meshStandardMaterial color="#111122" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Right engine pod */}
      <mesh position={[0.4, -0.05, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.45, 12]} />
        <meshStandardMaterial color="#111122" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Flame exhausts */}
      <group ref={flameGroupRef} position={[0, -0.02, 0.85]}>
        <mesh position={[-0.4, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.55, 10]} />
          <meshBasicMaterial color={powerups.boost ? "#ffe600" : "#00f0ff"} />
        </mesh>
        <mesh position={[0.4, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.55, 10]} />
          <meshBasicMaterial color={powerups.boost ? "#ffe600" : "#00f0ff"} />
        </mesh>
      </group>

      {/* Repulsor glow discs underneath */}
      <mesh position={[-0.3, -0.08, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh position={[0.3, -0.08, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* ===== RIDER - Clear white/grey cylinder body ===== */}
      <group ref={riderRef} position={[0, 0, -0.2]}>
        {/* Legs */}
        <mesh position={[-0.18, 0.25, 0.15]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.18, 0.42, 0.18]} />
          <meshStandardMaterial color="#cccccc" roughness={0.4} />
        </mesh>
        <mesh position={[0.18, 0.25, 0.15]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.18, 0.42, 0.18]} />
          <meshStandardMaterial color="#cccccc" roughness={0.4} />
        </mesh>

        {/* Torso - bright white armored jacket */}
        <mesh position={[0, 0.72, -0.05]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.52, 0.58, 0.32]} />
          <meshStandardMaterial color="#ffffff" emissive="#aaaaff" emissiveIntensity={0.2} metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Chest neon stripe */}
        <mesh position={[0, 0.72, -0.23]}>
          <boxGeometry args={[0.12, 0.5, 0.02]} />
          <meshBasicMaterial color={powerups.boost ? "#ffe600" : "#00f0ff"} />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.35, 0.65, -0.08]} rotation={[0.5, 0, 0.2]}>
          <boxGeometry args={[0.14, 0.38, 0.16]} />
          <meshStandardMaterial color="#dddddd" roughness={0.4} />
        </mesh>
        <mesh position={[0.35, 0.65, -0.08]} rotation={[0.5, 0, -0.2]}>
          <boxGeometry args={[0.14, 0.38, 0.16]} />
          <meshStandardMaterial color="#dddddd" roughness={0.4} />
        </mesh>

        {/* Helmet - rounded, bright */}
        <mesh position={[0, 1.12, -0.08]}>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshStandardMaterial color="#eeeeee" emissive="#aaaacc" emissiveIntensity={0.3} metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Visor - glowing colored strip */}
        <mesh position={[0, 1.12, -0.28]}>
          <boxGeometry args={[0.32, 0.1, 0.06]} />
          <meshBasicMaterial color={powerups.boost ? "#ffe600" : "#00f0ff"} />
        </mesh>

        {/* Helmet fin */}
        <mesh position={[0, 1.3, -0.05]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.04, 0.18, 0.28]} />
          <meshBasicMaterial color="#ff007f" />
        </mesh>
      </group>

      {/* Shield sphere */}
      {powerups.shield && (
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[1.4, 18, 18]} />
          <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.35} />
        </mesh>
      )}

      {/* Magnet ring */}
      {powerups.magnet && (
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.045, 10, 28]} />
          <meshBasicMaterial color="#ff007f" transparent opacity={0.75} />
        </mesh>
      )}
    </group>
  );
}
