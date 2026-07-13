export async function getDashboardData() {
  try {
    const responese = await fetch("/api/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    const result = await responese.json()

    if (!result.status) {
      throw new Error(result.message || "Gagal mengambil data dashboard")
    }

    return result
  } catch (error) {
    throw new Error(
      (error as Error).message || "Gagal mengambil data dashboard"
    )
  }
}
