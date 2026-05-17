import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { inactiveById } from "@/services/users.service"

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: Request, context: Params) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    const { id } = await context.params

    console.log("PARAM ID:", id)

    const userId = Number(id)

    console.log("USER ID:", userId)

    if (isNaN(userId)) {
      return errorResponse("Invalid user ID", 400)
    }


    const result = await inactiveById(userId)

    if (result.affectedRows === 0) {
      return errorResponse("User tidak ditemukan", 404)
    }

    if (result.changedRows === 0) {
      return successResponse("User sudah nonaktif sebelumnya", null, 200)
    }

    return successResponse("User berhasil dinonaktifkan", null, 200)
  } catch (error: any) {
    return errorResponse("Gagal menonaktifkan user", 500, error.message)
  }
} 