import { createUser, findUserByUsernameOrEmail } from "@/services/users.service"
import { errorResponse, successResponse } from "@/lib/response"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, username, email, password, confirmPassword, roleId } = body

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !roleId
    ) {
      return errorResponse("Semua field wajib diisi", 400)
    }

    if (password !== confirmPassword) {
      return errorResponse("Password dan konfirmasi password tidak cocok", 400)
    }

    const existingUser = await findUserByUsernameOrEmail(email, username)

    if (existingUser) {
      return errorResponse("Email atau username sudah digunakan", 400)
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return errorResponse(
        "Username harus 3-20 karakter dan hanya boleh huruf, angka, atau underscore",
        400
      )
    }

    await createUser({
      name,
      username,
      email,
      password,
      roleId,
    })

    return successResponse("Register berhasil", null, 201)
  } catch (error: any) {
    return errorResponse("Gagal register", 500, error.message)
  }
}
