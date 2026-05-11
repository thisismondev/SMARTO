const db = require('../config/db');

const User = {
  create: async ({ roleId, username, email, password }) => {
    const [result] = await db.query(
      `
      INSERT INTO users (role_id, username, email, password) VALUES (?, ?, ?, ?)
      `,
      [roleId, username, email, password],
    );
    return result;
  },

  updatePassword: async (userId, password) => {
    const [result] = await db.query(
      `
      UPDATE users SET password = ? 
      WHERE id = ? AND status = 0
      `,
      [password, userId],
    );
    return result;
  },

  updatePasswordByEmail: async (email, password) => {
    const [result] = await db.query(
      `
      UPDATE users SET password = ? 
      WHERE email = ? AND status = 0
      `,
      [password, email],
    );

    return result;
  },

  update: async (id, data) => {
    try {
      // 1. Ambil nama kolom (keys) dan isinya (values) dari objek data
      const fields = Object.keys(data);
      const values = Object.values(data);

      // 2. Jika data kosong, jangan jalankan query
      if (fields.length === 0) return null;

      // 3. Susun string SET secara dinamis (contoh: "username = ?, email = ?")
      const setClause = fields.map((field) => `${field} = ?`).join(', ');

      // 4. Masukkan ID ke dalam array values untuk parameter WHERE id = ?
      const queryValues = [...values, id];

      // 5. Eksekusi query
      const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
      const [result] = await db.execute(sql, queryValues);

      return result;
    } catch (err) {
      throw err;
    }
  },

  findUsers: async () => {
    const [result] = await db.query(
      `SELECT u.id, u.username, u.email, u.role_id, r.role
      FROM users u
      JOIN user_role r ON u.role_id = r.id
      WHERE u.role_id != 1 AND u.status = 0
      ORDER BY u.id ASC
      `,
    );
    return result;
  },

  adminFindUsers: async () => {
    const [result] = await db.query(
      `SELECT u.id, u.username, u.email, u.password, u.role_id, r.role, u.status
      FROM users u
      JOIN user_role r ON u.role_id = r.id
      ORDER BY u.id ASC
      `,
    );
    return result;
  },

  inactiveById: async (userId) => {
    const [result] = await db.query(
      `
      UPDATE users SET status = 1 WHERE id = ?
      `,
      [userId],
    );
    return result;
  },

  activeById: async (userId) => {
    const [result] = await db.query(
      `
      UPDATE users SET status = 0 WHERE id = ?
      `,
      [userId],
    );
    return result;
  },

  findById: async (userId) => {
    const [users] = await db.query(
      `
      SELECT * 
      FROM users 
      WHERE id = ?
      `,
      [userId],
    );

    return users[0] || null;
  },

  findByEmail: async (email) => {
    const [rows] = await db.query(
      `
      SELECT * FROM users WHERE email = ? AND status = 0 LIMIT 1
      `,
      [email],
    );
    return rows[0];
  },

  findByIdentifier: async (identifier) => {
    const [users] = await db.query(
      `
      SELECT u.id, u.username, u.email, u.password, u.role_id, u.status, r.role 
      FROM users u 
      JOIN user_role r ON u.role_id = r.id 
      WHERE u.username = ? OR u.email = ?
      `,
      [identifier, identifier],
    );

    return users[0] || null;
  },

  findExistingByUsernameOrEmail: async (username, email, excludeId = null) => {
    const params = [username, email];
    let query = 'SELECT id FROM users WHERE (username = ? OR email = ?)';

    if (excludeId !== null) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const [users] = await db.query(query, params);
    return users;
  },
};

module.exports = User;
