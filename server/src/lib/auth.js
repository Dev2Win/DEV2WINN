import { Errors } from './errors.js';
import { clearSessionCookie, getSession, readSessionCookie } from './session.js';
import { usersRepository } from '../modules/users/users.repository.js';

export async function loadAuth(req, res) {
  const sessionId = readSessionCookie(req);
  const session = await getSession(sessionId);
  if (!session?.userId) {
    if (sessionId) clearSessionCookie(res);
    req.auth = null;
    return null;
  }

  const [user] = await usersRepository.getById(session.userId);
  if (!user) {
    clearSessionCookie(res);
    req.auth = null;
    return null;
  }

  req.auth = { sessionId, session, user };
  return req.auth;
}

export async function requireAuth(req, res, next) {
  const auth = await loadAuth(req, res);
  if (!auth) throw Errors.unauthorized('Authentication required');
  next();
}

export function requireCsrf(req, _res, next) {
  const expected = req.auth?.session?.csrfToken;
  const provided = req.get('x-csrf-token');
  const cookieToken = req.cookies?.dev2win_csrf;
  if (!expected || !provided || !cookieToken || provided !== expected || cookieToken !== expected) {
    throw Errors.forbidden('Invalid CSRF token');
  }
  next();
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    const role = req.auth?.user?.role;
    if (!role || !roles.includes(role)) {
      throw Errors.forbidden('You do not have permission to perform this action');
    }
    next();
  };
}
