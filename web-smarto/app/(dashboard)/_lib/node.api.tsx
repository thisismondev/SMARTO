import { FormUserNode } from "@/types/nodes"

export type UpdateNodePayload = {
  userId: number
  label: string
  lat: string
  lng: string
}

export async function fetchNodes(token: string) {
  try {
    const response = await fetch(`/api/node`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    console.log("Fetch nodes response:", result)

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal mengambil data node")
    }

    return result
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Gagal mengambil data node"
    throw new Error(message)
  }
}

export async function fetchPetani(token: string) {
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

    return result.data
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Gagal mengambil data petani"
    throw new Error(message)
  }
}

export async function checkKodeNode(token: string, kodeNode: string) {
  try {
    const response = await fetch(`/api/kode-node/check-kode/${kodeNode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Kode node tidak valid")
    }

    return result
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Kode node tidak valid"
    throw new Error(message)
  }
}

export async function addNode(token: string, data: FormUserNode) {
  try {
    const response = await fetch("/api/node/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal menambahkan node")
    }

    return result
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Gagal menambahkan node"
    throw new Error(message)
  }
}

export async function useNode(token: string, id: number) {
  try {
    const response = await fetch(`/api/node/${id}/use`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal menggunakan node")
    }

    return result
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Gagal menggunakan node"
    throw new Error(message)
  }
}

export async function releaseNode(token: string, id: number) {
  try {
    const response = await fetch(`/api/node/${id}/release`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal melepaskan node")
    }

    return result
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Gagal melepaskan node"
    throw new Error(message)
  }
}

export async function updateNode(
  token: string,
  id: number,
  data: UpdateNodePayload
) {
  try {
    const response = await fetch(`/api/node/${id}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal memperbarui node")
    }

    return result
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Gagal memperbarui node"
    throw new Error(message)
  }
}
