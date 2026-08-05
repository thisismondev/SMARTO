import { NextResponse } from "next/server"

export function successResponse(
  message: string,
  data: unknown = null,
  status = 200
) {
  return NextResponse.json(
    {
      status: true,
      message,
      data,
    },
    { status }
  )
}

export function errorResponse(
  message: string,
  status = 500,
  error: unknown = null
) {
  return NextResponse.json(
    {
      status: false,
      message,
      error,
    },
    { status }
  )
}
