# Neon Hover Runner

Browser-based 3D endless runner built with Next.js, TypeScript, React Three Fiber, Drei, and Zustand.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Production verification uses `npm run build`.

## Controls

- `A/D` or arrow keys: change lanes
- `Space` or `ArrowUp`: jump
- `Shift` or `ArrowDown`: slide
- `Escape`: pause/resume
- Mobile: swipe left, right, up, or down

## Design notes

The world uses procedural geometry and bounded recycled entities so the scene stays lightweight. The first release focuses on the core run loop: lane movement, obstacles, collectibles, scoring, powerups, pause, and restart. Daily challenges and leaderboard API integration are reserved for a later milestone.

No copyrighted models, textures, or audio are required; the art direction is generated from primitive geometry and neon materials.