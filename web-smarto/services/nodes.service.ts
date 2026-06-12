import type { ResultSetHeader, RowDataPacket } from "mysql2"
import db from "@/lib/db"

type Node = {
  id: number
  kode_node: string
  user_id: number
  label: string
  lat: string
  lng: string
  interval_sec: string
  status: string
} & RowDataPacket


type CheckingNodeByKodeNodeRow = {
  id: number
  kode_node: string
  status: number
} & RowDataPacket

type NodeKodeRow = {
  id: number
  kode_node_id: number
  user_id: number
  status: number
} & RowDataPacket



export async function findNodeByKodeNodeId(kodeNodeId: number) {
  const [rows] = await db.query<NodeKodeRow[]>(
    `
    SELECT n.id, n.kode_node_id, n.user_id, kn.status
    FROM nodes n
    JOIN kode_node kn ON n.kode_node_id = kn.id
    WHERE kode_node_id = ?
    LIMIT 1
    `,
    [kodeNodeId]
  )

  return rows[0] || null
}

export async function findNodeById(nodeId: number) {
  const [rows] = await db.query<NodeKodeRow[]>(
    `
    SELECT n.id, n.kode_node_id, n.user_id, n.status
    FROM nodes n
    WHERE n.id = ?
    LIMIT 1
    `,
    [nodeId]
  )

  return rows[0] || null
}

export async function checkingNodeById(kodeNodeId: number) {
  const [rows] = await db.query<CheckingNodeByKodeNodeRow[]>(
    `
    SELECT n.id, n.kode_node_id, n.status
    FROM nodes n
    join kode_node kn on n.kode_node_id = kn.id
    WHERE n.kode_node_id = ? AND n.status = 0
    `,
    [kodeNodeId]
  )
  return rows [0] || null
}

export async function setUpNodeByCode(data: {
  kodeNodeId: number
  userId: number
  label: string
  lat: string
  lng: string
}) {
  const [result] = await db.query<ResultSetHeader>(
    `
    INSERT INTO nodes (kode_node_id, user_id, label, latitude, longitude) VALUES (?, ?, ?, ?, ?)
        `,
    [data.kodeNodeId, data.userId, data.label, data.lat, data.lng]
  )
  return result
}

export async function useNodeUser(id: number) {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE nodes
    SET status = 0
    WHERE id = ?
    `,
    [id]
  )

  return result
}

export async function releaseNodeUser(id: number) {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE nodes
    SET status = 1
    WHERE id = ?
    `,
    [id]
  )

  return result
}





export async function updateNodeById(
  nodeId: number,
  data: {
    userId: number
    label: string
    lat: string
    lng: string
  }
) {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE nodes
    SET user_id = ?, label = ?, latitude = ?, longitude = ?
    WHERE id = ?
    `,
    [data.userId, data.label, data.lat, data.lng, nodeId]
  )
  return result
}

export async function fetchNodes() {
  const [result] = await db.query<Node[]>(
    `
        SELECT n.id, kn.kode_node, n.user_id, u.name, n.label, n.latitude, n.longitude, n.interval_sec, n.status
        FROM nodes n
        JOIN users u ON n.user_id = u.id
        JOIN kode_node kn ON kn.id = n.kode_node_id
        ORDER BY u.name ASC
        `
  )
  return result
}