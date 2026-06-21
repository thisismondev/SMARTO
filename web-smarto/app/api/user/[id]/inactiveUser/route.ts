import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { inactiveById } from "@/services/users.service"
import { deleteUserNode } from "@/services/nodes.service"
import { RouteParams } from "@/types/api"

export async function PATCH(request: Request, { params }: { params: RouteParams }) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    const { id } = await params

    console.log("PARAM:", id)

    if (isNaN(id)) {
      return errorResponse("Invalid user ID", 400)
    }


    const result = await inactiveById(id)

    if (result.affectedRows === 0) {
      return errorResponse("User tidak ditemukan", 404)
    }

    if (result.changedRows === 0) {
      return successResponse("User sudah nonaktif sebelumnya", null, 200)
    }

    await deleteUserNode(id)

    return successResponse("User berhasil dinonaktifkan", null, 200)
  } catch (error: any) {
    return errorResponse("Gagal menonaktifkan user", 500, error.message)
  }
} 