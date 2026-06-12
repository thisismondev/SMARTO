import {
  setUpNodeByCode,
  findNodeByKodeNodeId,
  
} from "@/services/nodes.service"
import {findByKodeNode} from "@/services/kode-nodes.service"
import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { kodeNode, userId, label, lat, lng } = body

    if (!kodeNode || !userId || !label || !lat || !lng) {
      return errorResponse("Semua field wajib diisi", 400)
    }

    const existingKode = await findByKodeNode(kodeNode)
    if (!existingKode) return errorResponse("Kode node tidak ditemukan", 404)
    if (existingKode.status === 1)
      return errorResponse("Kode node ini sudah tidak aktif", 400)

    const kodeNodeId = existingKode.id

    const existingNode = await findNodeByKodeNodeId(kodeNodeId)

    if (existingNode && existingNode.status === 0)
      return errorResponse("Node ini sudah dimiliki oleh user lain", 404)

    const result = await setUpNodeByCode({
      kodeNodeId,
      userId,
      label,
      lat,
      lng,
    })

    if (result.affectedRows === 0) {
      return errorResponse("Gagal menyimpan user node", 404)
    }

    return successResponse("User Node berhasil disimpan", 200)
  } catch (error: any) {
    return errorResponse("Gagal menyimpan user node", 500, error.message)
  }
}
