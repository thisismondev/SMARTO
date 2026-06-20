import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { fetchKategoriSensor } from "@/services/sensor.service"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)
    if (user.roleId === 3)
      return errorResponse(
        "Anda tidak memiliki izin untuk mengakses data kategori sensor",
        403
      )

    const kategori = await fetchKategoriSensor()

    console.log("Hasil fetch kategori sensor:", kategori)

    return successResponse("Kategori fetched successfully", kategori, 200)
  } catch (error: any) {
    return errorResponse("Terjadi kesalahan", 500, error.message)
  }
}
