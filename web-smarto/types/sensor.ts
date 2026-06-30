export type SensorReading = {
  id: number
  node_id: number
  ph: number
  suhu: number
  kelembapan: number
  nitrogen: number
}


export type FilterType = "day" | "month" | "year"

export const PERIOD_CONFIG = {
  day: {
    interval: "INTERVAL 1 DAY",
    groupBy: "DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00')", // per jam
  },
  month: {
    interval: "INTERVAL 1 MONTH",
    groupBy: "DATE(created_at)", // per hari
  },
  year: {
    interval: "INTERVAL 1 YEAR",
    groupBy: "DATE_FORMAT(created_at, '%Y-%m')", // per bulan
  },
}