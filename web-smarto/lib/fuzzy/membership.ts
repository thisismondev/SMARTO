import { trapmf, trimf } from "@/lib/fuzzyHelpers"
import { FuzzySet, SensorInput } from "./types"

export function getMembershipValue(set: FuzzySet, x: number): number {
  if (set.mf_type === "trimf") {
    return trimf(x, set.param_a, set.param_b, set.param_d)
  }

  return trapmf(x, set.param_a, set.param_b, set.param_c, set.param_d)
}

export function getInputValueByVariableId(
  variableId: number,
  input: SensorInput
): number | null {
  if (variableId === 1) return input.ph
  if (variableId === 2) return input.suhu
  if (variableId === 3) return input.kelembapan
  if (variableId === 4) return input.nitrogen

  return null
}

export function fuzzifyInputs(
  inputSets: FuzzySet[],
  sensorInput: SensorInput
): Record<number, number> {
  const muMap: Record<number, number> = {}

  inputSets.forEach((set) => {
    const x = getInputValueByVariableId(set.variable_id, sensorInput)

    if (x === null) return

    const mu = getMembershipValue(
      {
        ...set,
        param_a: Number(set.param_a),
        param_b: Number(set.param_b),
        param_c: Number(set.param_c),
        param_d: Number(set.param_d),
      },
      x
    )

    console.log({
      id: set.id,
      variable_id: set.variable_id,
      set_name: set.set_name,
      x,
      a: set.param_a,
      b: set.param_b,
      c: set.param_c,
      d: set.param_d,
      mu,
    })

    muMap[set.id] = mu
  })

  return muMap
}
