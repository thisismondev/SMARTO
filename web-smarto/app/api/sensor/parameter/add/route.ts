import {
    createParameterSensor
} from "@/services/sensor.service"
import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { namaParameter, satuan } = body

    if (!namaParameter) {
      return errorResponse("Semua field wajib diisi", 400)
    }

    const result = await createParameterSensor(namaParameter, satuan)

    return successResponse("Parameter sensor berhasil ditambahkan", result, 201)
  } catch (error: any) {
    return errorResponse("Gagal menambahkan parameter sensor", 500, error.message)
  }
}