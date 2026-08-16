import { MfType } from "@/types/ui/fuzzy"

export type FuzzySet = {
  id: number
  variable_id: number
  name: string
  set_name: string
  mf_type: MfType
  param_a: number
  param_b: number
  param_c: number
  param_d: number
  createdAt: string
}

export type RuleBase = {
  id: number
  kode_rule: string
  ph_kategori_id: number
  kelembapan_kategori_id: number
  suhu_kategori_id: number
  nitrogen_kategori_id: number
  output: string
}

export type ActiveRule = {
  kode_rule: string
  outputSetName: string
  alpha: number
}

export type SensorInput = {
  ph: number
  kelembapan: number
  suhu: number
  nitrogen: number
}
