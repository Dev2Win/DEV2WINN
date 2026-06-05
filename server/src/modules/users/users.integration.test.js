/**
 * Integration test for the users vertical slice (route -> service -> repository ->
 * stored procedure -> MySQL). Requires a migrated MySQL (docker compose up + npm
 * run db:migrate). Skips automatically if the DB is unreachable so unit-only CI
 * and laptops without Docker still pass.
 */
import { describe, it, expect, afterAll } from 'vitest';
import { pool } from '../../db/pool.js';
import { usersService } from './users.service.js';

// Top-level check so describe.runIf sees the real value at collection time.
let dbUp = false;
try {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  dbUp = true;
} catch {
  dbUp = false;
}

afterAll(async () => {
  await pool.end().catch(() => {});
});

describe.runIf(dbUp)('users vertical slice (integration)', () => {
  const email = `test_${Date.now()}@dev2win.local`;

  it('creates a user via sp_user_create', async () => {
    const user = await usersService.create({
      email,
      firstName: 'Test',
      lastName: 'User',
      role: 'mentee',
    });
    expect(user.email).toBe(email);
    expect(user.role).toBe('mentee');
    expect(user.id).toBeTruthy();
  });

  it('signals EMAIL_TAKEN on duplicate', async () => {
    await expect(
      usersService.create({ email, firstName: null, lastName: null, role: 'mentee' }),
    ).rejects.toThrow();
  });
});
