import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

/**
 * Single shared MySQL connection pool. All data access goes through stored
 * procedures (CALL sp_*) via repository methods — never ad-hoc SQL in services.
 */
export const pool = mysql.createPool({
  host: env.MYSQL_HOST,
  port: env.MYSQL_PORT,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

/**
 * Call a stored procedure and return its first result set.
 * mysql2 returns [resultSets, fields]; a CALL yields rows in resultSets[0].
 * @param {string} name procedure name
 * @param {unknown[]} params positional params
 */
export async function callProc(name, params = []) {
  const placeholders = params.map(() => '?').join(', ');
  const [sets] = await pool.query(`CALL ${name}(${placeholders})`, params);
  const rows = Array.isArray(sets) ? sets[0] : sets;
  return rows ?? [];
}

export async function pingDb() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    return true;
  } finally {
    conn.release();
  }
}
