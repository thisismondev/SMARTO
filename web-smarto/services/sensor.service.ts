import type { ResultSetHeader, RowDataPacket } from "mysql2"
import db from "@/lib/db"
import { getMakassarCurrentHourStart } from "@/lib/date"
import { FilterType, PERIOD_CONFIG } from "@/types/sensor"

// sensor buffer
export async function addSensorBuffer(
  userId: number,
  kodeNodeId: number,
  ph: number,
  kelembapan: number,
  suhu: number,
  nitrogen: number,
  created_at: string
) {
  const [result] = await db.query<ResultSetHeader>(
    `
        INSERT INTO sensor_buffer (user_id, kode_node_id, ph, kelembapan, suhu, nitrogen, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    [userId, kodeNodeId, ph, kelembapan, suhu, nitrogen, created_at]
  )
  return result
}

export async function processSensorBufferHourly() {
  const currentHourStart = getMakassarCurrentHourStart()

  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    const [insertResult] = await connection.query<ResultSetHeader>(
      `
      INSERT INTO sensor_log (
        user_id,
        kode_node_id,
        ph,
        kelembapan,
        suhu,
        nitrogen,
        total_data,
        created_at
      )
      SELECT 
        sb.user_id,
        sb.kode_node_id,
        ROUND(AVG(sb.ph), 2) AS ph,
        ROUND(AVG(sb.kelembapan), 2) AS kelembapan,
        ROUND(AVG(sb.suhu), 2) AS suhu,
        ROUND(AVG(sb.nitrogen), 0) AS nitrogen,
        COUNT(*) AS total_data,
        DATE_FORMAT(sb.created_at, '%Y-%m-%d %H:00:00') AS created_at
      FROM sensor_buffer sb
      WHERE sb.created_at < DATE_SUB(?, INTERVAL 1 HOUR)
        AND sb.user_id IS NOT NULL
      GROUP BY 
        sb.user_id,
        sb.kode_node_id,
        DATE_FORMAT(sb.created_at, '%Y-%m-%d %H:00:00')

      ON DUPLICATE KEY UPDATE
        ph = VALUES(ph),
        kelembapan = VALUES(kelembapan),
        suhu = VALUES(suhu),
        nitrogen = VALUES(nitrogen),
        total_data = VALUES(total_data)
      `,
      [currentHourStart]
    )

    const [deleteResult] = await connection.query<ResultSetHeader>(
      `
      DELETE FROM sensor_buffer
      WHERE created_at < DATE_SUB(?, INTERVAL 1 HOUR)
      `,
      [currentHourStart]
    )

    await connection.commit()

    return {
      message: "Sensor buffer berhasil dirata-ratakan ke sensor_log",
      currentHourStart,
      insertAffectedRows: insertResult.affectedRows,
      deletedRows: deleteResult.affectedRows,
    }
  } catch (error) {
    await connection.rollback()
    console.error("Process sensor buffer hourly error:", error)
    throw error
  } finally {
    connection.release()
  }
}

export async function getSensorLog(
  userId: number,
  kodeNodeId: number,
  filterType: FilterType
) {
  const config = PERIOD_CONFIG[filterType]
  const [rows] = await db.query<RowDataPacket[]>(
    `
    SELECT
      ${config.groupBy} AS periode,
      ROUND(AVG(ph), 2)         AS avg_ph,
      ROUND(AVG(kelembapan), 2) AS avg_kelembapan,
      ROUND(AVG(suhu), 2)       AS avg_suhu,
      ROUND(AVG(nitrogen), 0)   AS avg_nitrogen
    FROM sensor_log
    WHERE user_id = ?
      AND kode_node_id = ?
      AND created_at >= DATE_SUB(NOW(), ${config.interval})
    GROUP BY periode
    ORDER BY periode ASC
    `,
    [userId, kodeNodeId]
  )

  return rows
}
