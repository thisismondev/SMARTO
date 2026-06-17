export async function findUsers(token: String) {
  try {
    const response = await fetch("/api/user", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    console.log("API Response for users:", result)

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal mengambil data pengguna")
    }
    return result
  } catch (error: any) {
    throw new Error(error.message || "Gagal mengambil data pengguna")
  }
}

export async function userActivate(token: String, userId: number) {
  try {
    const response = await fetch(`/api/user/${userId}/activeUser`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    console.log("API Response for activating user:", result)

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal mengaktifkan pengguna")
    }

    return result
  } catch (error: any) {
    throw new Error(error.message || "Gagal mengaktifkan pengguna")
  }
}

export async function userInactivate(token: String, userId: number) {
  try {
    const response = await fetch(`/api/user/${userId}/inactiveUser`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    console.log("API Response for inactivating user:", result)

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal menonaktifkan pengguna")
    }

    return result
  } catch (error: any) {
    throw new Error(error.message || "Gagal menonaktifkan pengguna")
  }
}

export async function registerUser(body: {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
  roleId: number
}) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const result = await response.json()

    console.log("API Response for registering user:", result)

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal mendaftarkan pengguna")
    }
    return result
  } catch (error: any) {
    throw new Error(error.message || "Gagal mendaftarkan pengguna")
  }
}
