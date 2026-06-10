import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { findNodeById, releaseNodeUser } from "@/services/nodes.service"
import { RouteParams } from "@/types/api"

export async function PATCH(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)

    const { id } = await params

    const node = await findNodeById(id)
    if (!node) return errorResponse("Node tidak ditemukan", 404)
    if (node.status === 1) return errorResponse("Node ini sudah dilepaskan", 400)

    if(user.roleId === 3 && node.user_id !== user.id){
        return errorResponse("Anda tidak memiliki izin untuk melepaskan node ini", 403)
    }

    const result = await releaseNodeUser(id)

    if (result.affectedRows === 0) {
      return errorResponse("Gagal melepaskan user node", 400)
    }

    return successResponse("User berhasil dilepaskan", result, 200)
  } catch (error: any) {
    return errorResponse("Terjadi kesalahan", 500, error.message)
  }
}
