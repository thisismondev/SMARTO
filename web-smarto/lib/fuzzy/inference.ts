import { RuleBase, ActiveRule } from "./types"

export function evaluateRules(
  allRules: RuleBase[],
  muMap: Record<number, number>
): ActiveRule[] {
  const activeRules: ActiveRule[] = []

  allRules.forEach((rule) => {
    const muPh = muMap[rule.ph_kategori_id] || 0
    const muKel = muMap[rule.kelembapan_kategori_id] || 0
    const muSuhu = muMap[rule.suhu_kategori_id] || 0
    const muNit = muMap[rule.nitrogen_kategori_id] || 0

    // Operator AND Mamdani menggunakan MIN
    const alpha = Math.min(muPh, muKel, muSuhu, muNit)

    console.log(
      `Rule ${rule.kode_rule}: muPh=${muPh}, muKel=${muKel}, muSuhu=${muSuhu}, muNit=${muNit}, alpha=${alpha}, output=${rule.output}`
    )

    if (alpha > 0) {
      activeRules.push({
        kode_rule: rule.kode_rule,
        outputSetName: rule.output,
        alpha,
      })
    }
  })

  console.log("=== ATURAN YANG TERPICU / AKTIF ===")
  console.log(activeRules)

  return activeRules
}

export function aggregateOutput(
  activeRules: ActiveRule[]
): Record<string, number> {
  const aggregatedOutput: Record<string, number> = {}

  activeRules.forEach((rule) => {
    const currentAlpha = aggregatedOutput[rule.outputSetName] || 0
    aggregatedOutput[rule.outputSetName] = Math.max(currentAlpha, rule.alpha)
  })

  console.log("=== HASIL AGREGASI OUTPUT ===")
  console.log(aggregatedOutput)

  return aggregatedOutput
}
