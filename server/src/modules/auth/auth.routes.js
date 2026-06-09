import { Router } from 'express';
import { LoginBody, PasswordResetConfirmBody, PasswordResetRequestBody, RegisterBody } from '../../contracts/auth.js';
import { env } from '../../config/env.js';
import { Errors } from '../../lib/errors.js';
import { buildOauthStart, exchangeOauthCode, fetchOauthIdentity, OAUTH_STATE_COOKIE, parseOauthState, signOauthState } from '../../lib/oauth.js';
import { loadAuth, requireAuth, requireCsrf } from '../../lib/auth.js';
import {
  clearSessionCookie,
  createSession,
  destroySession,
  readSessionCookie,
  setSessionCookie,
} from '../../lib/session.js';
import { authService } from './auth.service.js';

export const authRouter = Router();

authRouter.post('/v1/auth/register', async (req, res) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    throw Errors.validation('Invalid registration payload', parsed.error.flatten());
  }

  const user = await authService.register(parsed.data);
  const { sessionId, csrfToken } = await createSession(user.id);
  setSessionCookie(res, sessionId, csrfToken);
  res.status(201).json({ user, csrfToken });
});

authRouter.post('/v1/auth/login', async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    throw Errors.validation('Invalid login payload', parsed.error.flatten());
  }

  const user = await authService.login(parsed.data);
  const { sessionId, csrfToken } = await createSession(user.id);
  setSessionCookie(res, sessionId, csrfToken);
  res.json({ user, csrfToken });
});

authRouter.post('/v1/auth/logout', requireAuth, requireCsrf, async (req, res) => {
  const sessionId = req.auth?.sessionId ?? readSessionCookie(req);
  await destroySession(sessionId);
  clearSessionCookie(res);
  res.status(204).send();
});

authRouter.get('/v1/auth/session', async (req, res) => {
  const auth = await loadAuth(req, res);
  if (!auth) {
    return res.json({ user: null, csrfToken: null });
  }

  res.json({ user: auth.user, csrfToken: auth.session.csrfToken ?? null });
});

authRouter.get('/v1/auth/oauth/:provider/start', async (req, res) => {
  const provider = req.params.provider;
  const role = req.query.role === 'mentor' ? 'mentor' : 'mentee';
  const mode = req.query.mode === 'signup' ? 'signup' : 'login';
  const { location, payload } = buildOauthStart(provider, role, mode);
  res.cookie(OAUTH_STATE_COOKIE, signOauthState(payload), {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    signed: true,
    path: '/',
    maxAge: 1000 * 60 * 10,
  });
  res.redirect(location);
});

authRouter.get('/v1/auth/oauth/:provider/callback', async (req, res) => {
  const provider = req.params.provider;
  const { code, state } = req.query;
  if (typeof code !== 'string' || typeof state !== 'string') {
    throw Errors.validation('Invalid OAuth callback payload');
  }

  const stored = parseOauthState(req.signedCookies?.[OAUTH_STATE_COOKIE]);
  if (!stored || stored.provider !== provider || stored.state !== state) {
    throw Errors.forbidden('OAuth state validation failed');
  }

  const token = await exchangeOauthCode(provider, code, stored.redirectUri);
  const identity = await fetchOauthIdentity(provider, token.access_token);
  const user = await authService.oauthLogin({
    ...identity,
    role: stored.role === 'mentor' ? 'mentor' : 'mentee',
  });
  const { sessionId, csrfToken } = await createSession(user.id);
  setSessionCookie(res, sessionId, csrfToken);
  res.clearCookie(OAUTH_STATE_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    signed: true,
    path: '/',
  });
  res.redirect(`${new URL('/dashboard', env.CLIENT_URL).toString()}?oauth=success`);
});

authRouter.post('/v1/auth/password-reset/request', async (req, res) => {
  const parsed = PasswordResetRequestBody.safeParse(req.body);
  if (!parsed.success) {
    throw Errors.validation('Invalid password reset payload', parsed.error.flatten());
  }
  const result = await authService.requestPasswordReset(parsed.data);
  res.status(202).json(result);
});

authRouter.post('/v1/auth/password-reset/confirm', async (req, res) => {
  const parsed = PasswordResetConfirmBody.safeParse(req.body);
  if (!parsed.success) {
    throw Errors.validation('Invalid password reset confirmation payload', parsed.error.flatten());
  }
  const user = await authService.resetPassword(parsed.data);
  const { sessionId, csrfToken } = await createSession(user.id);
  setSessionCookie(res, sessionId, csrfToken);
  res.json({ user, csrfToken });
});
