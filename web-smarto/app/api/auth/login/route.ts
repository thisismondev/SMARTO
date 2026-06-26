import { findByIdentifier } from "@/services/users.service"
import { generateToken } from "@/lib/jwt"
import { errorResponse, successResponse } from "@/lib/response"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { identifier, password } = body

    if (!identifier || !password) {
      return errorResponse("Email/Username dan password wajib diisi", 400)
    }

    const user = await findByIdentifier(identifier)

    if (!user) {
      return errorResponse("User tidak ditemukan", 401)
    }

    if (user.password != password) {
      return errorResponse("Password salah", 401)
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      roleId: user.role_id,
      role: user.role,
    })

    return successResponse("Login berhasil", {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        role: user.role,
      },
    })
  } catch (error: any) {
    return errorResponse("Gagal login", 500, error.message)
  }
}
