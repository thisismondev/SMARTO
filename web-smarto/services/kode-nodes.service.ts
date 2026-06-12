import type { ResultSetHeader, RowDataPacket } from "mysql2"
import db from "@/lib/db"

type KodeNodeRow = {
  id: number
  kode_node: string
  status: number
} & RowDataPacket

type CheckKodeNodeRow = {
  id: number
  kode_node: string
  kn_status: number
  n_status: number
} & RowDataPacket




export async function createKodeNode(kodeNode: string) {
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO kode_node (kode_node) 
        VALUES (?)`,
    [kodeNode]
  )
  return result
}

export async function findByKodeNode(kodeNode: string) {
  const [rows] = await db.query<KodeNodeRow[]>(
    `
    SELECT id, kode_node, status
    FROM kode_node
    WHERE kode_node = ?
    LIMIT 1
    `,
    [kodeNode]
  )
  return rows[0] || null
}

export async function checkingKodeNode(kodeNode: string) {
  const [rows] = await db.query<CheckKodeNodeRow[]>(
    `
    SELECT kn.id, kn.kode_node, kn.status as kn_status, n.status as n_status
    FROM kode_node kn
    LEFT JOIN nodes n ON kn.id = n.kode_node_id
    WHERE kn.kode_node = ?
    LIMIT 1
    `,
    [kodeNode]
  )
  return rows[0] || null
}

export async function findKodeNodeById(kodeNodeId: number) {
  const [rows] = await db.query<KodeNodeRow[]>(
    `
    SELECT id, kode_node, status
    FROM kode_node
    WHERE id = ?
    LIMIT 1
    `,
    [kodeNodeId]
  )
  return rows[0] || null
}

export async function inactiveNodeKode(kodeNodeId: number) {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE kode_node
    SET status = 1
    WHERE id = ?
    `,
    [kodeNodeId]
  )
  return result
}

export async function activeNodeKode(kodeNodeId: number) {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE kode_node
    SET status = 0
    WHERE id = ?
    `,
    [kodeNodeId]
  )
  return result
}

export async function fetchKodeNodes() {
  const [result] = await db.query<ResultSetHeader>(
    `
        SELECT kn.id, kn.kode_node, kn.status as kn_status, n.status
        FROM kode_node kn
        LEFT JOIN nodes n ON n.kode_node_id = kn.id
        ORDER BY kn.created_at DESC, n.status ASC;

    `
  )
  return result
}