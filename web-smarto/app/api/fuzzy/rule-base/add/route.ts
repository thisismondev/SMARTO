import { addRuleBaseDetail, checkKodeRule } from "@/services/fuzzy.service"
import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)
    if (user.roleId === 3)
      return errorResponse(
        "Anda tidak memiliki izin untuk menambahkan rule base",
        403
      )

    const body = await request.json()

    const {
      kode_rule,
      ph_kategori_id,
      kelembapan_kategori_id,
      suhu_kategori_id,
      nitrogen_kategori_id,
      set_output_id,
    } = body

    if (
      !kode_rule ||
      !ph_kategori_id ||
      !kelembapan_kategori_id ||
      !suhu_kategori_id ||
      !nitrogen_kategori_id ||
      !set_output_id
    ) {
      return errorResponse("Semua field wajib diisi", 400)
    }

    const existingKodeRule = await checkKodeRule(kode_rule)

    if (existingKodeRule.length > 0) {
      return errorResponse("Kode rule sudah digunakan", 400)
    }

    const result = await addRuleBaseDetail(
      kode_rule,
      ph_kategori_id,
      kelembapan_kategori_id,
      suhu_kategori_id,
      nitrogen_kategori_id,
      set_output_id
    )

    return successResponse("Rule base berhasil ditambahkan", result, 201)
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Gagal menambahkan rule base", 500, message)
  }
}
