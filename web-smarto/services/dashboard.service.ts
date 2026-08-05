import type { RowDataPacket } from "mysql2"
import db from "@/lib/db"

export async function fetchDashboardData() {
  const [rows] = await db.query<RowDataPacket[]>(
    `
        SELECT
            u.total_user,
            up.total_penyuluh,
            upt.total_petani,
            n.total_node,
            na.total_node_active,
            ni.total_node_inactive,
            rb.total_rule_base
        FROM
        (SELECT COUNT(*) AS total_user FROM users) u,
        (SELECT COUNT(*) AS total_penyuluh FROM users where role_id = 2) up,
        (SELECT COUNT(*) AS total_petani FROM users where role_id = 3) upt,
        (SELECT COUNT(*) AS total_node FROM nodes) n,
        (SELECT COUNT(*) AS total_node_active FROM nodes WHERE status = 0) na,
        (SELECT COUNT(*) AS total_node_inactive FROM nodes WHERE status = 1) ni,
        (SELECT COUNT(*) AS total_rule_base FROM rule_base) rb
        `
  )

  return rows[0]
}
