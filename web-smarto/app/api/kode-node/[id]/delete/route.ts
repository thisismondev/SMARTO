import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { RouteParams } from "@/types/api"
import {
  deleteNodeKode,
  checkingKodeNodeById,
} from "@/services/kode-nodes.service"

export async function DELETE(
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

    const existingKode = await checkingKodeNodeById(id)
    if (!existingKode) return errorResponse("Kode node tidak ditemukan", 404)
    if (existingKode.n_status === 0 || existingKode.kn_status === 0) {
      return errorResponse("Kode node ini masih aktif / terpakai", 400)
    }

    const result = await deleteNodeKode(id)

    if (!result.affectedRows) {
      return errorResponse("Node tidak ditemukan", 404)
    }

    return successResponse("Node berhasil dihapus", { id: id }, 200)
  } catch (error: any) {
    return errorResponse("Gagal menghapus Kode Node", 500, error.message)
  }
}
