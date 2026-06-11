import { createKodeNode, findByKodeNode } from "@/services/nodes.service"
import { errorResponse, successResponse } from "@/lib/response"
import { supabaseAdmin } from "@/lib/supabaseServer"
import { getAuthUser } from "@/lib/auth"

function generateKodeNode() {
  const randomNumber = Math.floor(10000 + Math.random() * 90000)
  return `KN-${randomNumber}`
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)

    // 1. Cek apakah user sudah login
    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    // 2. Cek apakah role user diizinkan (Role ID 3)
    if (user.roleId !== 1) {
      return errorResponse(
        "Forbidden: Anda tidak memiliki akses untuk melakukan aksi ini",
        403
      )
    }

    // 3. Logic Generate Kode Unik
    let kodeNode = ""
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 5) {
      kodeNode = generateKodeNode()
      const existingNode = await findByKodeNode(kodeNode)

      if (!existingNode) {
        isUnique = true
      }
      attempts++
    }

    if (!isUnique) {
      return errorResponse(
        "Gagal menghasilkan kode unik, silakan coba lagi",
        500
      )
    }

    // 4. Proses penyimpanan kode node ke database
    const result = await createKodeNode(kodeNode)

    const kodeNodeId = result.insertId

    // 2. Insert kode_node_id ke table sensor_readings Supabase
    const { data: sensorReading, error: sensorError } = await supabaseAdmin
      .from("sensor_readings")
      .insert([
        {
          kode_node_id: kodeNodeId,
        },
      ])
      .select()
      .single()

    if (sensorError) {
      return errorResponse(
        "Kode node berhasil dibuat, tetapi gagal membuat data sensor reading",
        500,
        sensorError.message
      )
    }

    return successResponse(`Kode node ${kodeNode} berhasil ditambahkan`, {
      id: kodeNodeId,
      kode_node: kodeNode,
      sensor_reading: sensorReading,
    })
  } catch (error: any) {
    return errorResponse("Gagal menambahkan node", 500, error.message)
  }
}
