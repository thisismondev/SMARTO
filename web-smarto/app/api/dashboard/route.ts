import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { fetchDashboardData } from "@/services/dashboard.service"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    const result = await fetchDashboardData()

    console.log("Dashboard data fetched successfully:", result)

    return successResponse("Berhasil mengambil data dashboard", result, 200)
  } catch (error) {
    return errorResponse(
      "Gagal mengambil data dashboard",
      500,
      (error as Error).message
    )
  }
}
