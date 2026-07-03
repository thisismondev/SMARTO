import { NextResponse } from "next/server"
import { fetchFuzzySets, fetchRuleBase } from "@/services/fuzzy.service"
import { trapmf, trimf } from "@/lib/fuzzyHelpers"
import { errorResponse, successResponse } from "@/lib/response"
import { FuzzySet } from "@/types/ui/fuzzy"


type RuleBase = {
  id: number
  kode_rule: string
  ph_kategori_id: number
  kelembapan_kategori_id: number
  suhu_kategori_id: number
  nitrogen_kategori_id: number
  output: string
}

type ActiveRule = {
  kode_rule: string
  outputSetName: string
  alpha: number
}

const VARIABLE_ID = {
  PH: 1,
  SUHU: 2,
  KELEMBAPAN: 3,
  NITROGEN: 4,
  OUTPUT_DOSIS: 5,
} as const

function roundNumber(value: number, digit = 2) {
  return Number(value.toFixed(digit))
}

function getMembershipValue(set: FuzzySet, x: number) {
  if (set.mfType === "trapmf") {
    return trapmf(x, set.a, set.b, set.c, set.d)
  }

  if (set.mfType === "trimf") {
    return trimf(x, set.a, set.b, set.d)
  }

  return 0
}

function getInputValueByVariableId(
  variableId: number,
  input: {
    ph: number
    kelembapan: number
    suhu: number
    nitrogen: number
  }
) {
  if (variableId === VARIABLE_ID.PH) return input.ph
  if (variableId === VARIABLE_ID.SUHU) return input.suhu
  if (variableId === VARIABLE_ID.KELEMBAPAN) return input.kelembapan
  if (variableId === VARIABLE_ID.NITROGEN) return input.nitrogen

  return null
}

function getVariableLabel(variableId: number) {
  const labels: Record<number, string> = {
    [VARIABLE_ID.PH]: "pH Tanah",
    [VARIABLE_ID.SUHU]: "Suhu Tanah",
    [VARIABLE_ID.KELEMBAPAN]: "Kelembaban",
    [VARIABLE_ID.NITROGEN]: "Nitrogen",
    [VARIABLE_ID.OUTPUT_DOSIS]: "Dosis Inokulasi Rhizobium",
  }

  return labels[variableId] || "Unknown"
}

function defuzzifyCOG(
  aggregatedOutput: Record<string, number>,
  outputSets: FuzzySet[],
  step = 0.1
) {
  if (outputSets.length === 0) {
    return 0
  }

  let numerator = 0
  let denominator = 0

  const minX = Math.min(...outputSets.map((set) => set.a))
  const maxX = Math.max(...outputSets.map((set) => set.d))

  const totalStep = Math.floor((maxX - minX) / step)

  for (let i = 0; i <= totalStep; i++) {
    const x = minX + i * step

    let aggregatedMu = 0

    outputSets.forEach((set) => {
      const alpha = aggregatedOutput[set.setName] || 0

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

function getFinalCategoryByCrispDose(
  crispDose: number,
  outputSets: FuzzySet[]
) {
  let finalCategory = "-"
  let highestMu = 0

  outputSets.forEach((set) => {
    const mu = getMembershipValue(set, crispDose)

    if (mu > highestMu) {
      highestMu = mu
      finalCategory = set.setName
    }
  })

  return finalCategory
}

function calculatePumpVolume(crispDose: number) {
  // Sesuaikan dengan rumus alat/pompa Anda.
  // Contoh sementara: dosis x 2.
  return Math.round(crispDose * 2)
}

function buildMembershipResponse(
  inputSets: FuzzySet[],
  muMap: Record<number, number>
) {
  return inputSets
    .map((set) => {
      const mu = muMap[set.id] || 0

      return {
        label: `μ ${getVariableLabel(set.variableId)}[${set.setName}]`,
        value: roundNumber(mu),
      }
    })
    .filter((item) => item.value > 0)
}

async function runFuzzyEngine(
  ph: number,
  kelembapan: number,
  suhu: number,
  nitrogen: number
) {
  const allSets = (await fetchFuzzySets()) as FuzzySet[]
  const allRules = (await fetchRuleBase()) as RuleBase[]

  const input = {
    ph,
    kelembapan,
    suhu,
    nitrogen,
  }

  const inputSets = allSets.filter(
    (set) => set.variableId !== VARIABLE_ID.OUTPUT_DOSIS
  )

  const outputSets = allSets.filter(
    (set) => set.variableId === VARIABLE_ID.OUTPUT_DOSIS
  )

  // 1. FUZZIFIKASI
  const muMap: Record<number, number> = {}

  inputSets.forEach((set) => {
    const x = getInputValueByVariableId(set.variableId, input)

    if (x === null) return

    const mu = getMembershipValue(set, x)

    muMap[set.id] = mu
  })

  console.log("=== INPUT SENSOR ===")
  console.log(input)

  console.log("=== HASIL FUZZIFIKASI ===")
  console.log(muMap)

  // 2. INFERENSI RULE
  const activeRules: ActiveRule[] = []

  allRules.forEach((rule) => {
    const muPh = muMap[rule.id] || 0
    const muKel = muMap[rule.id] || 0
    const muSuhu = muMap[rule.id] || 0
    const muNit = muMap[rule.id] || 0

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

  // 3. AGREGASI OUTPUT
  const aggregatedOutput: Record<string, number> = {}

  activeRules.forEach((rule) => {
    const currentAlpha = aggregatedOutput[rule.outputSetName] || 0

    aggregatedOutput[rule.outputSetName] = Math.max(currentAlpha, rule.alpha)
  })

  console.log("=== HASIL AGREGASI OUTPUT ===")
  console.log(aggregatedOutput)

  // 4. DEFUZZIFIKASI
  const crispDose = defuzzifyCOG(aggregatedOutput, outputSets)
  const finalCategory = getFinalCategoryByCrispDose(crispDose, outputSets)
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

    memberships: buildMembershipResponse(inputSets, muMap),

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
        value: finalCategory,
      },
      volume: {
        label: "Volume Pompa",
        value: `${pumpVolume} mL per hektar`,
        Durasi: "Perlu disesuaikan dengan kapasitas pompa dan luas area",
      },
    },
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ph, kelembapan, suhu, nitrogen } = body

    // Validasi input data sensor
    if (
      ph === undefined ||
      kelembapan === undefined ||
      suhu === undefined ||
      nitrogen === undefined ||
      ph === null ||
      kelembapan === null ||
      suhu === null ||
      nitrogen === null
    ) {
      return NextResponse.json(
        { success: false, message: "Parameter sensor tidak lengkap." },
        { status: 400 }
      )
    }

    // Eksekusi kalkulasi fuzzy berdasarkan data sensor
    const result = await runFuzzyEngine(ph, kelembapan, suhu, nitrogen)

    // Kirimkan respon balik ke ESP32 / Perangkat IoT Anda
    return successResponse("Fuzzy engine executed successfully", result, 200)
  } catch (error: any) {
    console.error("Fuzzy API Error: ", error)
    return errorResponse("Terjadi kesalahan pada server", 500, error.message)
  }
}
