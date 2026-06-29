import type { ResultSetHeader, RowDataPacket } from "mysql2"
import db from "@/lib/db"

// Sensor Parameter
type SensorParameterRow = {
  id: number
  nama_parameter: string
  satuan: string | null
} & RowDataPacket

export async function createParameterSensor(
  nama_parameter: string,
  satuan: string | null
) {
  const [result] = await db.query<ResultSetHeader>(
    `
    INSERT INTO sensor_parameter (nama_parameter, satuan)
    VALUES (?, ?)
  `,
    [nama_parameter, satuan]
  )
  return result
}

export async function fetchParameterSensor() {
  const [rows] = await db.query<SensorParameterRow[]>(
    `
    SELECT id, nama_parameter, satuan 
    FROM sensor_parameter
    ORDER BY id ASC
  `
  )

  return rows
}

export async function updateParameterSensor(
  id: number,
  nama_parameter: string,
  satuan: string | null
) {
  const [result] = await db.query<ResultSetHeader>(
    `
        UPDATE sensor_parameter
        SET nama_parameter = ?, satuan = ?
        WHERE id = ?
      `,
    [nama_parameter, satuan, id]
  )
  return result
}

// Sensor Kategori

type SensorKategoriRow = {
  id: number
  nama_parameter: string
  nama_kategori: string
  min_value: number
  max_value: number
  satuan: string | null
} & RowDataPacket

export async function createKategoriSensor(
  parameterId: number,
  namaKategori: string,
  minValue: number,
  maxValue: number
) {
  const [result] = await db.query<ResultSetHeader>(
    `
        INSERT INTO sensor_kategori (parameter_id, nama_kategori, min_value, max_value)
        VALUES (?, ?, ?, ?)
      `,
    [parameterId, namaKategori, minValue, maxValue]
  )
  return result
}

export async function fetchKategoriSensor() {
  const [rows] = await db.query<SensorKategoriRow[]>(
    `
        SELECT sk.id, sp.nama_parameter, sk.nama_kategori, sk.min_value, sk.max_value, sp.satuan
        FROM sensor_kategori sk
        JOIN sensor_parameter sp ON sk.parameter_id = sp.id
        ORDER BY sk.parameter_id ASC
    `
  )
  return rows
}

// sensor buffer
type SensorLogRow = {
  id: number
  kode_node_id: number
  ph: number
  kelembapan: number
  suhu: number
  nitrogen: number
  total_data: number
  start_at: string
  end_at: string
} & RowDataPacket

export async function addSensorBuffer(
  kodeNodeId: number,
  ph: number,
  kelembapan: number,
  suhu: number,
  nitrogen: number
) {
  const [result] = await db.query<ResultSetHeader>(
    `
        INSERT INTO sensor_buffer (kode_node_id, ph, kelembapan, suhu, nitrogen)
        VALUES (?, ?, ?, ?, ?)
      `,
    [kodeNodeId, ph, kelembapan, suhu, nitrogen]
  )
  return result
}

// export async function processSensorBuffer(kodeNodeId: number) {
//   const [result] = await db.query<ResultSetHeader>(
//     `
//     INSERT INTO sensor_log (
//       kode_node_id,
//       ph,
//       kelembapan,
//       suhu,
//       nitrogen,
//       total_data,
//       start_at,
//       end_at
//     )
//     SELECT
//       kode_node_id,
//       ROUND(AVG(ph), 2) AS ph,
//       ROUND(AVG(kelembapan), 2) AS kelembapan,
//       ROUND(AVG(suhu), 2) AS suhu,
//       ROUND(AVG(nitrogen), 2) AS nitrogen,
//       COUNT(id) AS total_data,

//       TIMESTAMP(DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00')) AS start_at,
//       DATE_ADD(
//         TIMESTAMP(DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00')),
//         INTERVAL 1 HOUR
//       ) AS end_at

//     FROM sensor_buffer
//     WHERE kode_node_id = ?
//       AND created_at < TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00:00'))

//     GROUP BY 
//       kode_node_id,
//       TIMESTAMP(DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00'))

//     ON DUPLICATE KEY UPDATE
//       ph = VALUES(ph),
//       kelembapan = VALUES(kelembapan),
//       suhu = VALUES(suhu),
//       nitrogen = VALUES(nitrogen),
//       total_data = VALUES(total_data),
//       end_at = VALUES(end_at)
//     `,
//     [kodeNodeId]
//   )

//   return result
// }

// export async function deleteSensorBuffer(kodeNodeId: number) {
//   const [result] = await db.query<ResultSetHeader>(
//     `
//       DELETE sb
//       FROM sensor_buffer sb
//       JOIN sensor_log sl
//         ON sl.kode_node_id = sb.kode_node_id
//         AND sb.created_at >= sl.start_at
//         AND sb.created_at < sl.end_at
//       WHERE sb.kode_node_id = ?
//         AND sb.created_at < TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00:00'))
//       `,
//     [kodeNodeId]
//   )

//   return result
// }

export async function processSensorBufferHourly(kodeNodeId: number) {
  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    // 1. Hitung rata-rata data buffer yang jamnya sudah selesai
    const [insertResult] = await connection.query<ResultSetHeader>(
      `
      INSERT INTO sensor_log (
        kode_node_id,
        ph,
        kelembapan,
        suhu,
        nitrogen,
        total_data,
        start_at,
        end_at
      )
      SELECT
        kode_node_id,
        ROUND(AVG(ph), 2) AS ph,
        ROUND(AVG(kelembapan), 2) AS kelembapan,
        ROUND(AVG(suhu), 2) AS suhu,
        ROUND(AVG(nitrogen), 2) AS nitrogen,
        COUNT(id) AS total_data,

        TIMESTAMP(DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00')) AS start_at,
        DATE_ADD(
          TIMESTAMP(DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00')),
          INTERVAL 1 HOUR
        ) AS end_at

      FROM sensor_buffer
      WHERE kode_node_id = ?
        AND created_at < TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00:00'))

      GROUP BY 
        kode_node_id,
        TIMESTAMP(DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00'))

      ON DUPLICATE KEY UPDATE
        ph = VALUES(ph),
        kelembapan = VALUES(kelembapan),
        suhu = VALUES(suhu),
        nitrogen = VALUES(nitrogen),
        total_data = VALUES(total_data),
        end_at = VALUES(end_at)
      `,
      [kodeNodeId]
    )

    // 2. Hapus buffer yang sudah masuk ke sensor_log
    const [deleteResult] = await connection.query<ResultSetHeader>(
      `
      DELETE sb
      FROM sensor_buffer sb
      JOIN sensor_log sl
        ON sl.kode_node_id = sb.kode_node_id
        AND sb.created_at >= sl.start_at
        AND sb.created_at < sl.end_at
      WHERE sb.kode_node_id = ?
        AND sb.created_at < TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00:00'))
      `,
      [kodeNodeId]
    )

    await connection.commit()

    return {
      status: true,
      message: "Sensor buffer berhasil diproses",
      insertedOrUpdatedRows: insertResult.affectedRows,
      deletedBufferRows: deleteResult.affectedRows,
    }
  } catch (error: any) {
    await connection.rollback()

    return {
      status: false,
      message: error.message || "Gagal memproses sensor buffer",
    }
  } finally {
    connection.release()
  }
}