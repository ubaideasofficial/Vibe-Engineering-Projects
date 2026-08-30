"use client";

import { COLORS, LANE_WIDTH } from "@/lib/constants";

const ROAD_LENGTH = 80;
const SEGMENT_COUNT = 8;

export function Road() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -ROAD_LENGTH / 2 + 10]}>
        <planeGeometry args={[LANE_WIDTH * 3 + 2, ROAD_LENGTH]} />
        <meshStandardMaterial color={COLORS.road} roughness={0.9} metalness={0.1} />
      </mesh>

      {[-1, 0, 1].map((lane) =>
        Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
          <mesh
            key={`${lane}-${i}`}
            position={[
              lane * LANE_WIDTH - LANE_WIDTH / 2,
              0.02,
              10 - i * (ROAD_LENGTH / SEGMENT_COUNT),
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.08, ROAD_LENGTH / SEGMENT_COUNT / 2]} />
            <meshStandardMaterial
              color={COLORS.laneLine}
              emissive={COLORS.laneLine}
              emissiveIntensity={1.2}
            />
          </mesh>
        ))
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -ROAD_LENGTH / 2 + 10]}>
        <planeGeometry args={[0.15, ROAD_LENGTH]} />
        <meshStandardMaterial
          color={COLORS.neonMagenta}
          emissive={COLORS.neonMagenta}
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}
