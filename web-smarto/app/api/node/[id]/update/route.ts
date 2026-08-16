import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { RouteParams } from "@/types/api"
import { findNodeById, updateNodeById } from "@/services/nodes.service"

export async function PUT(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)

    const { id } = await params

    const idParams = Number(id)

    const node = await findNodeById(idParams)
    if (!node) return errorResponse("Node tidak ditemukan", 404)

    if (user.roleId === 3 && node.user_id !== user.id) {
      return errorResponse(
        "Anda tidak memiliki izin untuk melepaskan node ini",
        403
      )
    }

    const body = await request.json()
    const { userId, label, lat, lng } = body

    const result = await updateNodeById(idParams, {
      userId: userId,
      label: label,
      lat: lat,
      lng: lng,
    })

    console.log("Hasil update node:", result)

    if (result.affectedRows === 0) {
      return errorResponse("Gagal memperbarui node", 400)
    }

    return successResponse("Node berhasil diperbarui", result, 200)
  } catch (error: unknown) {
    console.error("Error memperbarui node:", error)
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal memperbarui node", 500, message)
  }
}
