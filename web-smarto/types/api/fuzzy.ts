export type RuleBaseRequest = {
  kodeRule: string
  ph: number
  kelembapan: number
  suhu: number
  nitrogen: number
  output: number
}

export type DefuzzifikasiResponse = {
  input: ResultInputFuzzy
  memberships: ResultMembershipFuzzy[]
  output: ResultOutputFuzzy
}

export type ResultInputFuzzy = {
  ph: {
    label: string
    value: number
    unit: string
  }
  kelembapan: {
    label: string
    value: number
    unit: string
  }
  suhu: {
    label: string
    value: number
    unit: string
  }
  nitrogen: {
    label: string
    value: number
    unit: string
  }
}

export type ResultMembershipFuzzy = {
  label: string
  value: number
}

export type ResultOutputFuzzy = {
  rule: {
    label: string
    value: string
  }
  defuzzifikasi: {
    label: string
    value: string
  }
  kategori: {
    label: string
    value: string
  }
  volume: {
    label: string
    value: string
    durasi: string
  }
}
