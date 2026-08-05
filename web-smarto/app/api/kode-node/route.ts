import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { fetchKodeNodes } from "@/services/kode-nodes.service"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)
    if (user.roleId == 3)
      return errorResponse(
        "Anda tidak memiliki izin untuk mengakses data kode node",
        403
      )

    const nodes = await fetchKodeNodes()

    console.log("kode node", nodes)

    return successResponse("Kode Node fetched successfully", nodes, 200)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Terjadi kesalahan", 500, message)
  }
}
