/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Seeded Pseudo-Random Number Generator (Mulberry32)
 * Ensures deterministic tracks for Daily Challenges!
 */
export class SeededRNG {
  private s: number;

  constructor(seed: number | string) {
    this.s = typeof seed === 'string' ? this.hashString(seed) : seed;
  }

  private hashString(str: string): number {
    let hash = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353);
      hash = (hash << 13) | (hash >>> 19);
    }
    return (hash >>> 0) || 123456789;
  }

  public next(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  public range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  public int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  public choice<T>(arr: T[]): T {
    const idx = Math.floor(this.next() * arr.length);
    return arr[idx];
  }

  public chance(prob: number): boolean {
    return this.next() < prob;
  }
}

/**
 * Generate a deterministic seed number from today's date (UTC)
 */
export function getDailySeedString(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
