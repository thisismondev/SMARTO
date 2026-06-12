import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { RouteParams } from "@/types/api"
import { findNodeByUserId } from "@/services/nodes.service"

export async function GET(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    const { id } = await params

    const result = await findNodeByUserId(id)

    if (!result) {
      return errorResponse("Node tidak ditemukan", 404)
    }

    return successResponse("Berhasil mengambil data node", result, 200)
  } catch (error: any) {
    return errorResponse("Gagal mengambil data node", 500, error.message)
  }
}
