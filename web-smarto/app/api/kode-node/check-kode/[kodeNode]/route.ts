import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { checkingKodeNode } from "@/services/kode-nodes.service"
import { KodeNodeRouteParams } from "@/types/api"

export async function GET(
  request: Request,
  { params }: { params: KodeNodeRouteParams }
) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)

    const { kodeNode } = await params

    console.log("Kode node dari URL:", kodeNode)

    const kodeNodeData = await checkingKodeNode(kodeNode)

    console.log("Hasil query kode node:", kodeNodeData)

    if (!kodeNodeData) {
      return errorResponse("Kode node tidak ditemukan", 404)
    }

    if (kodeNodeData.kn_status === 1) {
      return errorResponse("Kode node tidak aktif", 400)
    }

    if (kodeNodeData.n_status === 0 || kodeNodeData.n_status === 1) {
      return errorResponse("Kode node sudah Tersedia", 400)
    }

    return successResponse("Kode node tersedia", { kodeNode }, 200)
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal memeriksa kode node", 500, message)
  }
}
