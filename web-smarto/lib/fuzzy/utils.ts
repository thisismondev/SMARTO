export function roundNumber(value: number, digit = 2): number {
  return Number(value.toFixed(digit))
}
