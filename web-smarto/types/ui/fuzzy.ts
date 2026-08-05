export type MfType = "trapmf" | "trimf"

export type RuleBase = {
  id: number
  kode_rule: string
  phKategoriId: number
  kelembapanKategoriId: number
  suhuKategoriId: number
  nitrogenKategoriId: number
  outputId: number
  ph: string
  kelembapan: string
  suhu: string
  nitrogen: string
  output: string
}

export type FuzzyVariable = {
  id: number
  name: string
  unit: string
  type: string
  createdAt: string
}

export type FuzzySet = {
  id: number
  variableId: number
  name: string
  setName: string
  mfType: MfType
  a: number
  b: number
  c: number
  d: number
  createdAt: string
}
