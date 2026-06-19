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
  } catch (error) {
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
  } catch (error) {
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

export async function fetchParameterSensor(token: string) {
  try {
    const response = await fetch("/api/sensor/parameter", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await response.json()
    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal mengambil data parameter sensor")
    }
    return result
  } catch (error: any) {
    throw new Error(error.message || "Gagal mengambil data parameter sensor")
  }
}

export async function createParameterSensor(
  token: string,
  namaParameter: string,
  satuan: string | null
) {
  const response = await fetch("/api/sensor/parameter/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ namaParameter, satuan }),
  })

  const result = await response.json()

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Gagal menambahkan parameter sensor")
  }

  return result
}

export async function fetchKategoriSensor(token: string) {
  try {
    const response = await fetch("/api/sensor/kategori", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await response.json()

    console.log("API Response for kategori sensor:", result)
    
    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal mengambil data kategori sensor")
    }
    return result
  } catch (error: any) {
    throw new Error(error.message || "Gagal mengambil data kategori sensor")
  }
}

export async function createKategoriSensor(
  token: string,
  body: {
    parameterId: number
    namaKategori: string
    minValue: number
    maxValue: number
  }
) {
  const response = await fetch("/api/sensor/kategori/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  console.log("Request body for create kategori sensor:", body)

  const result = await response.json()

  console.log("API Response for create kategori sensor:", result)

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Gagal menambahkan kategori sensor")
  }

  return result
}
