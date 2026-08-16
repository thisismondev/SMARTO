export const VARIABLE_ID = {
  PH: 1,
  SUHU: 2,
  KELEMBAPAN: 3,
  NITROGEN: 4,
  OUTPUT_DOSIS: 5,
} as const

export const VARIABLE_LABELS: Record<number, string> = {
  [VARIABLE_ID.PH]: "pH Tanah",
  [VARIABLE_ID.SUHU]: "Suhu Tanah",
  [VARIABLE_ID.KELEMBAPAN]: "Kelembaban",
  [VARIABLE_ID.NITROGEN]: "Nitrogen",
  [VARIABLE_ID.OUTPUT_DOSIS]: "Output",
}
