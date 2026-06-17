import { supabase } from "@/lib/supabaseClient"
import { SensorReading } from "@/types/sensor"

export async function fetchSensorData(kodeNodeId: number) {
  const { data, error } = await supabase
    .from("sensor_readings")
    .select(
      `
      id,
      kode_node_id,
      ph,
      suhu,
      kelembapan,
      nitrogen
      `
    )
    .eq("kode_node_id", kodeNodeId)
    .maybeSingle()

  if (error) {
    console.error("Error fetching sensor data:", error)
    throw new Error("Gagal mengambil data sensor")
  }

  return data as SensorReading | null
}

export function subscribeSensorDataUpdate(
  sensorRowId: number,
  callback: (data: SensorReading) => void
) {
  const channel = supabase
    .channel(`sensor-reading-${sensorRowId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "sensor_readings",
        filter: `id=eq.${sensorRowId}`,
      },
      (payload) => {
        callback(payload.new as SensorReading)
      }
    )
    .subscribe()

  return channel
}