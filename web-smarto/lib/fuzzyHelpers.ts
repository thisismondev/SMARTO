// utils/fuzzyHelpers.ts

// Rumus Kurva Trapesium
export function trapmf(
  x: number,
  a: number,
  b: number,
  c: number,
  d: number
): number {
  if (x <= a || x >= d) return 0
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

export async function getMembershipValue(
  mfType: string,
  x: number,
  a: number,
  b: number,
  c: number,
  d: number
) {
  if (mfType === "trapmf") {
    return trapmf(x, a, b, c, d)
  }

  if (mfType === "trimf") {
    return trimf(x, a, b, d)
  }

  return 0
}



