import { startSensorHourlyCron } from "./sensorCron"

export async function register() {
  console.log("Instrumentation jalan...")

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await startSensorHourlyCron()
  }
}