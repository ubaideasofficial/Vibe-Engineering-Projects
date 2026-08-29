"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { COLORS } from "@/lib/constants";
import { GameScene } from "./GameScene";

export function GameCanvas() {
  return (
    <Canvas
      className="h-full w-full"
      shadows={false}
      dpr={[1, 1.5]}
      camera={{ position: [0, 4, 8], fov: 60, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={[COLORS.background]} />
      <fog attach="fog" args={[COLORS.fog, 15, 70]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 12, 5]}
        intensity={0.8}
        color="#c4b5fd"
      />

      <Suspense fallback={null}>
        <GameScene />
      </Suspense>
    </Canvas>
  );
}
