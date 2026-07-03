import { RuleBaseRequest } from "@/types/api/fuzzy"

export async function fetchRuleBase(token: string) {
  const response = await fetch(`/api/fuzzy/rule-base`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const result = await response.json()

  console.log("API Response for fetching rule base:", result)

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Gagal mengambil data rule base")
  }

  return result
}

export async function createRuleBase(token: string, body: RuleBaseRequest) {
  const response = await fetch(`/api/fuzzy/rule-base/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      kode_rule: body.kodeRule,
      ph_kategori_id: body.ph,
      kelembapan_kategori_id: body.kelembapan,
      suhu_kategori_id: body.suhu,
      nitrogen_kategori_id: body.nitrogen,
      set_output_id: body.output,
    }),
  })

  const result = await response.json()

  console.log("API Response for creating rule base:", result)

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Gagal membuat rule base")
  }

  return result
}

export async function updateRuleBase(
  token: string,
  id: number,
  body: RuleBaseRequest
) {
  const response = await fetch(`/api/fuzzy/rule-base/${id}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      kode_rule: body.kodeRule,
      ph_kategori_id: body.ph,
      kelembapan_kategori_id: body.kelembapan,
      suhu_kategori_id: body.suhu,
      nitrogen_kategori_id: body.nitrogen,
      set_output_id: body.output,
    }),
  })

  const result = await response.json()

  console.log("API Response for updating rule base:", result)

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Gagal memperbarui rule base")
  }

  return result
}
