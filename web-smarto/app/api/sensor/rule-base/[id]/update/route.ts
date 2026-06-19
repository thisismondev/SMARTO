import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { RouteParams } from "@/types/api"
import { updateRuleBase, checkRuleBase } from "@/services/fuzzy.service"

export async function PUT(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)

    const { id } = await params

    const existingRuleBase = await checkRuleBase(id)
    if (!existingRuleBase) {
      return errorResponse("Rule base tidak ditemukan", 404)
    }

    const body = await request.json()
    const {
      kode_rule,
      ph_kategori_id,
      kelembapan_kategori_id,
      suhu_kategori_id,
      nitrogen_kategori_id,
      output,
    } = body

    const result = await updateRuleBase(id, {
      kode_rule,
      ph_kategori_id,
      kelembapan_kategori_id,
      suhu_kategori_id,
      nitrogen_kategori_id,
      output,
    })

    console.log("Hasil update rule base:", result)

    if (result.affectedRows === 0) {
      return errorResponse("Gagal memperbarui rule base", 400)
    }

    return successResponse("Rule base berhasil diperbarui", result, 200)
  } catch (error: any) {
    console.error("Error memperbarui rule base:", error)
    return errorResponse("Gagal memperbarui rule base", 500, error.message)
  }
}
