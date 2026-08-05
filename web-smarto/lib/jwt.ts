import jwt from "jsonwebtoken"

type JwtPayloadData = {
  id: number
  name: string
  email: string
  username: string
  roleId: number
  role: string
}

const jwtSecret = process.env.JWT_SECRET ?? ""

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set")
}

export function generateToken(payload: JwtPayloadData) {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: "7d",
  })
}

export function verifyAuthToken(token: string) {
  try {
    return jwt.verify(token, jwtSecret) as JwtPayloadData
  } catch {
    return null
  }
}
