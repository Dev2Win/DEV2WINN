import { randomBytes, randomUUID } from 'node:crypto';
import { env } from '../config/env.js';
import { redis } from './redis.js';

export const SESSION_COOKIE = 'dev2win_session';
export const CSRF_COOKIE = 'dev2win_csrf';
const SESSION_PREFIX = 'session:';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function sessionKey(sessionId) {
  return `${SESSION_PREFIX}${sessionId}`;
}

function createCsrfToken() {
  return randomBytes(24).toString('base64url');
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    signed: true,
    path: '/',
    maxAge: SESSION_TTL_SECONDS * 1000,
  };
}

function csrfCookieOptions() {
  return {
    httpOnly: false,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    signed: false,
    path: '/',
    maxAge: SESSION_TTL_SECONDS * 1000,
  };
}

export async function createSession(userId) {
  const sessionId = randomUUID();
  const csrfToken = createCsrfToken();
  await redis.set(
    sessionKey(sessionId),
    JSON.stringify({ userId, csrfToken }),
    'EX',
    SESSION_TTL_SECONDS,
  );
  return { sessionId, csrfToken };
}

export async function getSession(sessionId) {
  if (!sessionId) return null;
  const raw = await redis.get(sessionKey(sessionId));
  if (!raw) return null;
  await redis.expire(sessionKey(sessionId), SESSION_TTL_SECONDS);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function destroySession(sessionId) {
  if (!sessionId) return;
  await redis.del(sessionKey(sessionId));
}

export async function rotateCsrfToken(sessionId, session) {
  if (!sessionId || !session?.userId) return null;
  const next = { ...session, csrfToken: createCsrfToken() };
  await redis.set(sessionKey(sessionId), JSON.stringify(next), 'EX', SESSION_TTL_SECONDS);
  return next;
}

export function setSessionCookie(res, sessionId, csrfToken) {
  res.cookie(SESSION_COOKIE, sessionId, cookieOptions());
  if (csrfToken) {
    res.cookie(CSRF_COOKIE, csrfToken, csrfCookieOptions());
  }
}

export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, cookieOptions());
  res.clearCookie(CSRF_COOKIE, csrfCookieOptions());
}

export function readSessionCookie(req) {
  return req.signedCookies?.[SESSION_COOKIE] ?? null;
}
