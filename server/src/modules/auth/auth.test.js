import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoginBody, PasswordResetConfirmBody, PasswordResetRequestBody, RegisterBody } from '../../contracts/auth.js';
import { authService } from './auth.service.js';
import { authRepository } from './auth.repository.js';
import { usersRepository } from '../users/users.repository.js';
import { queue } from '../../worker/index.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('auth contracts and service', () => {
  it('validates register payloads', () => {
    const parsed = RegisterBody.safeParse({
      email: 'person@example.com',
      password: 'super-secret-123',
      role: 'mentee',
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects public admin registration payloads', () => {
    const parsed = RegisterBody.safeParse({
      email: 'person@example.com',
      password: 'super-secret-123',
      role: 'admin',
    });
    expect(parsed.success).toBe(false);
  });

  it('rejects invalid login payloads', () => {
    const parsed = LoginBody.safeParse({
      email: 'nope',
      password: '',
    });
    expect(parsed.success).toBe(false);
  });

  it('registers a user with a hashed password', async () => {
    vi.spyOn(authRepository, 'register').mockResolvedValue([
      {
        id: 'u1',
        email: 'person@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'mentee',
        created_at: new Date().toISOString(),
      },
    ]);

    const user = await authService.register({
      email: 'person@example.com',
      password: 'super-secret-123',
      firstName: 'Test',
      lastName: 'User',
      role: 'mentee',
    });

    expect(user.id).toBe('u1');
    expect(authRepository.register).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'person@example.com',
        passwordHash: expect.any(String),
      }),
    );
  });

  it('rejects invalid login credentials', async () => {
    vi.spyOn(authRepository, 'getLoginByEmail').mockResolvedValue([]);

    await expect(
      authService.login({
        email: 'missing@example.com',
        password: 'bad-password',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('loads the current session user', async () => {
    vi.spyOn(usersRepository, 'getById').mockResolvedValue([
      {
        id: 'u1',
        email: 'person@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'mentee',
        created_at: new Date().toISOString(),
      },
    ]);

    const user = await authService.getSessionUser('u1');
    expect(user.email).toBe('person@example.com');
  });

  it('links a verified oauth identity to an existing user by email', async () => {
    vi.spyOn(authRepository, 'getOauthAccount').mockResolvedValue([]);
    vi.spyOn(usersRepository, 'getByEmail').mockResolvedValue([
      {
        id: 'u1',
        email: 'person@example.com',
        first_name: 'Test',
        last_name: 'User',
        avatar_url: null,
        avatar_public_id: null,
        role: 'mentee',
        created_at: new Date().toISOString(),
      },
    ]);
    vi.spyOn(authRepository, 'linkOauthAccount').mockResolvedValue([{ user_id: 'u1' }]);
    vi.spyOn(usersRepository, 'getById').mockResolvedValue([
      {
        id: 'u1',
        email: 'person@example.com',
        first_name: 'Test',
        last_name: 'User',
        avatar_url: null,
        avatar_public_id: null,
        role: 'mentee',
        created_at: new Date().toISOString(),
      },
    ]);

    const user = await authService.oauthLogin({
      provider: 'google',
      providerUserId: 'oauth-1',
      email: 'person@example.com',
      emailVerified: true,
      firstName: 'Test',
      lastName: 'User',
      role: 'mentee',
    });

    expect(user.id).toBe('u1');
    expect(authRepository.linkOauthAccount).toHaveBeenCalled();
  });

  it('validates password reset request payloads', () => {
    const parsed = PasswordResetRequestBody.safeParse({ email: 'person@example.com' });
    expect(parsed.success).toBe(true);
  });

  it('queues password reset jobs for known users', async () => {
    vi.spyOn(usersRepository, 'getByEmail').mockResolvedValue([
      {
        id: 'u1',
        email: 'person@example.com',
        first_name: 'Test',
        last_name: 'User',
        avatar_url: null,
        avatar_public_id: null,
        role: 'mentee',
        created_at: new Date().toISOString(),
      },
    ]);
    vi.spyOn(authRepository, 'createPasswordResetToken').mockResolvedValue([{ id: 'reset-1' }]);
    vi.spyOn(queue, 'add').mockResolvedValue({});

    const result = await authService.requestPasswordReset({ email: 'person@example.com' });
    expect(result.ok).toBe(true);
    expect(queue.add).toHaveBeenCalledWith(
      'send-password-reset-email',
      expect.objectContaining({ email: 'person@example.com' }),
    );
  });

  it('validates password reset confirmation payloads', () => {
    const parsed = PasswordResetConfirmBody.safeParse({
      token: 'abcdefghijklmnopqrstuvwxyz012345',
      password: 'new-super-secret',
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid or expired password reset tokens', async () => {
    vi.spyOn(authRepository, 'getPasswordResetToken').mockResolvedValue([]);

    await expect(
      authService.resetPassword({
        token: 'abcdefghijklmnopqrstuvwxyz012345',
        password: 'new-super-secret',
      }),
    ).rejects.toThrow('Reset token is invalid or has expired');
  });
});
