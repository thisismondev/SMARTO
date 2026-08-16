import { FuzzySet } from "./types"
import { getMembershipValue } from "./membership"
import { roundNumber } from "./utils"

export function defuzzifyCOG(
  aggregatedOutput: Record<string, number>,
  outputSets: FuzzySet[],
  step = 0.1
): number {
  if (outputSets.length === 0) {
    return 0
  }

  let numerator = 0
  let denominator = 0

  const minX = Math.min(...outputSets.map((set) => set.param_a))
  const maxX = Math.max(...outputSets.map((set) => set.param_d))

  const totalStep = Math.floor((maxX - minX) / step)

  for (let i = 0; i <= totalStep; i++) {
    const x = minX + i * step

    let aggregatedMu = 0

    outputSets.forEach((set) => {
      const alpha = aggregatedOutput[set.set_name] || 0

      if (alpha <= 0) return

      const originalMu = getMembershipValue(set, x)

      // Implikasi Mamdani: potong output berdasarkan alpha
      const clippedMu = Math.min(alpha, originalMu)

      // Agregasi output: ambil nilai maksimum
      aggregatedMu = Math.max(aggregatedMu, clippedMu)
    })

    numerator += x * aggregatedMu
    denominator += aggregatedMu
  }

  if (denominator === 0) {
    return 0
  }

  return roundNumber(numerator / denominator, 2)
}

export function getFinalCategoryByCrispDose(
  crispDose: number,
  outputSets: FuzzySet[]
): string {
  let finalCategory = "-"
  let highestMu = 0

  outputSets.forEach((set) => {
    const mu = getMembershipValue(set, crispDose)

    if (mu > highestMu) {
      highestMu = mu
      finalCategory = set.set_name
    }
  })

  return finalCategory
}
