import { addRuleBaseDetail, findLastRuleBase } from "@/services/fuzzy.service"
import { getAuthUser } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/response"

function generateKodeRule(lastKodeRule: string | null) {
  if (!lastKodeRule) {
    return "R1"
  }

  const lastNumber = Number(lastKodeRule.replace("R", ""))

  if (Number.isNaN(lastNumber)) {
    return "R1"
  }

  const nextNumber = lastNumber + 1

  return `R${nextNumber}`
}


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
      ph_kategori_id,
      kelembapan_kategori_id,
      suhu_kategori_id,
      nitrogen_kategori_id,
      output,
    } = body

    const lastRuleBase = await findLastRuleBase()
    const kode_rule = generateKodeRule(lastRuleBase?.kode_rule)

    if (
      !ph_kategori_id ||
      !kelembapan_kategori_id ||
      !suhu_kategori_id ||
      !nitrogen_kategori_id ||
      !output
    ) {
      return errorResponse("Semua field wajib diisi", 400)
    }

    const result = await addRuleBaseDetail(
      kode_rule,
      ph_kategori_id,
      kelembapan_kategori_id,
      suhu_kategori_id,
      nitrogen_kategori_id,
      output
    )

    return successResponse("Rule base berhasil ditambahkan", result, 201)
  } catch (error: any) {
    return errorResponse("Gagal menambahkan rule base", 500, error.message)
  }
}
