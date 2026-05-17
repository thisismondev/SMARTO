import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    return successResponse("Logout berhasil", null, 200)
  } catch (error: any) {
    return errorResponse("Logout gagal", 500, error.message)
  }
}