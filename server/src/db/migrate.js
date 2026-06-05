/**
 * Minimal forward-only migration runner.
 *
 * Applies every `.sql` file in ../../db/migrations (sorted by filename) that
 * hasn't been applied yet, tracking applied files in a `_migrations` table.
 * Statements are separated by a line that is exactly the delimiter token, so
 * multi-statement files (incl. procedures with their own `;`) run cleanly. A
 * line-exact match means the token can still be mentioned inside prose comments.
 *
 * For production, consider swapping this for dbmate/Flyway. This keeps P0 simple.
 */
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(here, '../../../db/migrations');
const DELIMITER = '-- @statement';

/** Split a migration into statements on lines equal to the delimiter token,
 *  dropping segments that contain only comments/whitespace. */
function splitStatements(sql) {
  const segments = [];
  let current = [];
  for (const line of sql.split(/\r?\n/)) {
    if (line.trim() === DELIMITER) {
      segments.push(current.join('\n'));
      current = [];
    } else {
      current.push(line);
    }
  }
  segments.push(current.join('\n'));

  return segments
    .map((s) => s.trim())
    .filter((s) => {
      const meaningful = s
        .split(/\r?\n/)
        .filter((l) => l.trim() && !l.trim().startsWith('--'));
      return meaningful.length > 0;
    });
}

async function main() {
  const conn = await mysql.createConnection({
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    multipleStatements: true,
  });

  await conn.query(
    `CREATE TABLE IF NOT EXISTS _migrations (
       name VARCHAR(255) PRIMARY KEY,
       applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     )`,
  );

  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const [appliedRows] = await conn.query('SELECT name FROM _migrations');
  const applied = new Set(appliedRows.map((r) => r.name));

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`· skip   ${file}`);
      continue;
    }
    const sql = await readFile(path.join(MIGRATIONS_DIR, file), 'utf8');
    const statements = splitStatements(sql);

    console.log(`▶ apply  ${file} (${statements.length} statement(s))`);
    for (const stmt of statements) {
      await conn.query(stmt);
    }
    await conn.query('INSERT INTO _migrations (name) VALUES (?)', [file]);
  }

  await conn.end();
  console.log('✓ migrations up to date');
}

main().catch((err) => {
  console.error('migration failed:', err);
  process.exit(1);
});
