import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { findUserPetani } from "@/services/users.service"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    const petani = await findUserPetani()
    return successResponse("Berhasil mengambil data petani", petani, 200)
  } catch (error: any) {
    return errorResponse("Gagal mengambil data petani", 500, error.message)
  }
}
