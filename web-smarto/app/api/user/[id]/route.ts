import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { findUserById } from "@/services/users.service"
import { RouteParams } from "@/types/api"

export async function GET(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    const { id } = await params

    const idParams = Number(id)

    console.log("PARAM:", idParams)

    if (isNaN(idParams)) {
      return errorResponse("Invalid user ID", 400)
    }

    const result = await findUserById(idParams)

    if (!result) {
      return errorResponse("User not found", 404)
    }

    return successResponse("User berhasil ditemukan", result, 200)
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal mencari user", 500, message)
  }
}
