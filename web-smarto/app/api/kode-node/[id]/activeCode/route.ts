import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { activeNodeKode, findKodeNodeById } from "@/services/kode-nodes.service"
import { RouteParams } from "@/types/api"

export async function PATCH(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const user = await getAuthUser(request)

    const { id } = await params

    if (!user) return errorResponse("Unauthorized", 401)
    if (user.roleId !== 1)
      return errorResponse(
        "Forbidden: Anda tidak memiliki akses untuk melakukan aksi ini",
        403
      )
      
    const existingKode = await findKodeNodeById(id)
    if (!existingKode) return errorResponse("Kode node tidak ditemukan", 404)
    if (existingKode.status === 0)
      return errorResponse("Kode node ini sudah aktif", 400)

    const result = await activeNodeKode(id)

    if (!result.affectedRows) {
      return errorResponse("Node tidak ditemukan", 404)
    }

    return successResponse("Node berhasil diaktifkan", { id: id }, 200)
  } catch (error: any) {
    return errorResponse("Gagal mengaktifkan node", 500, error.message)
  }
}
