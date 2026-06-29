import { errorResponse, successResponse } from "@/lib/response"
import { supabaseAdmin } from "@/lib/supabaseServer"
import { checkingKodeNode } from "@/services/kode-nodes.service"
import {
  addSensorBuffer,
  processSensorBufferHourly,
  // processSensorBuffer,
  // deleteSensorBuffer,
} from "@/services/sensor.service"
import { KodeNodeRouteParams } from "@/types/api"

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
        update_at: new Date().toISOString(),
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
      kodeNodeData.id,
      ph,
      kelembapan,
      suhu,
      nitrogen
    )

    if (buffer.affectedRows === 0) {
      return errorResponse("Gagal menambahkan data ke sensor buffer", 500)
    }

    const processBuffer = await processSensorBufferHourly(kodeNodeData.id)

    return successResponse("Data sensor berhasil diperbarui", {
      realtime: data,
      buffer: {
        inserted: true,
      },
      hourly_process: processBuffer,
    })
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return errorResponse("Terjadi kesalahan tidak terduga", 500)
  }
}
