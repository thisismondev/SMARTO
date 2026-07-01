import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { fetchFuzzyVariables } from "@/services/fuzzy.service"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)
    if (user.roleId !== 1)
      return errorResponse(
        "Anda tidak memiliki izin untuk mengakses data parameter sensor",
        403
      )

    const fuzzyVariables = await fetchFuzzyVariables()

    return successResponse("Fuzzy variables fetched successfully", fuzzyVariables, 200)
  } catch (error: any) {
    return errorResponse("Terjadi kesalahan", 500, error.message)
  }
}
