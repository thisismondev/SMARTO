export async function findKodeNodes(token: string) {
  try {
    const response = await fetch("/api/kode-node", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    console.log("kode-node response:", result)

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal mengambil data kode-node")
    }

    return result
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data kode-node"
    )
  }
}

export async function generateKodeNode(token: string) {
  try {
    const response = await fetch("/api/kode-node/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    console.log("API Response for generating kode-node:", result)

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal membuat kode node")
    }

    return result
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Gagal menghasilkan kode-node"
    )
  }
}

export async function kodeNodeActivate(token: string, id: number) {
  try {
    const response = await fetch(`/api/kode-node/${id}/activeCode`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    console.log("API Response for activating kode-node:", result)

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal mengaktifkan kode node")
    }

    return result
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengaktifkan kode-node"
    )
  }
}

export async function kodeNodeInactivate(token: string, id: number) {
  try {
    const response = await fetch(`/api/kode-node/${id}/inactiveCode`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    console.log("API Response for inactivating kode-node:", result)

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal menonaktifkan kode node")
    }

    return result
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Gagal menonaktifkan kode-node"
    )
  }
}
