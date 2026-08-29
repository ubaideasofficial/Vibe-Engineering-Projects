"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type GameStats = { score: number; distance: number; orbs: number; multiplier: number; speed: number };
type Props = { active: boolean; onStats: (stats: GameStats) => void; onGameOver: () => void };
type Item = { lane: number; z: number; type: "jump" | "slide" | "block"; used?: boolean };
const laneX = [-2.3, 0, 2.3];

export function GameCanvas(props: Props) {
  return <Canvas className="canvas" dpr={[1, 1.5]} camera={{ position: [0, 5.5, 9.5], fov: 58 }}>
    <color attach="background" args={["#050316"]} /><fog attach="fog" args={["#050316", 12, 78]} />
    <ambientLight intensity={0.55} color="#7657ff" /><directionalLight position={[4, 10, 6]} intensity={1.6} color="#76e9ff" />
    <StarField /><Runner {...props} />
  </Canvas>;
}

function StarField() {
  const positions = useMemo(() => {
    const points = new Float32Array(900 * 3);
    for (let i = 0; i < points.length; i += 3) {
      points[i] = (Math.random() - 0.5) * 90;
      points[i + 1] = Math.random() * 42 - 4;
      points[i + 2] = -Math.random() * 85;
    }
    return points;
  }, []);
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#9bdfff" size={0.18} sizeAttenuation transparent opacity={0.8} /></points>;
}

function Runner({ active, onStats, onGameOver }: Props) {
  const player = useRef<THREE.Group>(null);
  const lane = useRef(0); const jumping = useRef(0); const sliding = useRef(0); const time = useRef(0); const orbs = useRef(0); const ended = useRef(false);
  const hazards = useMemo<Item[]>(() => Array.from({ length: 12 }, (_, i) => ({ lane: (i * 2) % 3 - 1, z: -24 - i * 13, type: (["jump", "slide", "block"] as const)[i % 3] })), []);
  const energy = useMemo<Item[]>(() => Array.from({ length: 30 }, (_, i) => ({ lane: i % 3 - 1, z: -12 - i * 5.5, type: "block" })), []);

  useEffect(() => {
    const move = (key: string) => {
      if (!active) return;
      if (key === "ArrowLeft" || key.toLowerCase() === "a") lane.current = Math.max(-1, lane.current - 1);
      if (key === "ArrowRight" || key.toLowerCase() === "d") lane.current = Math.min(1, lane.current + 1);
      if (key === "ArrowUp" || key === " ") jumping.current = 0.58;
      if (key === "ArrowDown" || key === "Shift") sliding.current = 0.52;
    };
    const keys = (e: KeyboardEvent) => { if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) e.preventDefault(); move(e.key); };
    let start: { x: number; y: number } | undefined;
    const down = (e: TouchEvent) => { const p = e.changedTouches[0]; start = { x: p.clientX, y: p.clientY }; };
    const up = (e: TouchEvent) => { const p = e.changedTouches[0]; if (!start) return; const dx = p.clientX - start.x; const dy = p.clientY - start.y; move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "ArrowRight" : "ArrowLeft") : (dy > 0 ? "ArrowDown" : "ArrowUp")); };
    window.addEventListener("keydown", keys); window.addEventListener("touchstart", down, { passive: true }); window.addEventListener("touchend", up, { passive: true });
    return () => { window.removeEventListener("keydown", keys); window.removeEventListener("touchstart", down); window.removeEventListener("touchend", up); };
  }, [active]);

  useFrame((state, delta) => {
    if (!player.current) return; const dt = Math.min(delta, .05); const speed = active ? 13 + Math.min(time.current * .15, 9) : 0;
    if (active) {
      time.current += dt; jumping.current = Math.max(0, jumping.current - dt); sliding.current = Math.max(0, sliding.current - dt);
      for (const item of hazards) { item.z += speed * dt; if (item.z > 8) item.z -= 165; if (Math.abs(item.z) < .9 && item.lane === lane.current) { const safe = item.type === "jump" ? jumping.current > .18 : item.type === "slide" ? sliding.current > .12 : false; if (!safe && !ended.current) { ended.current = true; onGameOver(); } } }
      for (const orb of energy) { orb.z += speed * dt; if (orb.z > 8) { orb.z -= 170; orb.used = false; } if (!orb.used && Math.abs(orb.z) < 1.15 && orb.lane === lane.current) { orb.used = true; orbs.current++; } }
      onStats({ score: Math.floor(time.current * 12 + orbs.current * 45), distance: time.current * 9, orbs: orbs.current, multiplier: Math.min(5, 1 + Math.floor(orbs.current / 8)), speed: speed / 13 });
    }
    player.current.position.x = THREE.MathUtils.damp(player.current.position.x, laneX[lane.current + 1], 12, dt);
    player.current.position.y = .7 + Math.sin(state.clock.elapsedTime * 5) * .08 + (jumping.current ? Math.sin(jumping.current / .58 * Math.PI) * 2.5 : 0);
    player.current.scale.y = sliding.current ? .58 : 1;
  });
  return <><Road /><City /><Player ref={player} />{hazards.map((x, i) => <Hazard key={i} {...x} />)}{energy.map((x, i) => !x.used && <Orb key={i} {...x} />)}</>;
}

