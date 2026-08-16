import { NextRequest } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { getSensorLog } from "@/services/sensor.service"
import { FilterType } from "@/types/sensor"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    const { searchParams } = new URL(request.url)

    const kodeNodeId = Number(searchParams.get("kodeNodeId"))
    const periode = searchParams.get("periode") as FilterType

    let targetUserId: number

    if (user.roleId === 3) {
      targetUserId = user.id
    } else {
      const userId = Number(searchParams.get("userId"))

      if (!userId) {
        return errorResponse("userId wajib diisi untuk admin/penyuluh", 400)
      }

      targetUserId = userId
    }

    if (!kodeNodeId || !periode || !targetUserId) {
      return errorResponse("Parameter tidak lengkap", 400)
    }

    const result = await getSensorLog(targetUserId, kodeNodeId, periode)

    return successResponse("Berhasil mengambil statistik sensor log", result)
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse(message || "Gagal mengambil statistik sensor log", 500)
  }
}
