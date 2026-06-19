import {
    createKategoriSensor
} from "@/services/sensor.service"
import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { parameterId, namaKategori, minValue, maxValue } = body

    console.log("Received data:", { parameterId, namaKategori, minValue, maxValue })

    if (!parameterId ||
      !namaKategori ||
      minValue === undefined ||
      minValue === null ||
      maxValue === undefined ||
      maxValue === null) {
      return errorResponse("Semua field wajib diisi", 400)
    }

    const result = await createKategoriSensor(parameterId, namaKategori, minValue, maxValue)

    return successResponse("Kategori sensor berhasil ditambahkan", result, 201)
  } catch (error: any) {
    return errorResponse("Gagal menambahkan kategori sensor", 500, error.message)
  }
}