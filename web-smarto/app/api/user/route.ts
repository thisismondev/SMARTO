import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { findUsers, adminFindUsers } from "@/services/users.service"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    if (user.roleId == 1) {
      const users = await adminFindUsers()
      return successResponse("Berhasil mengambil data pengguna", users, 200)
    } else {
      const users = await findUsers()
      return successResponse("Berhasil mengambil data pengguna", users, 200)
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal mengambil data pengguna", 500, message)
  }
}
