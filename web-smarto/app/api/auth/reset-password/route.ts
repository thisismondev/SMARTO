import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { updateUserPassword } from "@/services/users.service"


export async function PUT(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    const body = await request.json()

    const { oldPassword, newPassword, confirmPassword } = body

    if (!oldPassword || !newPassword || !confirmPassword) {
      return errorResponse(
        "Password lama, password baru, dan konfirmasi password wajib diisi",
        400
      )
    }

    if (newPassword.length < 6) {
      return errorResponse("Password baru minimal 6 karakter", 400)
    }

    if (newPassword !== confirmPassword) {
      return errorResponse("Konfirmasi password tidak sama", 400)
    }

   const result = await updateUserPassword({
      userId: user.id,
      password: newPassword,
    })

    if (result.affectedRows === 0) {
      return errorResponse("User tidak ditemukan atau tidak aktif", 404)
    }

    return successResponse("Password berhasil diubah", null, 200)
  } catch (error: any) {
    return errorResponse("Gagal mengubah password", 400, error.message)
  }
}