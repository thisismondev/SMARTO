import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { checkPasswordUser, updateUserPassword } from "@/services/users.service"
import { RouteParams } from "@/types/api"

export async function PUT(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    const { id } = await params

    const idParams = Number(id)

    console.log("PARAM:", idParams)

    if (isNaN(idParams)) {
      return errorResponse("Invalid user ID", 400)
    }

    const body = await request.json()

    const { oldPassword, newPassword, confirmPassword } = body

    if (!oldPassword || !newPassword || !confirmPassword) {
      return errorResponse(
        "Password lama, password baru, dan konfirmasi password wajib diisi",
        400
      )
    }

    const existingPassword = await checkPasswordUser(idParams)

    if (!existingPassword) {
      return errorResponse("Password tidak ditemukan atau tidak aktif", 404)
    }

    if (existingPassword.password !== oldPassword) {
      return errorResponse("Password lama tidak sesuai", 400)
    }

    if (newPassword.length < 6) {
      return errorResponse("Password baru minimal 6 karakter", 400)
    }

    if (newPassword !== confirmPassword) {
      return errorResponse("Konfirmasi password tidak sama", 400)
    }

    const result = await updateUserPassword({
      userId: idParams,
      password: newPassword,
    })

    if (result.affectedRows === 0) {
      return errorResponse("User tidak ditemukan atau tidak aktif", 404)
    }

    return successResponse("Password berhasil diubah", null, 200)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal mengubah password", 400, message)
  }
}