function Road() { return <group>{Array.from({ length: 19 }, (_, i) => <group key={i} position={[0, -.12, 7 - i * 8]}><mesh><boxGeometry args={[8.5, .15, 7.9]} /><meshStandardMaterial color="#0d1030" metalness={.7} /></mesh>{laneX.map((x) => <mesh key={x} position={[x, .1, 0]}><boxGeometry args={[.06, .035, 7.9]} /><meshBasicMaterial color="#00edff" /></mesh>)}</group>)}</group>; }
function City() { return <group>{Array.from({ length: 24 }, (_, i) => { const side = i % 2 ? -1 : 1; const h = 4 + i % 5 * 2; return <group key={i} position={[side * (6.8 + i % 3), h / 2, -i * 7]}><mesh><boxGeometry args={[2.5 + i % 3, h, 3.5]} /><meshStandardMaterial color="#111337" emissive={i % 3 ? "#120c31" : "#241057"} emissiveIntensity={1.2} /></mesh><mesh position={[-side * 1.3, .5, 1.78]}><planeGeometry args={[.9, .35]} /><meshBasicMaterial color={i % 3 ? "#fb37e8" : "#00e9ff"} /></mesh></group>; })}</group>; }
const Player = forwardRef<THREE.Group>((_, ref) => <group ref={ref}><mesh position={[0, -.2, 0]}><boxGeometry args={[1.35, .16, 2.3]} /><meshStandardMaterial color="#1b2454" emissive="#00bfe8" emissiveIntensity={2.3} metalness={.9} /></mesh><mesh position={[0, .75, 0]}><capsuleGeometry args={[.33, .95, 5, 10]} /><meshStandardMaterial color="#f52cdd" emissive="#50124b" emissiveIntensity={1.6} /></mesh><mesh position={[0, 1.62, .05]}><sphereGeometry args={[.32, 16, 16]} /><meshStandardMaterial color="#d6ecff" emissive="#3aa9ff" emissiveIntensity={1.5} /></mesh><pointLight color="#00e9ff" intensity={5} distance={7} position={[0, 0, 1.5]} /></group>);
function Hazard({ lane, z, type }: Item) { const color = type === "jump" ? "#ff3aa8" : type === "slide" ? "#ffbd3b" : "#a142ff"; const h = type === "slide" ? 2.25 : 1.15; return <group position={[laneX[lane + 1], h / 2, z]}>{type === "slide" ? <><mesh position={[-1.1, 0, 0]}><boxGeometry args={[.16, h, .35]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} /></mesh><mesh position={[1.1, 0, 0]}><boxGeometry args={[.16, h, .35]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} /></mesh><mesh position={[0, h / 2, 0]}><boxGeometry args={[2.35, .16, .35]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} /></mesh></> : <mesh><boxGeometry args={[1.7, h, .65]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.3} /></mesh>}</group>; }
function Orb({ lane, z }: Item) { return <mesh position={[laneX[lane + 1], 1.25, z]}><icosahedronGeometry args={[.27, 2]} /><meshStandardMaterial color="#a8ffff" emissive="#00eaff" emissiveIntensity={4} /></mesh>; }
