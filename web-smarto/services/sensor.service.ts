import type { ResultSetHeader, RowDataPacket } from "mysql2"
import db from "@/lib/db"
import { getMakassarDateTime, getMakassarPreviousHourRange } from "@/lib/date"

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
  kode_node_id: number
  ph_avg: number
  kelembapan_avg: number
  suhu_avg: number
  nitrogen_avg: number
} & RowDataPacket

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

export async function CheckingSensorBuffer(kodeNodeId: number) {
  const [result] = await db.query<SensorLogRow[]>(
    `SELECT 
      kode_node_id,
      AVG(ph) as ph_avg,
      AVG(kelembapan) as kelembaban_avg,
      AVG(suhu) as suhu_avg,
      AVG(nitrogen) as nitrogen_avg
    FROM sensor_buffer
    WHERE kode_node_id = ?
      AND created_at >= (SELECT MIN(created_at) FROM sensor_buffer)
      AND created_at < (SELECT MIN(created_at) FROM sensor_buffer) + INTERVAL 1 HOUR
    GROUP BY kode_node_id
    LIMIT 1
    `,
    [kodeNodeId]
  )

  return result
}

type CountRow = RowDataPacket & {
  total_data: number
}

export async function processSensorBufferHourly() {
  const { startAt, endAt } = getMakassarPreviousHourRange()
  const createdAt = getMakassarDateTime()

  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    // 1. Cek dulu apakah ada data buffer yang akan diproses
    const [countRows] = await connection.query<CountRow[]>(
      `
      SELECT COUNT(*) AS total_data
      FROM sensor_buffer
      WHERE created_at >= ?
        AND created_at < ?
        AND user_id IS NOT NULL
      `,
      [startAt, endAt]
    )

    const totalData = countRows[0]?.total_data || 0

    if (totalData === 0) {
      await connection.commit()

      return {
        message: "Tidak ada data sensor buffer untuk diproses",
        startAt,
        endAt,
        totalData: 0,
        deletedRows: 0,
      }
    }

    // 2. Insert / update hasil rata-rata ke sensor_log
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
        start_at,
        end_at,
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
        ? AS start_at,
        ? AS end_at,
        ? AS created_at
      FROM sensor_buffer sb
      WHERE sb.created_at >= ?
        AND sb.created_at < ?
        AND sb.user_id IS NOT NULL
      GROUP BY sb.user_id, sb.kode_node_id
      ON DUPLICATE KEY UPDATE
        ph = VALUES(ph),
        kelembapan = VALUES(kelembapan),
        suhu = VALUES(suhu),
        nitrogen = VALUES(nitrogen),
        total_data = VALUES(total_data),
        created_at = VALUES(created_at)
      `,
      [startAt, endAt, createdAt, startAt, endAt]
    )

    // 3. Kalau insert/update berhasil, hapus data buffer pada range yang sudah diproses
    const [deleteResult] = await connection.query<ResultSetHeader>(
      `
      DELETE FROM sensor_buffer
      WHERE created_at >= ?
        AND created_at < ?
        AND user_id IS NOT NULL
      `,
      [startAt, endAt]
    )

    await connection.commit()

    return {
      message: "Sensor buffer berhasil diproses dan dihapus",
      startAt,
      endAt,
      totalData,
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