import { NextResponse } from "next/server"
import { runFuzzyEngine } from "@/lib/fuzzy/engine"
import { errorResponse, successResponse } from "@/lib/response"
import { getAuthUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { ph, kelembapan, suhu, nitrogen } = body

    // Validasi input data sensor
    if (
      ph === undefined ||
      kelembapan === undefined ||
      suhu === undefined ||
      nitrogen === undefined ||
      ph === null ||
      kelembapan === null ||
      suhu === null ||
      nitrogen === null
    ) {
      return NextResponse.json(
        { success: false, message: "Parameter sensor tidak lengkap." },
        { status: 400 }
      )
    }

    // Eksekusi kalkulasi fuzzy berdasarkan data sensor
    const result = await runFuzzyEngine(ph, kelembapan, suhu, nitrogen)

    console.log("=== HASIL FUZZY ENGINE ===")
    console.log(result)

    // Kirimkan respon balik ke ESP32 / Perangkat IoT Anda
    return successResponse("Fuzzy engine executed successfully", result, 200)
  } catch (error: unknown) {
    console.error("Fuzzy API Error: ", error)
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui"
    return errorResponse("Terjadi kesalahan pada server", 500, message)
  }
}
