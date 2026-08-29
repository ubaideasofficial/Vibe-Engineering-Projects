"use client";

import { useFrame } from "@react-three/fiber";
import { useGameStore } from "@/store/gameStore";
import { Road } from "./Road";
import { PlayerPlaceholder } from "./PlayerPlaceholder";
import { CitySilhouette } from "./CitySilhouette";

export function GameScene() {
  const tick = useGameStore((s) => s.tick);
  const phase = useGameStore((s) => s.phase);

  useFrame((_, delta) => {
    if (phase === "playing") {
      tick(delta);
    }
  });

  return (
    <>
      <Road />
      <CitySilhouette />
      <PlayerPlaceholder />
    </>
  );
}
