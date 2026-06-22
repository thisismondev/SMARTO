import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import {
  findNodeById,
  useNodeUser,
  checkingNodeById,
} from "@/services/nodes.service"
import { RouteParams } from "@/types/api"

export async function PATCH(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)

    const { id } = await params

    const idParams = Number(id)

    const node = await findNodeById(idParams)
    if (!node) return errorResponse("Node tidak ditemukan", 404)
    if (node.status === 0) return errorResponse("Node ini sudah dipakai", 400)

    const availableNode = await checkingNodeById(node.kode_node_id)

    if (availableNode !== null) {
      return errorResponse("Node ini sudah dipakai", 400)
    }

    if (user.roleId === 3) {
      return errorResponse(
        "Anda tidak memiliki izin untuk menggunakan node ini",
        403
      )
    }

    const result = await useNodeUser(idParams)

    if (result.affectedRows === 0) {
      return errorResponse("Gagal menggunakan node", 400)
    }

    return successResponse("Node berhasil digunakan", result, 200)
  } catch (error: any) {
    return errorResponse(
      "Terjadi kesalahan: " + error.error,
      500,
      error.message
    )
  }
}
