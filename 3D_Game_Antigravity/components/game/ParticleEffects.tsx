"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/lib/store/useGameStore";

export function ParticleEffects() {
  const dustRef = useRef<THREE.Points>(null);
  const rainRef = useRef<THREE.Points>(null);
  const boostRef = useRef<THREE.LineSegments>(null);
  const flyingCarsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const DUST_COUNT = 200;
  const RAIN_COUNT = 350;
  const CAR_COUNT = 12;

  // ── Dust / ember particles ────────────────────────
  const [dustPos, dustCol] = useMemo(() => {
    const pos = new Float32Array(DUST_COUNT * 3);
    const col = new Float32Array(DUST_COUNT * 3);
    const cyan = new THREE.Color("#00f0ff");
    const pink = new THREE.Color("#ff007f");
    const gold = new THREE.Color("#ffe600");
    const white = new THREE.Color("#ffffff");
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = Math.random() * 9;
      pos[i * 3 + 2] = -Math.random() * 120;
      const pick = Math.random();
      const c = pick < 0.35 ? cyan : pick < 0.6 ? pink : pick < 0.8 ? gold : white;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  // ── Rain streaks ──────────────────────────────────
  const rainPos = useMemo(() => {
    const pos = new Float32Array(RAIN_COUNT * 3);
    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 18;
      pos[i * 3 + 2] = -Math.random() * 100;
    }
    return pos;
  }, []);

  // ── Boost streak lines ───────────────────────────
  const boostLines = useMemo(() => {
    const STREAKS = 50;
    const lines = new Float32Array(STREAKS * 6);
    for (let i = 0; i < STREAKS; i++) {
      const x = (Math.random() - 0.5) * 18;
      const y = Math.random() * 7;
      const z = -Math.random() * 70;
      lines[i * 6] = x; lines[i * 6 + 1] = y; lines[i * 6 + 2] = z;
      lines[i * 6 + 3] = x; lines[i * 6 + 4] = y; lines[i * 6 + 5] = z - 8;
    }
    return lines;
  }, []);

  // ── Flying cars init ──────────────────────────────
  const carData = useMemo(() => {
    return Array.from({ length: CAR_COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * 60 + (i % 2 === 0 ? -25 : 25),
      y: 12 + Math.random() * 25,
      z: -(Math.random() * 280),
      speed: 15 + Math.random() * 25,
      color: Math.random() > 0.5 ? 0 : 1, // 0=cyan headlights, 1=red
    }));
  }, []);

  useFrame((state, delta) => {
    const store = useGameStore.getState();
    const mv = store.speed * delta;
    const time = state.clock.getElapsedTime();
    const isPlaying = store.gameState === "PLAYING";

    // ── Dust ──
    if (dustRef.current) {
      const arr = dustRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < DUST_COUNT; i++) {
        arr[i * 3 + 2] += (isPlaying ? mv * 1.1 : 0.08);
        if (arr[i * 3 + 2] > 12) {
          arr[i * 3 + 2] -= 120;
          arr[i * 3] = (Math.random() - 0.5) * 24;
          arr[i * 3 + 1] = Math.random() * 9;
        }
        // Float up gently
        arr[i * 3 + 1] += delta * 0.15;
        if (arr[i * 3 + 1] > 9) arr[i * 3 + 1] = 0;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // ── Rain (always falls) ──
    if (rainRef.current) {
      const arr = rainRef.current.geometry.attributes.position.array as Float32Array;
      const fallSpeed = 22 + (isPlaying ? mv * 3 : 0);
      for (let i = 0; i < RAIN_COUNT; i++) {
        arr[i * 3 + 1] -= delta * fallSpeed;
        arr[i * 3 + 2] += isPlaying ? mv * 0.6 : 0;
        if (arr[i * 3 + 1] < -0.5) {
          arr[i * 3] = (Math.random() - 0.5) * 30;
          arr[i * 3 + 1] = 18 + Math.random() * 4;
          arr[i * 3 + 2] = -Math.random() * 100;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // ── Boost streaks ──
    if (boostRef.current && store.powerups.boost) {
      const arr = boostRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 50; i++) {
        arr[i * 6 + 2] += mv * 2.5;
        arr[i * 6 + 5] += mv * 2.5;
        if (arr[i * 6 + 2] > 12) {
          arr[i * 6 + 2] -= 90;
          arr[i * 6 + 5] -= 90;
        }
      }
      boostRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // ── Flying cars ──
    if (flyingCarsRef.current) {
      for (let i = 0; i < CAR_COUNT; i++) {
        const c = carData[i];
        c.z += (isPlaying ? mv : delta * 8) + delta * c.speed;
        if (c.z > 30) c.z -= 310;
        // Gentle altitude undulation
        c.y += Math.sin(time * 0.5 + i * 1.3) * delta * 0.5;

        dummy.position.set(c.x, c.y, c.z);
        dummy.rotation.y = c.x > 0 ? Math.PI : 0;
        dummy.scale.set(2.5, 0.7, 1.2);
        dummy.updateMatrix();
        flyingCarsRef.current.setMatrixAt(i, dummy.matrix);
      }
      flyingCarsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const powerupBoost = useGameStore((s) => s.powerups.boost);

  return (
    <group>
      {/* Ambient Dust / Embers */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={DUST_COUNT} array={dustPos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={DUST_COUNT} array={dustCol} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.13} vertexColors transparent opacity={0.75} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>

      {/* Rain Streaks */}
      <points ref={rainRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={RAIN_COUNT} array={rainPos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#99ccff" transparent opacity={0.4} sizeAttenuation />
      </points>

      {/* Boost Warp Lines */}
      {powerupBoost && (
        <lineSegments ref={boostRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={100} array={boostLines} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color="#ffe600" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
        </lineSegments>
      )}

      {/* Flying Cars in the distance */}
      <instancedMesh ref={flyingCarsRef} args={[undefined as any, undefined as any, CAR_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ff4400" />
      </instancedMesh>

      {/* Flying car headlights (small bright spheres — separate instanced) */}
      <FlyingCarLights carData={carData} />
    </group>
  );
}

// ── Glowing headlights for flying cars ──────────────
function FlyingCarLights({ carData }: { carData: Array<{ x: number; y: number; z: number }> }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    const store = useGameStore.getState();
    const mv = store.gameState === "PLAYING" ? store.speed * delta : delta * 8;
    if (!ref.current) return;
    for (let i = 0; i < carData.length; i++) {
      dummy.position.set(
        carData[i].x + (carData[i].x > 0 ? -1.4 : 1.4),
        carData[i].y,
        carData[i].z
      );
      dummy.scale.set(0.35, 0.35, 0.35);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined as any, undefined as any, carData.length]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  );
}
