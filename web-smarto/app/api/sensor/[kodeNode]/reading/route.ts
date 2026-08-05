import { errorResponse, successResponse } from "@/lib/response"
import { supabaseAdmin } from "@/lib/supabaseServer"
import { checkingKodeNode } from "@/services/kode-nodes.service"
import { addSensorBuffer } from "@/services/sensor.service"
import { KodeNodeRouteParams } from "@/types/api"
import { getMakassarDateTime } from "@/lib/date"

export async function PATCH(
  request: Request,
  { params }: { params: KodeNodeRouteParams }
) {
  try {
    const { kodeNode } = await params

    const kodeNodeData = await checkingKodeNode(kodeNode)

    if (!kodeNodeData) {
      return errorResponse("Kode node tidak ditemukan", 404)
    }

    if (kodeNodeData.kn_status !== 0 || kodeNodeData.n_status !== 0) {
      return errorResponse("Kode node tidak aktif", 400)
    }

    const body = await request.json()
    const { ph, kelembapan, suhu, nitrogen } = body
    const dateMakassar = getMakassarDateTime()
    const userId = kodeNodeData.user_id ?? null

    if (
      ph === undefined ||
      kelembapan === undefined ||
      suhu === undefined ||
      nitrogen === undefined ||
      ph === null ||
      kelembapan === null ||
      suhu === null ||
      nitrogen === null
    ) {
      return errorResponse("Semua parameter harus diisi", 400)
    }

    const { data, error } = await supabaseAdmin
      .from("sensor_readings")
      .update({
        ph: ph,
        kelembapan: kelembapan,
        suhu: suhu,
        nitrogen: nitrogen,
        update_at: dateMakassar,
      })
      .eq("kode_node_id", kodeNodeData.id)
      .select()

    if (error) {
      console.error("Error updating kode_node status:", error)
      return errorResponse(
        "Gagal memperbarui status kode node",
        500,
        error.message
      )
    }

    const buffer = await addSensorBuffer(
      userId,
      kodeNodeData.id,
      ph,
      kelembapan,
      suhu,
      nitrogen,
      dateMakassar
    )

    if (buffer.affectedRows === 0) {
      return errorResponse("Gagal menambahkan data ke sensor buffer", 500)
    }

    return successResponse(
      "Data sensor berhasil diperbarui",
      {
        realtime: data,
        buffer: buffer,
      },
      200
    )
  } catch (error: unknown) {
    console.error("Unexpected error:", error)
    return errorResponse("Terjadi kesalahan tidak terduga", 500)
  }
}
