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

    const idParams = Number(id)

    const existingKode = await checkingKodeNodeById(idParams)
    if (!existingKode) return errorResponse("Kode node tidak ditemukan", 404)
    if (existingKode.n_status === 0) {
      return errorResponse(
        "Kode node ini masih digunakan, nonaktifkan terlebih dahulu sebelum menghapus",
        400
      )
    }

    if (existingKode.kn_status === 0) {
      return errorResponse(
        "Kode node ini masih aktif, nonaktifkan terlebih dahulu sebelum menghapus",
        400
      )
    }

    const result = await deleteNodeKode(idParams)

    if (!result.affectedRows) {
      return errorResponse("Node tidak ditemukan", 404)
    }

    return successResponse("Node berhasil dihapus", { id: idParams }, 200)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal menghapus Kode Node", 500, message)
  }
}
