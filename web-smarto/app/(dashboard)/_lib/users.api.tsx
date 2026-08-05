export async function findUsers(token: string) {
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
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Gagal mengambil data pengguna")
  }
}

export async function findUserById(token: string, id: number) {
  try {
    const response = await fetch(`/api/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    console.log("API Response for user by Id:", result.data)

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal mengambil data pengguna")
    }
    return result
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Gagal mengambil data pengguna")
  }
}

export async function updateUserById(
  token: string,
  id: number,
  data: {
    name: string
    username: string
    email: string
    roleId: number
  }
) {
  try {
    const response = await fetch(`/api/user/${id}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    console.log("API Response for update user by Id:", result)

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Gagal memperbarui pengguna")
    }

    return result
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Gagal memperbarui pengguna")
  }
}

export async function userActivate(token: string, userId: number) {
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
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Gagal mengaktifkan pengguna")
  }
}

export async function userInactivate(token: string, userId: number) {
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
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Gagal menonaktifkan pengguna")
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
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Gagal mendaftarkan pengguna")
  }
}

export async function changePasswordUser(
  token: string,
  userId: number,
  body: {
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }
) {
  try {
    const response = await fetch(`/api/auth/${userId}/reset-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    const result = await response.json()

    if (!result.status) {
      throw new Error(result.message || "Gagal mengubah password pengguna")
    }

    console.log("API Response for changing user password:", result)
    return result
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Gagal mengubah password pengguna")
  }
}
