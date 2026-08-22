import { NextResponse } from "next/server";

// In-memory fallback for local dev & environments without Vercel KV
const inMemoryScores: Array<{ id: string; name: string; score: number; distance: number; date: string; mode: string }> = [
  { id: "1", name: "CYBER_NINJA", score: 14520, distance: 3420, date: "2026-08-22", mode: "ENDLESS" },
  { id: "2", name: "NEON_VIPER", score: 11840, distance: 2950, date: "2026-08-22", mode: "ENDLESS" },
  { id: "3", name: "GHOST_RUNNER", score: 9240, distance: 2100, date: "2026-08-22", mode: "DAILY" },
  { id: "4", name: "RETRO_GLITCH", score: 7600, distance: 1800, date: "2026-08-22", mode: "ENDLESS" },
  { id: "5", name: "SOLAR_DRIFTER", score: 5400, distance: 1350, date: "2026-08-22", mode: "DAILY" },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, score, distance, mode, seed } = body;

    // Security validation: Prevent impossible score manipulation
    if (typeof score !== "number" || typeof distance !== "number" || score < 0 || distance < 0) {
      return NextResponse.json({ error: "Invalid score data" }, { status: 400 });
    }

    // Maximum theoretical score per meter (distance + max orbs + 8x multiplier) is roughly 25 score/m
    if (distance > 0 && score / distance > 35) {
      return NextResponse.json({ error: "Score verification failed" }, { status: 422 });
    }

    const cleanName = (typeof name === "string" ? name.trim().slice(0, 15) : "ANONYMOUS") || "RUNNER";
    const newEntry = {
      id: Math.random().toString(36).substring(2, 9),
      name: cleanName.toUpperCase(),
      score,
      distance: Math.floor(distance),
      date: new Date().toISOString().slice(0, 10),
      mode: mode || "ENDLESS",
    };

    inMemoryScores.push(newEntry);
    inMemoryScores.sort((a, b) => b.score - a.score);

    // Keep top 50
    if (inMemoryScores.length > 50) {
      inMemoryScores.length = 50;
    }

    const rank = inMemoryScores.findIndex((s) => s.id === newEntry.id) + 1;

    return NextResponse.json({
      success: true,
      rank,
      entry: newEntry,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process score" }, { status: 500 });
  }
}
