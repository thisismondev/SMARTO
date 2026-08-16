// utils/fuzzyHelpers.ts

// Rumus Kurva Trapesium
export function trapmf(
  x: number,
  a: number,
  b: number,
  c: number,
  d: number
): number {
  if (x <= a) return a === b ? 1 : 0
  if (x >= d) return c === d ? 1 : 0
  if (x >= b && x <= c) return 1
  if (x > a && x < b) return (x - a) / (b - a)
  if (x > c && x < d) return (d - x) / (d - c)
  return 0
}

// Rumus Kurva Segitiga
export function trimf(x: number, a: number, b: number, d: number): number {
  if (x <= a || x >= d) return 0
  if (x === b) return 1
  if (x > a && x < b) return (x - a) / (b - a)
  if (x > b && x < d) return (d - x) / (d - b)
  return 0
}
