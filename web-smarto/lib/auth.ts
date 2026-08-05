import { cookies } from "next/headers"
import { verifyAuthToken } from "@/lib/jwt"

export async function getTokenFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization")

  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null

  const cookieStore = await cookies()
  const cookieToken = cookieStore.get("token")?.value

  return bearerToken || cookieToken || null
}

export async function getAuthUser(request: Request) {
  const token = await getTokenFromRequest(request)

  if (!token) {
    return null
  }

  const user = verifyAuthToken(token)

  if (!user) {
    return null
  }

  return user
}
