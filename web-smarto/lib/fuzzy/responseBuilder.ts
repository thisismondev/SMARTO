import { FuzzySet } from "./types"
import { VARIABLE_ID, VARIABLE_LABELS } from "./constants"
import { roundNumber } from "./utils"

export function buildMembershipResponse(
  inputSets: FuzzySet[],
  muMap: Record<number, number>,
  outputSets: FuzzySet[],
  aggregatedOutput: Record<string, number>
) {
  // Group input sets by variable_id, ambil mu tertinggi + nama set-nya
  const variableGroups: Record<number, { setName: string; value: number }> = {}

  inputSets.forEach((set) => {
    const mu = muMap[set.id] || 0

    const existing = variableGroups[set.variable_id]

    if (!existing || mu > existing.value) {
      variableGroups[set.variable_id] = {
        setName: set.set_name,
        value: mu,
      }
    }
  })

  const inputMemberships = Object.entries(variableGroups).map(
    ([variableId, data]) => ({
      label: `μ ${VARIABLE_LABELS[Number(variableId)] || "Unknown"}`,
      set: data.setName,
      value: roundNumber(data.value),
    })
  )

  // Output membership: ambil alpha tertinggi dari aggregatedOutput
  let outputSetName = "-"
  let outputAlpha = 0

  outputSets.forEach((set) => {
    const alpha = aggregatedOutput[set.set_name] || 0
    if (alpha > outputAlpha) {
      outputAlpha = alpha
      outputSetName = set.set_name
    }
  })

  const outputMembership = {
    label: `μ ${VARIABLE_LABELS[VARIABLE_ID.OUTPUT_DOSIS]}`,
    set: outputSetName,
    value: roundNumber(outputAlpha),
  }

  return [...inputMemberships, outputMembership]
}
