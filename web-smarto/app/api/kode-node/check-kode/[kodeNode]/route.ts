import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { checkingKodeNode } from "@/services/nodes.service"
import { KodeNodeRouteParams } from "@/types/api"

export async function GET(
  request: Request,
  { params }: { params: KodeNodeRouteParams }
) {
  try {
    const user = await getAuthUser(request)

    const { kodeNode } = await params

    console.log("=== CHECK KODE NODE API MASUK ===")
    console.log("Kode node dari URL:", kodeNode)

    if (!user) return errorResponse("Unauthorized", 401)

    const kodeNodeData = await checkingKodeNode(kodeNode)

    console.log("Hasil query kode node:", kodeNodeData)

    if (!kodeNodeData) {
      return errorResponse("Kode node tidak ditemukan", 404)
    }

    if (kodeNodeData.kn_status !== 0) {
      return errorResponse("Kode node tidak aktif", 400)
    }

    if (kodeNodeData.n_status === 0) {
      return errorResponse("Kode node sudah terpakai", 400)
    }

    return successResponse("Kode node tersedia", { kodeNode }, 200)
  } catch (error: any) {
    return errorResponse("Gagal memeriksa kode node", 500, error.message)
  }
}
