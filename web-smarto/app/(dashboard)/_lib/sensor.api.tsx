import { FilterType } from "@/types/sensor"

export async function findFarmerUser(token: string) {
  try {
    const response = await fetch("/api/user/petani", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal mengambil data petani")
    }

    return result
  } catch {
    throw new Error("Gagal mengambil data petani")
  }
}

export async function findNodesByPetani(token: string, kodeNodeId: number) {
  try {
    const response = await fetch(`/api/user/petani/${kodeNodeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await response.json()

    console.log("API Response for nodes by petani:", result)

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal mengambil data kode node")
    }

    return result
  } catch {
    throw new Error("Gagal mengambil data kode node")
  }
}

export async function findNodeByUserAndKodeNode(
  token: string,
  userId: number,
  kodeNodeId: number
) {
  const response = await fetch(
    `/api/node/lookup?userId=${userId}&kodeNodeId=${kodeNodeId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil data node")
  }

  return result.data
}

export async function fetchSensorLogAnalytics(
  token: string,
  userId: number,
  kodeNodeId: number,
  periode: FilterType
) {
  const params = new URLSearchParams()

  params.append("userId", userId.toString())
  params.append("kodeNodeId", kodeNodeId.toString())
  params.append("periode", periode)

  const response = await fetch(`/api/sensor/statistics?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const result = await response.json()

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Gagal mengambil statistik sensor log")
  }

  return result
}
