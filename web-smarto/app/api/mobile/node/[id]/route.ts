import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { findNodeUserById } from "@/services/nodes.service"
import { RouteParams } from "@/types/api"

export async function GET(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)
    if (user.roleId !== 3)
      return errorResponse(
        "Anda tidak memiliki izin untuk mengakses data node",
        403
      )

    const { id } = await params

    const idParams = Number(id)

    if (idParams !== user.id) {
      return errorResponse(
        "Anda tidak memiliki izin untuk mengakses data node pengguna lain",
        403
      )
    }

    const nodes = await findNodeUserById(idParams)

    return successResponse("Nodes fetched successfully", nodes, 200)
  } catch (error: any) {
    return errorResponse("Terjadi kesalahan", 500, error.message)
  }
}
