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

    const idParams = Number(id)

    const result = await findNodeByUserId(idParams)

    if (!result) {
      return errorResponse("Node tidak ditemukan", 404)
    }

    return successResponse("Berhasil mengambil data node", result, 200)
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal mengambil data node", 500, message)
  }
}
