import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { fetchFuzzySets } from "@/services/fuzzy.service"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)
    if (user.roleId === 3)
      return errorResponse(
        "Anda tidak memiliki izin untuk mengakses data kategori sensor",
        403
      )

    const fuzzySets = await fetchFuzzySets()

    console.log("Hasil fetch fuzzy sets:", fuzzySets)

    return successResponse("Fuzzy sets fetched successfully", fuzzySets, 200)
  } catch (error: any) {
    return errorResponse("Terjadi kesalahan", 500, error.message)
  }
}
