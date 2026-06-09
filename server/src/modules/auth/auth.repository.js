import { callProc } from '../../db/pool.js';

export const authRepository = {
  register({ email, firstName, lastName, role, passwordHash }) {
    return callProc('sp_auth_register', [email, firstName, lastName, role, passwordHash]);
  },

  getLoginByEmail(email) {
    return callProc('sp_auth_get_login_by_email', [email]);
  },

  getOauthAccount(provider, providerUserId) {
    return callProc('sp_auth_get_oauth_account', [provider, providerUserId]);
  },

  linkOauthAccount({ userId, provider, providerUserId, email, emailVerified }) {
    return callProc('sp_auth_link_oauth_account', [userId, provider, providerUserId, email, emailVerified ? 1 : 0]);
  },

  createPasswordResetToken({ userId, tokenHash, expiresAt }) {
    return callProc('sp_auth_create_password_reset_token', [userId, tokenHash, expiresAt]);
  },

  getPasswordResetToken(tokenHash) {
    return callProc('sp_auth_get_password_reset_token', [tokenHash]);
  },

  markPasswordResetUsed(tokenId) {
    return callProc('sp_auth_mark_password_reset_used', [tokenId]);
  },

  updatePasswordHash({ userId, passwordHash }) {
    return callProc('sp_auth_update_password_hash', [userId, passwordHash]);
  },
};
