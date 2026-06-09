import { randomBytes } from 'node:crypto';
import argon2 from 'argon2';
import { Errors } from '../../lib/errors.js';
import { authRepository } from './auth.repository.js';
import { usersRepository } from '../users/users.repository.js';
import { hashToken } from '../../lib/oauth.js';
import { queue } from '../../worker/index.js';

export const authService = {
  async register({ email, password, firstName, lastName, role }) {
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const [user] = await authRepository.register({
      email: email.toLowerCase(),
      firstName,
      lastName,
      role,
      passwordHash,
    });
    if (!user) throw Errors.internal('User registration failed');
    return user;
  },

  async login({ email, password }) {
    const [record] = await authRepository.getLoginByEmail(email.toLowerCase());
    if (!record?.password_hash) {
      throw Errors.unauthorized('Invalid email or password');
    }

    const valid = await argon2.verify(record.password_hash, password);
    if (!valid) {
      throw Errors.unauthorized('Invalid email or password');
    }

    const { password_hash, ...user } = record;
    return user;
  },

  async getSessionUser(userId) {
    const [user] = await usersRepository.getById(userId);
    if (!user) throw Errors.unauthorized('Session is no longer valid');
    return user;
  },

  async oauthLogin({ provider, providerUserId, email, emailVerified, firstName, lastName, role }) {
    if (!emailVerified) {
      throw Errors.forbidden('Your OAuth provider must supply a verified email address');
    }

    const [oauthAccount] = await authRepository.getOauthAccount(provider, providerUserId);
    if (oauthAccount?.user_id) {
      return this.getSessionUser(oauthAccount.user_id);
    }

    const [existingUser] = await usersRepository.getByEmail(email.toLowerCase());
    let user = existingUser;
    if (!user) {
      const [created] = await usersRepository.create({
        email: email.toLowerCase(),
        firstName,
        lastName,
        role,
      });
      user = created;
    }

    await authRepository.linkOauthAccount({
      userId: user.id,
      provider,
      providerUserId,
      email: email.toLowerCase(),
      emailVerified,
    });

    return this.getSessionUser(user.id);
  },

  async requestPasswordReset({ email }) {
    const [user] = await usersRepository.getByEmail(email.toLowerCase());
    if (!user) {
      return { ok: true };
    }

    const token = randomBytes(32).toString('base64url');
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await authRepository.createPasswordResetToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    await queue.add('send-password-reset-email', {
      userId: user.id,
      email: user.email,
      token,
      expiresAt: expiresAt.toISOString(),
    });

    return { ok: true };
  },

  async resetPassword({ token, password }) {
    const tokenHash = hashToken(token);
    const [resetRecord] = await authRepository.getPasswordResetToken(tokenHash);
    if (!resetRecord) {
      throw Errors.unauthorized('Reset token is invalid or has expired');
    }
    if (resetRecord.used_at) {
      throw Errors.unauthorized('Reset token has already been used');
    }
    if (new Date(resetRecord.expires_at).getTime() < Date.now()) {
      throw Errors.unauthorized('Reset token is invalid or has expired');
    }

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    await authRepository.updatePasswordHash({
      userId: resetRecord.user_id,
      passwordHash,
    });
    await authRepository.markPasswordResetUsed(resetRecord.id);

    return this.getSessionUser(resetRecord.user_id);
  },
};
