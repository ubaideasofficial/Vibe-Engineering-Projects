# AI Agent Instructions: Neon Hover Runner

**ROLE:** 
You are a senior game + web engineer. Build a polished 3D endless runner game that runs in the browser and can be deployed on Vercel with Next.js. The game must be visually attractive (neon/cyberpunk), smooth (60fps target), and instantly fun/addictive (“one more run” loop). Produce a complete working repository.

---

## 1. Project Overview

*   **PROJECT NAME:** Neon Hover Runner (original, no copyrighted assets)
*   **TARGET PLATFORM:** Web (desktop + mobile), deployable on Vercel.
*   **CORE GAME IDEA:** A 3-lane hoverboard endless runner through a neon city. Player dodges obstacles, collects “energy orbs”, gets powerups, speed increases over time, and the run ends on collision unless shield is active.

## 2. Tech Stack (Mandatory)

*   **Framework:** Next.js (App Router) + TypeScript
*   **3D Engine:** react-three-fiber (`@react-three/fiber`) + drei (`@react-three/drei`)
*   **Physics:** Minimal physics; prefer simple AABB collision checks. (If physics is used, use `@react-three/rapier` only).
*   **State Management:** Zustand or minimal React state.
*   **Styling/UI:** Tailwind CSS or simple CSS modules.
*   **Audio:** WebAudio or HTMLAudio with small files.
*   **Leaderboard (Optional/Recommended):** Vercel KV (Upstash). Must include fallback to LocalStorage if KV env vars are not provided.

---

## 3. Visual Art & Camera Direction

*   **Environment:** Cyberpunk neon city at night. Dark base colors (deep blue/purple) with bright emissive cyan/magenta neon accents. Procedural/infinite road with glowing lane lines, side buildings with emissive windows, animated neon billboards, distant parallax silhouettes, and fog for depth.
*   **Lightweight Geometry:** Use instanced meshes for buildings, obstacles, and coins. Avoid heavy textures; if used, keep them tiny and compressed.
*   **Player Character:** Stylized hoverboard + rider (primitives or procedurally created tiny glTF). Procedural animations (hover bobbing, lean on lane switch, jump arc squash/stretch, slide crouch pose). Include a glowing trail and particle sparks.
*   **Camera System:** Third-person smooth damped (lerp) follow camera. Slight FOV increase with speed, subtle sway on lane switch, and brief slow-mo (0.85x for 0.2s) + screen shake + "whoosh" on near-misses. 

---

## 4. Gameplay Mechanics (MVP)

*   **Controls:** 
    *   Desktop: A/D or ArrowLeft/Right (Lane switch), Space/ArrowUp (Jump), Shift/ArrowDown (Slide).
    *   Mobile: Swipe gestures (left/right/up/down).
*   **Lanes & Spawning:** 3 discrete lanes (-1, 0, 1). Infinite procedural generation (recycling road segments). Obstacles spawn ahead with increasing difficulty ramps.
*   **Obstacle Types:** Neon barriers (jump), low gates (slide), drones/blocks (switch lanes).
*   **Collectibles & Scoring:** Energy orbs in arcs/lines. Score = distance + (orbs * multiplier). Multiplier increases with near-misses and streaks; resets on hit.
*   **Game States:** Start Screen -> Playing -> Game Over -> Restart.
*   **UI HUD:** Clean overlay showing Score, Distance, Orbs, Multiplier, Speed Indicator, and a Pause button.

## 5. Additional Features

*   **Powerups:** Shield (one free hit), Magnet (attracts orbs), Boost (speed + invincibility with strong trail).
*   **Daily Challenge (Nice to have):** Deterministic “seeded run” based on the date using a seeded RNG (e.g., `mulberry32`).
*   **Leaderboard API:** `/api/score` (POST) and `/api/leaderboard` (GET). Validate scores to prevent impossible entries.
*   **Audio:** Lightweight background loop, SFX (pickup, whoosh, jump, slide, shield hit, game over), and a volume toggle.

---

## 6. Performance & Code Quality

*   **Performance Target:** Stable 60fps on mid-tier devices. Rely on `InstancedMesh` and emissive materials over complex lighting (1 directional + ambient).
*   **Code Quality:** Strict TypeScript. 
*   **Directory Structure:**
    *   `/app` (Page + layout)
    *   `/components/ui` (HUD, Menus)
    *   `/components/game` (GameCanvas, Player, World, Spawner, Obstacles, Collectibles)
    *   `/lib` (RNG, Constants, Storage, API clients)

## 7. Implementation Plan

1.  **Phase 1 (Scaffold):** Next.js TS app, R3F/drei setup, basic Canvas, and UI overlay.
2.  **Phase 2 (Core Runner):** Lanes, player movement, jump/slide, camera follow, world scrolling illusion, and bounding-box collisions.
3.  **Phase 3 (Spawning + Difficulty):** Procedural spawner with distinct patterns and difficulty scaling.
4.  **Phase 4 (Juice + Visuals):** Neon materials, emissive lines, fog, trails, particles, and near-miss feedback.
5.  **Phase 5 (Mechanics):** Powerups, scoring system, multipliers, and HUD updates.
6.  **Phase 6 (Leaderboard & Polish):** API routes, Vercel KV fallback integration, audio, and Vercel deployment prep.

## 8. Deliverables & Constraints

*   Complete Next.js repo (runnable via `npm install` and `npm run dev`).
*   Must pass `npm run build` and be fully deployable to Vercel.
*   A `README.md` detailing setup, env vars, deployment steps, and "Design Notes" on the difficulty ramp and performance choices.
*   **Strict Constraint:** Do NOT use copyrighted models, textures, or audio. All assets must be CC0 (credited) or procedural. Keep files minimal.

**NOW BUILD IT.** Generate the complete codebase based on these specifications.git