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

// Variables
export async function fetchFuzzyVariables() {
  const [rows] = await db.query<RowDataPacket[]>(
    `
    SELECT id, name, unit, type, created_at 
    FROM fuzzy_variables
    ORDER BY id ASC
  `
  )

  return rows
}

// Sets
export async function fetchFuzzySets() {
  const [rows] = await db.query<RowDataPacket[]>(
    ` 
        SELECT fs.id, fs.variable_id, fv.name, fs.set_name, fs.mf_type, fs.param_a, fs.param_b, fs.param_c, fs.param_d, fs.created_at
        FROM fuzzy_sets fs
        JOIN fuzzy_variables fv ON fs.variable_id = fv.id
        ORDER BY fs.variable_id ASC
    `
  )
  return rows
}


export async function createFuzzySets(
  variableId: number,
  setName: string,
  mfType: string,
  a: number,
  b: number,
  c: number,
  d: number
) {
  const [result] = await db.query<ResultSetHeader>(
    `
        INSERT INTO fuzzy_sets (variable_id, set_name, mf_type, param_a, param_b, param_c, param_d)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    [variableId, setName, mfType, a, b, c, d]
  )
  return result
}