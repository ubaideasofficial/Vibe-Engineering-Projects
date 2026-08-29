# Neon Hover Runner — Agent Context

## Project identity

- **Project:** Neon Hover Runner
- **Location:** `3D_Game_Codex/`
- **Platform:** Browser game for desktop and mobile
- **Style:** Original cyberpunk / neon 3D endless runner; no copyrighted assets
- **Goal:** A fast, replayable three-lane hoverboard game that can later be deployed to Vercel.

## Important scope rule

All work for this project must stay inside the `3D_Game_Codex/` folder. Do not create, edit, delete, stage, or commit files from the sibling game folders.

## Tech stack

- Next.js with App Router and TypeScript
- React 18
- Three.js
- `@react-three/fiber` for the 3D scene
- `@react-three/drei` for scene helpers
- CSS in `app/globals.css`

## Current implementation

The first playable slice is implemented:

- Full-screen neon 3D canvas with fog, stars, emissive road lanes, and procedural city buildings.
- A stylized procedural hoverboard rider made from basic 3D geometry.
- Three discrete lanes: left, centre, right.
- Desktop controls:
  - `A` / `ArrowLeft`: move left
  - `D` / `ArrowRight`: move right
  - `Space` / `ArrowUp`: jump
  - `Shift` / `ArrowDown`: slide
- Mobile swipe controls for left, right, jump, and slide.
- Hazard types:
  - Pink barrier: jump over it
  - Yellow overhead gate: slide under it
  - Purple block: change lane to avoid it
- Energy orbs that increase score.
- HUD: score, distance, orb count, multiplier, and velocity.
- Start screen, game-over screen, and restart action.

## Key files

```text
app/layout.tsx                    App metadata and global stylesheet import
app/page.tsx                      Game page entry point
app/globals.css                   Full-screen neon UI and responsive HUD styles
components/game/Game.tsx          UI state, HUD, start/game-over menus
components/game/GameCanvas.tsx    R3F scene, player controls, movement, hazards, scoring
package.json                      Project commands and dependencies
```

## Local development

```powershell
cd 3D_Game_Codex
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

## Validation status

- TypeScript type validation (`npx.cmd tsc --noEmit`) passed.
- `next build` needs a final environment verification. A `caniuse-lite` compatibility issue was repaired by pinning a compatible package version; rerun `npm.cmd run build` after any dependency change.

## Next implementation priorities

1. Make spawning patterns and world recycling more sophisticated and deterministic.
2. Improve performance by using refs/instancing and throttling UI stat updates.
3. Add near-miss feedback, player lean, camera sway, FOV speed response, trails, and particles.
4. Add Shield, Magnet, and Boost power-ups.
5. Add persistent high scores through LocalStorage.
6. Add audio, pause control, volume toggle, and accessibility settings.
7. Optionally add daily seeded challenges and a Vercel KV leaderboard with LocalStorage fallback.
8. Complete production build, README deployment instructions, and Vercel deployment checks.

## Constraints

- Keep the game lightweight and target smooth gameplay on mid-tier devices.
- Prefer procedural geometry, emissive materials, and small/no external assets.
- Use simple AABB-style collision logic; do not add a physics engine unless truly needed.
- Maintain strict TypeScript and keep new work inside this folder.
