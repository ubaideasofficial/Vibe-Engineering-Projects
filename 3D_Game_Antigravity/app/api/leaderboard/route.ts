import { NextResponse } from "next/server";

const mockLeaderboard = [
  { id: "1", name: "CYBER_NINJA", score: 14520, distance: 3420, date: "2026-08-22", mode: "ENDLESS" },
  { id: "2", name: "NEON_VIPER", score: 11840, distance: 2950, date: "2026-08-22", mode: "ENDLESS" },
  { id: "3", name: "GHOST_RUNNER", score: 9240, distance: 2100, date: "2026-08-22", mode: "DAILY" },
  { id: "4", name: "RETRO_GLITCH", score: 7600, distance: 1800, date: "2026-08-22", mode: "ENDLESS" },
  { id: "5", name: "SOLAR_DRIFTER", score: 5400, distance: 1350, date: "2026-08-22", mode: "DAILY" },
  { id: "6", name: "LASER_BLADE", score: 4890, distance: 1200, date: "2026-08-22", mode: "ENDLESS" },
  { id: "7", name: "SYNTH_WAVE", score: 3600, distance: 950, date: "2026-08-22", mode: "ENDLESS" },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "ALL";

  let results = [...mockLeaderboard];
  if (mode !== "ALL") {
    results = results.filter((item) => item.mode === mode);
  }

  results.sort((a, b) => b.score - a.score);

  return NextResponse.json({
    leaderboard: results.slice(0, 20),
    totalEntries: results.length,
    timestamp: new Date().toISOString(),
  });
}
