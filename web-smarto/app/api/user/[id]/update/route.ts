import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"
import { findUserById, updateUserById } from "@/services/users.service"
import { RouteParams } from "@/types/api"

export async function PUT(
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

    const existingUser = await findUserById(idParams)

    if (!existingUser) {
      return errorResponse("User not found", 404)
    }

    const { name, username, email, roleId } = await request.json()

    if (
      name === null ||
      username === null ||
      email === null ||
      roleId === null
    ) {
      return errorResponse("Semua field wajib diisi", 400)
    }

    const result = await updateUserById(idParams, {
      name: name,
      username: username,
      email: email,
      roleId: roleId,
    })

    console.log("UPDATE RESULT:", result)

    return successResponse("User berhasil diperbarui", result, 200)
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal memperbarui user", 500, message)
  }
}
