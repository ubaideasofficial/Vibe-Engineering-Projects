"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/store/gameStore";
import { COLORS, laneToX } from "@/lib/constants";

export function PlayerPlaceholder() {
  const groupRef = useRef<THREE.Group>(null);
  const lane = useGameStore((s) => s.lane);
  const phase = useGameStore((s) => s.phase);
  const targetX = laneToX(lane);

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.15
    );

    if (phase === "playing" || phase === "start") {
      groupRef.current.position.y =
        0.6 + Math.sin(state.clock.elapsedTime * 4) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.6, 2]}>
      {/* Hoverboard */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.9, 0.12, 1.6]} />
        <meshStandardMaterial
          color={COLORS.neonCyan}
          emissive={COLORS.neonCyan}
          emissiveIntensity={0.8}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Rider body */}
      <mesh position={[0, 0.35, 0]}>
        <capsuleGeometry args={[0.22, 0.5, 4, 8]} />
        <meshStandardMaterial
          color="#2a1a4a"
          emissive={COLORS.neonMagenta}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Glow trail */}
      <mesh position={[0, -0.1, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 1.2]} />
        <meshBasicMaterial
          color={COLORS.neonCyan}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
