# Neon Hover Runner (Antigravity 3D Game)

**Neon Hover Runner** is an infinite 3D Cyberpunk hoverboard endless runner game built with **Next.js (App Router)**, **TypeScript**, **React Three Fiber (`@react-three/fiber`)**, **Three.js**, **Zustand**, and the **Web Audio API**.

---

## 🎮 Game Features

- **3-Lane High-Speed Action**: Seamless lane switching (`-2.4`, `0`, `+2.4`) with dynamic roll/lean physics.
- **Acrobatic Mechanics**: Parabolic jump arc to clear low obstacles, and crouch-sliding to slide under high laser gates.
- **Procedural Cyberpunk Metropolis**:
  - Modular infinite road recycler with animated neon grid markings and glow rails.
  - 120+ instanced skyscrapers with emissive window matrices rendering in a single draw call.
  - Holographic billboards and ambient neon particle dust.
- **Juice & Game Feel**:
  - Damped 3rd-person follow camera with dynamic FOV speed expansion (65° to 85°).
  - Near-miss detection system granting bonus multipliers, subtle slow-motion, and audio whooshes when skimming obstacles.
  - Screen shake on impacts, powerup triggers, and high-speed crashes.
- **Powerups**:
  - **🛡️ Shield**: Absorbs a fatal collision.
  - **🧲 Magnet**: Magnetically pulls all nearby energy orbs towards the hoverboard.
  - **⚡ Super Boost**: Warp-speed rocket flare, invincibility, and obstacle destruction.
- **Synthesized Web Audio Engine**: Zero external MP3/WAV files! Generates dynamic synthwave basslines, arpeggios, and sound effects in real-time.
- **Daily Challenge Mode**: Deterministic daily seeded run using `Mulberry32` PRNG.
- **Global & Local Leaderboard**: API routes with anti-cheat verification and automatic `localStorage` fallback.

---

## 🕹️ Controls

| Action | Desktop Keys | Mobile Gesture / Buttons |
| :--- | :--- | :--- |
| **Move Left** | `A` or `←` | Swipe Left or Tap `←` |
| **Move Right** | `D` or `→` | Swipe Right or Tap `→` |
| **Jump** | `Space`, `W`, or `↑` | Swipe Up or Tap `↑` |
| **Slide** | `Shift`, `S`, or `↓` | Swipe Down or Tap `↓` |
| **Pause / Resume** | `P` or `Esc` | Pause Button on HUD |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **3D Graphics Engine**: Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- **State Management**: Zustand
- **Audio**: Web Audio API Procedural Synth Engine
- **Styling**: Tailwind CSS + Custom Cyberpunk Glows

---

## 🚀 Running Locally

```bash
# Navigate to this folder
cd 3D_Game_Antigravity

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New Project**.
3. Select your repository: `Vibe-Engineering-Projects`.
4. In the configuration screen, click **Edit** next to **Root Directory** and select:
   ```text
   3D_Game_Antigravity
   ```
5. Click **Deploy**. Vercel will automatically build and publish your 3D game!