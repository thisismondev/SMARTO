import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"
import { fetchRuleBase } from "@/services/fuzzy.service"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)
    if (user.roleId === 3)
      return errorResponse(
        "Anda tidak memiliki izin untuk mengakses data rule base ",
        403
      )

    const ruleBase = await fetchRuleBase()

    return successResponse("Rule base fetched successfully", ruleBase, 200)
  } catch (error: any) {
    return errorResponse("Terjadi kesalahan", 500, error.message)
  }
}
