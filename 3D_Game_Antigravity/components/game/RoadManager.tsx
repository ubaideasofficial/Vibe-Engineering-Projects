"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/lib/store/useGameStore";
import { GAME_CONSTANTS } from "@/lib/constants";

const SEG = GAME_CONSTANTS.SEGMENT_LENGTH;
const VISIBLE = GAME_CONSTANTS.VISIBLE_SEGMENTS;

export function RoadManager() {
  const roadGroup = useRef<THREE.Group>(null);
  const dashGroup = useRef<THREE.Group>(null);

  const initZ = useMemo<number[]>(() => {
    const list: number[] = [];
    for (let i = 0; i < VISIBLE; i++) list.push(-i * SEG);
    return list;
  }, []);

  const segZ = useRef<number[]>([...initZ]);

  // Dashed centre-line markers — each segment has 3 dashes
  const dashData = useMemo(() => {
    const dashes: Array<{ segIdx: number; localZ: number; lane: number }> = [];
    for (let i = 0; i < VISIBLE; i++) {
      for (let d = 0; d < 3; d++) {
        const localZ = -(d * (SEG / 3)) - SEG / 6;
        // Two dividers: at x=-1.3 and x=+1.3
        dashes.push({ segIdx: i, localZ, lane: 0 }); // left divider dash
        dashes.push({ segIdx: i, localZ, lane: 1 }); // right divider dash
      }
    }
    return dashes;
  }, []);

  const dashZ = useRef<number[]>(dashData.map((d) => initZ[d.segIdx] + d.localZ));

  useFrame((_, delta) => {
    const store = useGameStore.getState();
    if (store.gameState !== "PLAYING") return;
    const mv = store.speed * delta;
    const total = VISIBLE * SEG;

    // Scroll road segments
    for (let i = 0; i < segZ.current.length; i++) {
      segZ.current[i] += mv;
      if (segZ.current[i] > SEG) segZ.current[i] -= total;
    }
    if (roadGroup.current) {
      roadGroup.current.children.forEach((child, i) => {
        child.position.z = segZ.current[i];
      });
    }

    // Scroll dashes
    for (let i = 0; i < dashZ.current.length; i++) {
      dashZ.current[i] += mv;
      if (dashZ.current[i] > SEG) dashZ.current[i] -= total;
    }
    if (dashGroup.current) {
      dashGroup.current.children.forEach((child, i) => {
        child.position.z = dashZ.current[i];
      });
    }
  });

  return (
    <group>
      {/* ── Road Segments ──────────────────────────── */}
      <group ref={roadGroup}>
        {initZ.map((pos, idx) => (
          <group key={idx} position={[0, 0, pos]}>
            {/* Main asphalt — dark grey realistic */}
            <mesh receiveShadow>
              <boxGeometry args={[8.2, 0.08, SEG]} />
              <meshStandardMaterial color="#1c1c22" roughness={0.92} metalness={0.05} />
            </mesh>

            {/* Road surface texture overlay — subtle grid */}
            <mesh position={[0, 0.045, 0]}>
              <planeGeometry args={[8.0, SEG, 8, 20]} />
              <meshBasicMaterial color="#22222a" wireframe transparent opacity={0.18} />
            </mesh>

            {/* Solid white outer lane lines */}
            <mesh position={[-3.85, 0.05, 0]}>
              <boxGeometry args={[0.12, 0.01, SEG]} />
              <meshBasicMaterial color="#ddddcc" />
            </mesh>
            <mesh position={[3.85, 0.05, 0]}>
              <boxGeometry args={[0.12, 0.01, SEG]} />
              <meshBasicMaterial color="#ddddcc" />
            </mesh>

            {/* Neon cyan lane dividers (solid lines) */}
            <mesh position={[-1.3, 0.05, 0]}>
              <boxGeometry args={[0.07, 0.01, SEG]} />
              <meshBasicMaterial color="#00e5ff" />
            </mesh>
            <mesh position={[1.3, 0.05, 0]}>
              <boxGeometry args={[0.07, 0.01, SEG]} />
              <meshBasicMaterial color="#00e5ff" />
            </mesh>

            {/* Glowing side rails */}
            <mesh position={[-4.25, 0.22, 0]}>
              <boxGeometry args={[0.22, 0.45, SEG]} />
              <meshStandardMaterial color="#0a0a12" metalness={0.9} roughness={0.2} emissive="#ff007f" emissiveIntensity={0.55} />
            </mesh>
            <mesh position={[4.25, 0.22, 0]}>
              <boxGeometry args={[0.22, 0.45, SEG]} />
              <meshStandardMaterial color="#0a0a12" metalness={0.9} roughness={0.2} emissive="#ff007f" emissiveIntensity={0.55} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── Dashed white lane separators ──────────────── */}
      <group ref={dashGroup}>
        {dashData.map((d, i) => {
          const xPos = d.lane === 0 ? -1.3 : 1.3;
          return (
            <mesh key={i} position={[xPos, 0.055, dashZ.current[i]]}>
              <boxGeometry args={[0.07, 0.01, SEG / 6 - 0.4]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
