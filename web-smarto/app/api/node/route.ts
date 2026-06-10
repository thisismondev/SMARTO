import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { fetchNodes } from "@/services/nodes.service"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)
    if (user.roleId == 3)
      return errorResponse(
        "Anda tidak memiliki izin untuk mengakses data node",
        403
      )

    const nodes = await fetchNodes()

    return successResponse("Nodes fetched successfully", nodes, 200)
  } catch (error: any) {
    return errorResponse("Terjadi kesalahan", 500, error.message)
  }
}
