"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS, LANE_WIDTH } from "@/lib/constants";
import { useGameStore } from "@/store/gameStore";

const BUILDING_COUNT = 24;
const ROAD_HALF_WIDTH = LANE_WIDTH * 1.5 + 1;

export function CitySilhouette() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const speed = useGameStore((s) => s.speed);
  const phase = useGameStore((s) => s.phase);

  const offsets = useMemo(
    () =>
      Array.from({ length: BUILDING_COUNT }, (_, i) => {
        return -((i / BUILDING_COUNT) * 60 + 5);
      }),
    []
  );

  const layout = useMemo(() => {
    return Array.from({ length: BUILDING_COUNT }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      return {
        x: side * (ROAD_HALF_WIDTH + 2 + (i % 5) * 0.8),
        width: 1.2 + (i % 4) * 0.5,
        height: 3 + (i % 7) * 1.8,
        depth: 1.5 + (i % 3) * 0.7,
      };
    });
  }, []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < BUILDING_COUNT; i++) {
      const b = layout[i];
      dummy.position.set(b.x, b.height / 2, offsets[i]);
      dummy.scale.set(b.width, b.height, b.depth);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [layout, offsets]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh || phase !== "playing") return;

    const dummy = new THREE.Object3D();
    const scroll = speed * delta;

    for (let i = 0; i < BUILDING_COUNT; i++) {
      offsets[i] += scroll;
      if (offsets[i] > 15) offsets[i] -= 70;

      const b = layout[i];
      dummy.position.set(b.x, b.height / 2, offsets[i]);
      dummy.scale.set(b.width, b.height, b.depth);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BUILDING_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={COLORS.building}
        emissive={COLORS.window}
        emissiveIntensity={0.08}
        roughness={0.95}
      />
    </instancedMesh>
  );
}
