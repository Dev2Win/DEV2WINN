import { describe, it, expect } from 'vitest';
import { CreateUserBody } from './users.js';

describe('CreateUserBody', () => {
  it('applies defaults', () => {
    const parsed = CreateUserBody.parse({ email: 'a@b.com' });
    expect(parsed.role).toBe('mentee');
    expect(parsed.firstName).toBeNull();
  });

  it('rejects a bad email', () => {
    const result = CreateUserBody.safeParse({ email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid role', () => {
    const result = CreateUserBody.safeParse({ email: 'a@b.com', role: 'king' });
    expect(result.success).toBe(false);
  });
});
