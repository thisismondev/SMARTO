import { NextRequest } from "next/server"
import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { findNodesByUserAndKodeNode } from "@/services/nodes.service"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)
    if (user.roleId == 3)
      return errorResponse(
        "Anda tidak memiliki izin untuk mengakses data node",
        403
      )

    const searchParams = request.nextUrl.searchParams

    const userId = searchParams.get("userId")
    const kodeNodeId = searchParams.get("kodeNodeId")

    if (!userId || !kodeNodeId) {
      return errorResponse("userId dan kodeNodeId wajib diisi", 400)
    }

    const node = await findNodesByUserAndKodeNode(
      Number(userId),
      Number(kodeNodeId)
    )

    if (!node) {
      return errorResponse("Data node tidak ditemukan", 404)
    }

    return successResponse("Node fetched successfully", node, 200)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Terjadi kesalahan", 500, message)
  }
}
