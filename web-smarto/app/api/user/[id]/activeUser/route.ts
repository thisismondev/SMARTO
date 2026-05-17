import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { activeById } from "@/services/users.service"

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: Request, context: Params) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    const { id } = await context.params
    const userId = Number(id)

    if (isNaN(userId)) {
      return errorResponse("ID user tidak valid", 400)
    }

    const result = await activeById(userId)

    if (result.affectedRows === 0) {
      return errorResponse("User tidak ditemukan", 404)
    }

    if (result.changedRows === 0) {
      return successResponse("User sudah aktif sebelumnya", null, 200)
    }

    return successResponse("User berhasil diaktifkan", null, 200)
  } catch (error: any) {
    return errorResponse("Gagal mengaktifkan user", 500, error.message)
  }
}