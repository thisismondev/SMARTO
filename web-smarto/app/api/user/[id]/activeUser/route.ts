import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { RouteParams } from "@/types/api"
import { activeById } from "@/services/users.service"

export async function PATCH(
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

    if (isNaN(idParams)) {
      return errorResponse("ID user tidak valid", 400)
    }

    const result = await activeById(idParams)

    if (result.affectedRows === 0) {
      return errorResponse("User tidak ditemukan", 404)
    }

    if (result.changedRows === 0) {
      return successResponse("User sudah aktif sebelumnya", null, 200)
    }

    return successResponse("User berhasil diaktifkan", null, 200)
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal mengaktifkan user", 500, message)
  }
}
