import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { findByKodeNode } from "@/services/kode-nodes.service"
import { findNodeByKodeNodeId, setUpNodeByCode } from "@/services/nodes.service"

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)

    if (user.roleId !== 3) {
      return errorResponse("Anda tidak memiliki izin untuk menambahkan node", 403)
    }

    const body = await request.json()
    const { kodeNode, label, lat, lng } = body

    if (!kodeNode || !label || !lat || !lng) {
      return errorResponse("Semua field wajib diisi", 400)
    }

    const existingKode = await findByKodeNode(kodeNode)
    if (!existingKode) return errorResponse("Kode node tidak ditemukan", 404)
    if (existingKode.status === 1)
      return errorResponse("Kode node ini sudah tidak aktif", 400)

    const kodeNodeId = existingKode.id

    const existingNode = await findNodeByKodeNodeId(kodeNodeId)
    if (existingNode && existingNode.status === 0)
      return errorResponse("Kode node sudah dimiliki oleh user lain", 400)

    const result = await setUpNodeByCode({
      kodeNodeId,
      userId: user.id,
      label,
      lat,
      lng,
    })

    if (result.affectedRows === 0) {
      return errorResponse("Gagal menyimpan node", 404)
    }

    return successResponse("Node berhasil ditambahkan", {
      nodeId: result.insertId,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal menambahkan node", 500, message)
  }
}
