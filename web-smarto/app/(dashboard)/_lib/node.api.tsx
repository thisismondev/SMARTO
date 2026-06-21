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
  } catch (error: any) {
    throw new Error(error.message || "Gagal mengambil data node")
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
  } catch (error: any) {
    throw new Error(error.message || "Gagal mengambil data petani")
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
  } catch (error: any) {
    throw new Error(error.message || "Kode node tidak valid")
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
  } catch (error: any) {
    throw new Error(error.message || "Gagal menambahkan node")
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
  } catch (error: any) {
    throw new Error(error.message || "Gagal menggunakan node")
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
  } catch (error: any) {
    throw new Error(error.message || "Gagal melepaskan node")
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
  } catch (error: any) {
    throw new Error(error.message || "Gagal memperbarui node")
  }
}
