import { createFuzzySets } from "@/services/fuzzy.service"
import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)

    if (user.roleId !== 1)
      return errorResponse(
        "Anda tidak memiliki izin untuk menambahkan kategori sensor",
        403
      )

    const body = await request.json()
    const { variableId, setName, mfType, a, b, c, d } = body

    console.log("Received data:", {
      variableId,
      setName,
      mfType,
      a,
      b,
      c,
      d,
    })

    if (
      !variableId ||
      !setName ||
      !mfType ||
      a === undefined ||
      a === null ||
      b === undefined ||
      b === null ||
      c === undefined ||
      c === null ||
      d === undefined ||
      d === null
    ) {
      return errorResponse("Semua field wajib diisi", 400)
    }

    const result = await createFuzzySets(
      variableId,
      setName,
      mfType,
      a,
      b,
      c,
      d
    )

    return successResponse("Fuzzy set berhasil ditambahkan", result, 201)
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal menambahkan fuzzy set", 500, message)
  }
}
