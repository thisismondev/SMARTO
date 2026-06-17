import type { ResultSetHeader, RowDataPacket } from "mysql2"
import db from "@/lib/db"

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role_id: number;
  role: string;
  status: number;
};

type Petani = {
  id: number;
  name: string;
} & RowDataPacket

export async function findByIdentifier(identifier: string) {
  const [rows] = await db.query(
    `
      SELECT u.id, u.name, u.username, u.email, u.password, u.role_id, r.role
      FROM users u 
      JOIN user_role r ON u.role_id = r.id
      WHERE (u.username = ? OR u.email = ?) AND u.status = 0
      `,
    [identifier, identifier]
  )

  const users = rows as Omit<User, "status">[]

  return users[0] || null
}

export async function findUserByUsernameOrEmail(email: string, username: string) {
  const [rows] = await db.query(
    `
    SELECT id, name, username, email
    FROM users
    WHERE (username = ? OR email = ?) AND status = 0
    LIMIT 1
    `,
    [username, email]
  )

  const users = rows as Omit<User, "password" | "role_id" | "role" | "status">[]

  return users[0] || null
}

// belum fix
export async function findUserById(id: number) {
  const [rows] = await db.query(
    `
    SELECT id, name, username, email, role_id, status
    FROM users
    WHERE id = ? AND status = 0
    LIMIT 1
    `,
    [id]
  )

  const users = rows as Omit<User, "password">[]
  return users[0] || null
}

export async function createUser(data: {
  name: string
  username: string
  email: string
  password: string
  roleId: number
}) {
  const [result] = await db.query<ResultSetHeader>(
    `
    INSERT INTO users (name, username, email, password, role_id)
    VALUES (?, ?, ?, ?, ?)
    `,
    [data.name, data.username, data.email, data.password, data.roleId]
  )

  return result
}

export async function updateUserPassword(data: {
  userId: number
  password: string
}) {
  const [result] = await db.query<ResultSetHeader>(
     `
      UPDATE users SET password = ? 
      WHERE id = ? AND status = 0
      `,
      [data.password, data.userId],
  )

  return result
}

export async function findUsers(){
  const [result] = await db.query(
    `
    SELECT u.id, u.name, u.username, u.email, u.role_id, r.role, u.status
    FROM users u 
    JOIN user_role r ON u.role_id = r.id
    WHERE u.role_id = 3 AND u.status = 0
    ORDER BY u.role_id ASC, u.name ASC
    `
  )

  return result as Omit<User, "password">[]
}

export async function adminFindUsers(){
  const [result] = await db.query(
    `
    SELECT u.id, u.name, u.username, u.email, u.password, u.role_id, r.role, u.status
    FROM users u 
    JOIN user_role r ON u.role_id = r.id
    ORDER BY u.role_id ASC, u.name ASC
    `
  )

  return result as User[]
}

export async function findUserPetani(){
  const [result] = await db.query<Petani[]>(
    `
    SELECT id, name
    FROM users
    WHERE role_id = 3 AND status = 0
    `
  )

  return result as Petani[]
}

export async function inactiveById(userId: number) {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE users SET status = 1 
    WHERE id = ?
    `,
    [userId],
  )
  return result
}

export async function activeById(userId: number) {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE users SET status = 0
    WHERE id = ?
    `,
    [userId],
  )
  return result
}