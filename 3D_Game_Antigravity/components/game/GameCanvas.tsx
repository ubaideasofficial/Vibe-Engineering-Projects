"use client";

import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGameStore } from "@/lib/store/useGameStore";
import { Player } from "./Player";
import { RoadManager } from "./RoadManager";
import { CityScenery } from "./CityScenery";
import { Obstacles } from "./Obstacles";
import { Collectibles } from "./Collectibles";
import { CameraFollow } from "./CameraFollow";
import { ParticleEffects } from "./ParticleEffects";

function GameLoopTicker() {
  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.04);
    useGameStore.getState().updateFrame(clampedDelta);
  });

  return null;
}

export function GameCanvas() {
  return (
    <div className="w-full h-full absolute inset-0 bg-[#050714] overflow-hidden">
      <Canvas
        camera={{ position: [0, 5.5, 9.0], fov: 72, near: 0.1, far: 350 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]} // Cap DPR at 1.5 for buttery 60fps even on high-DPI retina/4K displays
      >
        {/* Fog pushed further so distant lane markings are visible */}
        <fog attach="fog" args={["#050714", 50, 280]} />

        {/* Brighter lighting so 3D shapes read clearly */}
        <ambientLight color="#ffffff" intensity={1.8} />
        <hemisphereLight color="#00f0ff" groundColor="#050714" intensity={1.0} />
        <directionalLight position={[5, 18, 8]} color="#e0eeff" intensity={2.2} castShadow />
        <directionalLight position={[-8, 12, -10]} color="#ff007f" intensity={1.4} />
        <pointLight position={[0, 4, 0]} color="#00f0ff" intensity={1.5} distance={20} />

        {/* Game Loop Engine */}
        <GameLoopTicker />

        {/* Dynamic 3D Scene Components */}
        <CameraFollow />
        <RoadManager />
        <CityScenery />
        <Player />
        <Obstacles />
        <Collectibles />
        <ParticleEffects />
      </Canvas>
    </div>
  );
}
