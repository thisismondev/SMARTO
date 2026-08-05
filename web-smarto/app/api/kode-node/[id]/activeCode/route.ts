import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import {
  activeNodeKode,
  checkingKodeNodeById,
} from "@/services/kode-nodes.service"
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

    const idParams = Number(id)

    const existingKode = await checkingKodeNodeById(idParams)

    console.log("existingKode active", existingKode)

    if (!existingKode) return errorResponse("Kode node tidak ditemukan", 404)
    if (existingKode.kn_status === 0)
      return errorResponse("Kode node ini sudah aktif", 400)

    const result = await activeNodeKode(idParams)

    if (!result.affectedRows) {
      return errorResponse("Node tidak ditemukan", 404)
    }

    return successResponse("Node berhasil diaktifkan", { id: idParams }, 200)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal mengaktifkan node", 500, message)
  }
}
