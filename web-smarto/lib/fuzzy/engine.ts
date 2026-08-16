import { fetchFuzzySets, fetchRuleBase } from "@/services/fuzzy.service"
import { FuzzySet, RuleBase, SensorInput } from "./types"
import { VARIABLE_ID, VARIABLE_LABELS } from "./constants"
import { fuzzifyInputs } from "./membership"
import { evaluateRules, aggregateOutput } from "./inference"
import { defuzzifyCOG, getFinalCategoryByCrispDose } from "./defuzzification"
import { calculatePumpVolume } from "./pumpConversion"
import { buildMembershipResponse } from "./responseBuilder"
import { roundNumber } from "./utils"

export async function runFuzzyEngine(
  ph: number,
  kelembapan: number,
  suhu: number,
  nitrogen: number
) {
  const allSets = (await fetchFuzzySets()) as FuzzySet[]
  const allRules = (await fetchRuleBase()) as RuleBase[]

  const input: SensorInput = {
    ph,
    kelembapan,
    suhu,
    nitrogen,
  }

  const inputSets = allSets.filter(
    (set) => set.variable_id !== VARIABLE_ID.OUTPUT_DOSIS
  )

  console.log("=== FUZZY SETS DEBUG ===")
  inputSets.forEach((set) => {
    console.log(
      `Var ${set.variable_id} (${VARIABLE_LABELS[set.variable_id] || "Unknown"}) - ${set.set_name}: ` +
        `type=${set.mf_type}, a=${set.param_a}, b=${set.param_b}, c=${set.param_c}, d=${set.param_d}`
    )
  })

  const outputSets = allSets.filter(
    (set) => set.variable_id === VARIABLE_ID.OUTPUT_DOSIS
  )

  // 1. FUZZIFIKASI
  console.log("=== INPUT SENSOR ===")
  console.log(input)

  const muMap = fuzzifyInputs(inputSets, input)

  console.log("=== HASIL FUZZIFIKASI ===")
  console.log(muMap)

  // 2. INFERENSI RULE
  const activeRules = evaluateRules(allRules, muMap)

  // 3. AGREGASI OUTPUT
  const aggregatedOutput = aggregateOutput(activeRules)

  // 4. DEFUZZIFIKASI
  const hasActiveRule = activeRules.length > 0
  const crispDose = defuzzifyCOG(aggregatedOutput, outputSets)
  const finalCategory = getFinalCategoryByCrispDose(crispDose, outputSets)
  const kategoriDisplay = hasActiveRule
    ? finalCategory
    : "Tidak Ada Rule Terpicu"
  const pumpVolume = calculatePumpVolume(crispDose)

  console.log("=== HASIL DEFUZZIFIKASI ===")
  console.log({
    method: "Centroid / CoG",
    crispDose,
    finalCategory,
    pumpVolume,
  })

  // 5. RESPONSE SIAP UI
  return {
    input: {
      ph: {
        label: "pH Tanah",
        value: roundNumber(ph, 2),
        unit: "pH",
      },
      kelembapan: {
        label: "Kelembaban",
        value: roundNumber(kelembapan, 2),
        unit: "%",
      },
      suhu: {
        label: "Suhu Tanah",
        value: roundNumber(suhu, 2),
        unit: "°C",
      },
      nitrogen: {
        label: "Nitrogen",
        value: roundNumber(nitrogen, 2),
        unit: "mg/kg",
      },
    },

    memberships: buildMembershipResponse(
      inputSets,
      muMap,
      outputSets,
      aggregatedOutput
    ),

    output: {
      rule: {
        label: "Rule Aktif",
        value: `${activeRules.length} dari ${allRules.length}`,
      },
      defuzzifikasi: {
        label: "Defuzzifikasi",
        value: `${crispDose} g/ha`,
      },
      kategori: {
        label: "Kategori Akhir",
        value: kategoriDisplay,
      },
      volume: {
        label: "Volume Pompa",
        value: `${pumpVolume} mL per hektar`,
        durasi: "Perlu disesuaikan dengan kapasitas pompa dan luas area",
      },
    },
  }
}
