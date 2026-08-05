import cron from "node-cron"
import { processSensorBufferHourly } from "@/services/sensor.service"

let isRunning = false

export function startSensorHourlyCron() {
  const globalForCron = globalThis as typeof globalThis & {
    sensorHourlyCronStarted?: boolean
  }

  if (globalForCron.sensorHourlyCronStarted) {
    console.log("Sensor hourly cron sudah aktif")
    return
  }

  globalForCron.sensorHourlyCronStarted = true

  cron.schedule(
    "0 * * * *",
    async () => {
      if (isRunning) {
        console.log("Cron sensor hourly masih berjalan, skip...")
        return
      }

      try {
        isRunning = true

        console.log("Cron sensor hourly mulai...")

        const result = await processSensorBufferHourly()

        console.log("Cron sensor hourly selesai:", result)
      } catch (error) {
        console.error("Cron sensor hourly error:", error)
      } finally {
        isRunning = false
      }
    },
    {
      timezone: "Asia/Makassar",
    }
  )

  console.log("Sensor hourly cron aktif setiap 1 jam")
}
