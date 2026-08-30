// Mulberry32 deterministic seeded PRNG
export function createMulberry32(seed: number) {
  let s = seed >>> 0;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Convert a date string (YYYY-MM-DD) into a numerical 32-bit seed
export function getDailySeed(dateStr?: string): number {
  const d = dateStr ? new Date(dateStr) : new Date();
  const dateKey = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    const char = dateKey.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) + 1337;
}

export function getRandomArbitrary(min: number, max: number, rng: () => number = Math.random) {
  return rng() * (max - min) + min;
}

export function getRandomInt(min: number, max: number, rng: () => number = Math.random) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(rng() * (max - min + 1)) + min;
}
