
export async function fetchFuzzyVariables(token: string) {
  try {
    const response = await fetch("/api/fuzzy/variables", {
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



export async function fetchFuzzySets(token: string) {
  try {
    const response = await fetch("/api/fuzzy/sets", {
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

export async function addFuzzySet(
  token: string,
  body: {
    variableId: number
    setName: string
    mfType: string
    a: number
    b: number
    c: number
    d: number
  }
) {
  const response = await fetch("/api/fuzzy/sets/add", {
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