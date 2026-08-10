import { NextRequest } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { checkingKodeNode } from "@/services/kode-nodes.service"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    if (user.roleId !== 3) {
      return errorResponse(
        "Anda tidak memiliki izin untuk memeriksa kode node",
        403
      )
    }

    const { searchParams } = new URL(request.url)

    const kodeNode = searchParams.get("kodeNode")

    console.log("kodeNode", kodeNode)

    if (!kodeNode) {
      return errorResponse("Parameter kodeNode wajib diisi", 400)
    }

    const kodeNodeData = await checkingKodeNode(kodeNode)

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
    const message = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal memeriksa kode node", 500, message)
  }
}
