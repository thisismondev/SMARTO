export type RuleBase = {
  id: number
  kode_rule: string
  phKategoriId: number
  ph: string
  kelembapanKategoriId: number
  kelembapan: string
  suhuKategoriId: number
  suhu: string
  nitrogenKategoriId: number
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
  mfType: string
  a: number
  b: number
  c: number
  d: number
  createdAt: string
}