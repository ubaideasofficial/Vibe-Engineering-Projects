"use client";

import React, { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/lib/store/useGameStore";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const SCENE_DEPTH = 320;
const BUILDING_COUNT = 60;
const TREE_COUNT = 40;
const LAMP_COUNT = 30;

// ─────────────────────────────────────────────
// Instanced Window Lights on buildings
// ─────────────────────────────────────────────
function WindowLights({
  count,
  buildingData,
  side,
}: {
  count: number;
  buildingData: Array<{ x: number; z: number; w: number; h: number; d: number }>;
  side: "left" | "right";
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const windowData = useMemo(() => {
    const wins: Array<{ bx: number; bz: number; bh: number; wx: number; wz: number; wy: number; lit: boolean }> = [];
    for (const b of buildingData) {
      const cols = Math.floor(b.w / 2.5);
      const rows = Math.floor(b.h / 3.5);
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          wins.push({
            bx: b.x,
            bz: b.z,
            bh: b.h,
            wx: b.x + (c - cols / 2 + 0.5) * 2.4,
            wz: side === "left" ? b.z + b.d / 2 + 0.15 : b.z - b.d / 2 - 0.15,
            wy: 2 + r * 3.5,
            lit: Math.random() > 0.3,
          });
        }
      }
    }
    return wins;
  }, [buildingData, side]);

  const winCount = Math.min(windowData.length, 600);

  useLayoutEffect(() => {
    if (!ref.current) return;
    for (let i = 0; i < winCount; i++) {
      const w = windowData[i];
      dummy.position.set(w.wx, w.wy, w.wz);
      dummy.scale.set(0.9, 1.2, 0.1);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [windowData, winCount, dummy]);

  // Animate slowly (random flicker)
  const frameRef = useRef(0);
  useFrame((_, delta) => {
    frameRef.current += delta;
    if (frameRef.current < 0.3) return;
    frameRef.current = 0;
    if (!ref.current) return;
    const idx = Math.floor(Math.random() * winCount);
    const w = windowData[idx];
    w.lit = !w.lit;
    dummy.position.set(w.wx, w.wy, w.wz);
    dummy.scale.set(0.9, 1.2, w.lit ? 0.1 : 0.001);
    dummy.updateMatrix();
    ref.current.setMatrixAt(idx, dummy.matrix);
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined as any, undefined as any, winCount]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color={side === "left" ? "#fffacc" : "#ccf0ff"}
      />
    </instancedMesh>
  );
}

// ─────────────────────────────────────────────
// Main CityScenery
// ─────────────────────────────────────────────
export function CityScenery() {
  const buildingLeftRef = useRef<THREE.InstancedMesh>(null);
  const buildingRightRef = useRef<THREE.InstancedMesh>(null);
  const treeTrunkRef = useRef<THREE.InstancedMesh>(null);
  const treeCanopyRef = useRef<THREE.InstancedMesh>(null);
  const lampPostRef = useRef<THREE.InstancedMesh>(null);
  const lampHeadRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // ── Building Data ──────────────────────────
  const { leftBuildings, rightBuildings } = useMemo(() => {
    const left = [];
    const right = [];
    for (let i = 0; i < BUILDING_COUNT; i++) {
      const h = 18 + Math.random() * 70;
      left.push({
        x: -(10 + Math.random() * 30),
        z: -(Math.random() * SCENE_DEPTH),
        w: 6 + Math.random() * 10,
        h,
        d: 7 + Math.random() * 10,
      });
      const hr = 18 + Math.random() * 70;
      right.push({
        x: 10 + Math.random() * 30,
        z: -(Math.random() * SCENE_DEPTH),
        w: 6 + Math.random() * 10,
        h: hr,
        d: 7 + Math.random() * 10,
      });
    }
    return { leftBuildings: left, rightBuildings: right };
  }, []);

  // ── Tree Data ─────────────────────────────
  const treeData = useMemo(() => {
    const trees = [];
    for (let i = 0; i < TREE_COUNT; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      trees.push({
        x: side * (5.5 + Math.random() * 3.5),
        z: -(Math.random() * SCENE_DEPTH),
        h: 3.5 + Math.random() * 3.5,
        r: 1.4 + Math.random() * 1.2,
      });
    }
    return trees;
  }, []);

  // ── Lamp Post Data ────────────────────────
  const lampData = useMemo(() => {
    const lamps = [];
    for (let i = 0; i < LAMP_COUNT; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      lamps.push({
        x: side * 5.0,
        z: -(i * (SCENE_DEPTH / LAMP_COUNT)),
      });
    }
    return lamps;
  }, []);

  // ── Instanced Mesh Init ────────────────────
  useLayoutEffect(() => {
    // Buildings Left
    if (buildingLeftRef.current) {
      leftBuildings.forEach((b, i) => {
        dummy.position.set(b.x, b.h / 2, b.z);
        dummy.scale.set(b.w, b.h, b.d);
        dummy.updateMatrix();
        buildingLeftRef.current!.setMatrixAt(i, dummy.matrix);
      });
      buildingLeftRef.current.instanceMatrix.needsUpdate = true;
    }
    // Buildings Right
    if (buildingRightRef.current) {
      rightBuildings.forEach((b, i) => {
        dummy.position.set(b.x, b.h / 2, b.z);
        dummy.scale.set(b.w, b.h, b.d);
        dummy.updateMatrix();
        buildingRightRef.current!.setMatrixAt(i, dummy.matrix);
      });
      buildingRightRef.current.instanceMatrix.needsUpdate = true;
    }
    // Tree Trunks
    if (treeTrunkRef.current) {
      treeData.forEach((t, i) => {
        dummy.position.set(t.x, t.h / 2, t.z);
        dummy.scale.set(0.28, t.h, 0.28);
        dummy.updateMatrix();
        treeTrunkRef.current!.setMatrixAt(i, dummy.matrix);
      });
      treeTrunkRef.current.instanceMatrix.needsUpdate = true;
    }
    // Tree Canopies
    if (treeCanopyRef.current) {
      treeData.forEach((t, i) => {
        dummy.position.set(t.x, t.h + t.r * 0.7, t.z);
        dummy.scale.set(t.r * 2, t.r * 2.4, t.r * 2);
        dummy.updateMatrix();
        treeCanopyRef.current!.setMatrixAt(i, dummy.matrix);
      });
      treeCanopyRef.current.instanceMatrix.needsUpdate = true;
    }
    // Lamp Posts
    if (lampPostRef.current) {
      lampData.forEach((l, i) => {
        dummy.position.set(l.x, 3.0, l.z);
        dummy.scale.set(0.18, 6.0, 0.18);
        dummy.updateMatrix();
        lampPostRef.current!.setMatrixAt(i, dummy.matrix);
      });
      lampPostRef.current.instanceMatrix.needsUpdate = true;
    }
    // Lamp Heads
    if (lampHeadRef.current) {
      lampData.forEach((l, i) => {
        dummy.position.set(l.x + (l.x < 0 ? 0.5 : -0.5), 6.2, l.z);
        dummy.scale.set(0.8, 0.22, 0.5);
        dummy.updateMatrix();
        lampHeadRef.current!.setMatrixAt(i, dummy.matrix);
      });
      lampHeadRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [leftBuildings, rightBuildings, treeData, lampData, dummy]);

  // ── Scene Scroll ──────────────────────────
  useFrame((_, delta) => {
    const store = useGameStore.getState();
    if (store.gameState !== "PLAYING") return;
    const mv = store.speed * delta;

    const scroll = (ref: React.RefObject<THREE.InstancedMesh>, data: Array<{ x: number; z: number; [key: string]: any }>, yFn: (d: any) => number, scaleFn: (d: any) => [number, number, number]) => {
      if (!ref.current) return;
      for (let i = 0; i < data.length; i++) {
        data[i].z += mv;
        if (data[i].z > 30) data[i].z -= SCENE_DEPTH;
        dummy.position.set(data[i].x, yFn(data[i]), data[i].z);
        const s = scaleFn(data[i]);
        dummy.scale.set(s[0], s[1], s[2]);
        dummy.updateMatrix();
        ref.current.setMatrixAt(i, dummy.matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
    };

    scroll(buildingLeftRef, leftBuildings, (b) => b.h / 2, (b) => [b.w, b.h, b.d]);
    scroll(buildingRightRef, rightBuildings, (b) => b.h / 2, (b) => [b.w, b.h, b.d]);
    scroll(treeTrunkRef, treeData, (t) => t.h / 2, (_t) => [0.28, _t.h, 0.28]);
    scroll(treeCanopyRef, treeData, (t) => t.h + t.r * 0.7, (t) => [t.r * 2, t.r * 2.4, t.r * 2]);
    scroll(lampPostRef, lampData, (_) => 3.0, (_) => [0.18, 6.0, 0.18]);
    scroll(lampHeadRef, lampData, (_) => 6.2, (l) => [0.8, 0.22, 0.5]);
  });

  return (
    <group>
      {/* ── Sky Gradient Backdrop ── */}
      <Sky />

      {/* ── Distant Mountains ── */}
      <Mountains />

      {/* ── Ground Plane extending wide ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, -80]} receiveShadow>
        <planeGeometry args={[200, 400]} />
        <meshStandardMaterial color="#1a2e1a" roughness={1} />
      </mesh>

      {/* ── Sidewalks ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.5, -0.05, -80]}>
        <planeGeometry args={[3.5, 400]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.5, -0.05, -80]}>
        <planeGeometry args={[3.5, 400]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.9} />
      </mesh>

      {/* ── Kerb / Curbs ── */}
      <mesh position={[-4.05, 0.04, -80]}>
        <boxGeometry args={[0.3, 0.12, 400]} />
        <meshStandardMaterial color="#888899" roughness={0.7} />
      </mesh>
      <mesh position={[4.05, 0.04, -80]}>
        <boxGeometry args={[0.3, 0.12, 400]} />
        <meshStandardMaterial color="#888899" roughness={0.7} />
      </mesh>

      {/* ── Buildings ── */}
      <instancedMesh ref={buildingLeftRef} args={[undefined as any, undefined as any, BUILDING_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a2030" roughness={0.4} metalness={0.7} emissive="#001133" emissiveIntensity={0.3} />
      </instancedMesh>
      <instancedMesh ref={buildingRightRef} args={[undefined as any, undefined as any, BUILDING_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#201020" roughness={0.4} metalness={0.7} emissive="#110022" emissiveIntensity={0.3} />
      </instancedMesh>

      {/* ── Window Lights ── */}
      <WindowLights count={BUILDING_COUNT} buildingData={leftBuildings} side="left" />
      <WindowLights count={BUILDING_COUNT} buildingData={rightBuildings} side="right" />

      {/* ── Tree Trunks ── */}
      <instancedMesh ref={treeTrunkRef} args={[undefined as any, undefined as any, TREE_COUNT]}>
        <cylinderGeometry args={[1, 1, 1, 7]} />
        <meshStandardMaterial color="#4a2e1a" roughness={1} />
      </instancedMesh>

      {/* ── Tree Canopies (pine cone shape) ── */}
      <instancedMesh ref={treeCanopyRef} args={[undefined as any, undefined as any, TREE_COUNT]}>
        <coneGeometry args={[1, 1.6, 7]} />
        <meshStandardMaterial color="#1a4a1a" roughness={0.9} emissive="#004400" emissiveIntensity={0.2} />
      </instancedMesh>

      {/* ── Street Lamp Posts ── */}
      <instancedMesh ref={lampPostRef} args={[undefined as any, undefined as any, LAMP_COUNT]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color="#334455" metalness={0.9} roughness={0.2} />
      </instancedMesh>

      {/* ── Street Lamp Heads (glowing warm) ── */}
      <instancedMesh ref={lampHeadRef} args={[undefined as any, undefined as any, LAMP_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffe8a0" />
      </instancedMesh>

      {/* ── Lamp Light Cones (point glow patches on ground) ── */}
      <LampGlows lampData={lampData} />
    </group>
  );
}

// ─────────────────────────────────────────────
// Sky — gradient dome with stars
// ─────────────────────────────────────────────
function Sky() {
  const starsRef = useRef<THREE.Points>(null);
  const STAR_COUNT = 300;

  const [starPos] = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      const r = 250 + Math.random() * 50;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) + 20;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.002;
    }
  });

  return (
    <group>
      {/* Sky dome */}
      <mesh position={[0, -10, -80]}>
        <sphereGeometry args={[300, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshBasicMaterial color="#050d1a" side={THREE.BackSide} />
      </mesh>

      {/* Horizon glow — warm sunset band */}
      <mesh position={[0, 2, -220]}>
        <planeGeometry args={[600, 30]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 14, -222]}>
        <planeGeometry args={[600, 18]} />
        <meshBasicMaterial color="#ff2266" transparent opacity={0.2} />
      </mesh>

      {/* Moon */}
      <mesh position={[60, 80, -240]}>
        <sphereGeometry args={[12, 16, 16]} />
        <meshBasicMaterial color="#eeeedd" />
      </mesh>
      {/* Moon glow halo */}
      <mesh position={[60, 80, -241]}>
        <circleGeometry args={[20, 20]} />
        <meshBasicMaterial color="#aaaaff" transparent opacity={0.12} />
      </mesh>

      {/* Stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={STAR_COUNT} array={starPos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.8} color="#ffffff" transparent opacity={0.85} sizeAttenuation={true} />
      </points>
    </group>
  );
}

// ─────────────────────────────────────────────
// Mountains — layered silhouettes in distance
// ─────────────────────────────────────────────
function Mountains() {
  const peaks = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      x: (i - 9) * 30 + (Math.random() - 0.5) * 18,
      z: -(190 + Math.random() * 40),
      h: 40 + Math.random() * 80,
      r: 18 + Math.random() * 22,
    }));
  }, []);

  const peaks2 = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      x: (i - 7) * 34 + (Math.random() - 0.5) * 16,
      z: -(230 + Math.random() * 30),
      h: 25 + Math.random() * 50,
      r: 22 + Math.random() * 18,
    }));
  }, []);

  return (
    <group>
      {/* Far mountains - dark blue silhouette */}
      {peaks2.map((p, i) => (
        <mesh key={`fm${i}`} position={[p.x, p.h / 2 - 2, p.z]}>
          <coneGeometry args={[p.r, p.h, 5]} />
          <meshBasicMaterial color="#0a0f1a" />
        </mesh>
      ))}
      {/* Near mountains - slightly lighter */}
      {peaks.map((p, i) => (
        <mesh key={`nm${i}`} position={[p.x, p.h / 2 - 2, p.z]}>
          <coneGeometry args={[p.r, p.h, 5]} />
          <meshBasicMaterial color="#101825" />
        </mesh>
      ))}
      {/* Snow caps on taller peaks */}
      {peaks.filter((p) => p.h > 80).map((p, i) => (
        <mesh key={`sc${i}`} position={[p.x, p.h - 4, p.z]}>
          <coneGeometry args={[p.r * 0.25, p.h * 0.15, 5]} />
          <meshBasicMaterial color="#e8eef5" />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// Lamp glow patches on the sidewalk
// ─────────────────────────────────────────────
function LampGlows({ lampData }: { lampData: Array<{ x: number; z: number }> }) {
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!glowRef.current) return;
    lampData.forEach((l, i) => {
      dummy.position.set(l.x, 0.01, l.z);
      dummy.rotation.x = -Math.PI / 2;
      dummy.scale.set(2.5, 2.5, 1);
      dummy.updateMatrix();
      glowRef.current!.setMatrixAt(i, dummy.matrix);
    });
    glowRef.current.instanceMatrix.needsUpdate = true;
  }, [lampData, dummy]);

  useFrame((_, delta) => {
    const store = useGameStore.getState();
    if (store.gameState !== "PLAYING") return;
    const mv = store.speed * delta;
    if (!glowRef.current) return;
    for (let i = 0; i < lampData.length; i++) {
      lampData[i].z += mv;
      if (lampData[i].z > 30) lampData[i].z -= SCENE_DEPTH;
      dummy.position.set(lampData[i].x, 0.01, lampData[i].z);
      dummy.rotation.x = -Math.PI / 2;
      dummy.scale.set(2.5, 2.5, 1);
      dummy.updateMatrix();
      glowRef.current.setMatrixAt(i, dummy.matrix);
    }
    glowRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={glowRef} args={[undefined as any, undefined as any, LAMP_COUNT]}>
      <circleGeometry args={[1, 12]} />
      <meshBasicMaterial color="#ffe8a0" transparent opacity={0.18} />
    </instancedMesh>
  );
}
