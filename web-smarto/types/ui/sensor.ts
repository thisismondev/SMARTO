export type ParameterSensor = {
  id: number
  nama_parameter: string
  satuan: string | null
}
export type KategoriSensor = {
  id: number
  parameter: string
  kategori: string
  minValue: number
  maxValue: number
  satuan: string | null
}

export type TrendSensorAnalytics = {
  periode: string
  ph: number
  kelembapan: number
  suhu: number
  nitrogen: number
}
