import type { ResultSetHeader, RowDataPacket } from "mysql2"
import db from "@/lib/db"

type RuleBase = {
  id: number
  kode_rule: string
  ph_kategori_id: number
  kelembapan_kategori_id: number
  suhu_kategori_id: number
  nitrogen_kategori_id: number
  ph: string
  kelembapan: string
  suhu: string
  nitrogen: string
  output: string
} & RowDataPacket

type RuleBaseRow = {
  id: number
  kode_rule: string
} & RowDataPacket

export async function fetchRuleBase() {
  const [rows] = await db.query<RuleBase[]>(
    `
        SELECT 
            rb.id,
            rb.kode_rule,
            rb.ph_kategori_id,
            rb.kelembapan_kategori_id,
            rb.suhu_kategori_id,
            rb.nitrogen_kategori_id,
            sk_ph.nama_kategori AS ph,
            sk_kel.nama_kategori AS kelembapan,
            sk_suhu.nama_kategori AS suhu,
            sk_nit.nama_kategori AS nitrogen,
            rb.output
        FROM rule_base rb
        JOIN sensor_kategori sk_ph on sk_ph.id = rb.ph_kategori_id
        JOIN sensor_kategori sk_kel on sk_kel.id = rb.kelembapan_kategori_id
        JOIN sensor_kategori sk_suhu on sk_suhu.id = rb.suhu_kategori_id
        JOIN sensor_kategori sk_nit on sk_nit.id = rb.nitrogen_kategori_id
        ORDER BY LENGTH(rb.kode_rule) ASC, rb.kode_rule ASC 
    `
  )
  return rows
}

export async function addRuleBaseDetail(
  kode_rule: string,
  ph_kategori_id: number,
  kelembapan_kategori_id: number,
  suhu_kategori_id: number,
  nitrogen_kategori_id: number,
  output: string
) {
  const [result] = await db.query<ResultSetHeader>(
    `
        INSERT INTO rule_base (kode_rule, ph_kategori_id, kelembapan_kategori_id, suhu_kategori_id, nitrogen_kategori_id, output)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
    [
      kode_rule,
      ph_kategori_id,
      kelembapan_kategori_id,
      suhu_kategori_id,
      nitrogen_kategori_id,
      output,
    ]
  )
  return result
}

export async function updateRuleBase(
  id: number,
  body: {
    ph_kategori_id: number
    kelembapan_kategori_id: number
    suhu_kategori_id: number
    nitrogen_kategori_id: number
    output: string
  }
) {
  const [result] = await db.query<ResultSetHeader>(
    `
        UPDATE rule_base
        SET 
            ph_kategori_id = ?,
            kelembapan_kategori_id = ?,
            suhu_kategori_id = ?,
            nitrogen_kategori_id = ?,
            output = ?
        WHERE id = ?
        `,
    [
      body.ph_kategori_id,
      body.kelembapan_kategori_id,
      body.suhu_kategori_id,
      body.nitrogen_kategori_id,
      body.output,
      id,
    ]
  )

  return result
}

export async function checkRuleBase(id: number) {
  const [rows] = await db.query<RuleBaseRow[]>(
    `
        SELECT id, kode_rule 
        FROM rule_base WHERE id = ?
        `,
    [id]
  )
  return rows
}

export async function findLastRuleBase() {
  const [rows] = await db.query<RuleBaseRow[]>(
    `
    SELECT id, kode_rule
    FROM rule_base
    ORDER BY id DESC
    LIMIT 1
    `
  )

  return rows[0]
}
