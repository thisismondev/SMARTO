import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { inactiveById } from "@/services/users.service"
import { deleteUserNode } from "@/services/nodes.service"
import { RouteParams } from "@/types/api"

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

    console.log("PARAM:", idParams)

    if (isNaN(idParams)) {
      return errorResponse("Invalid user ID", 400)
    }

    const result = await inactiveById(idParams)

    if (result.affectedRows === 0) {
      return errorResponse("User tidak ditemukan", 404)
    }

    if (result.changedRows === 0) {
      return successResponse("User sudah nonaktif sebelumnya", null, 200)
    }

    await deleteUserNode(idParams)

    return successResponse("User berhasil dinonaktifkan", null, 200)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal menonaktifkan user", 500, message)
  }
}
