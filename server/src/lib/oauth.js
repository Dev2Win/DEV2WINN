import { createHash, randomBytes } from 'node:crypto';
import { env } from '../config/env.js';
import { Errors } from './errors.js';

export const OAUTH_STATE_COOKIE = 'dev2win_oauth_state';

const PROVIDERS = {
  google: {
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
    scope: 'openid email profile',
  },
  github: {
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userUrl: 'https://api.github.com/user',
    emailsUrl: 'https://api.github.com/user/emails',
    scope: 'read:user user:email',
  },
};

function getProviderConfig(provider) {
  const config = PROVIDERS[provider];
  if (!config) throw Errors.validation('Unsupported OAuth provider');
  return config;
}

export function buildOauthStart(provider, role = 'mentee', mode = 'login') {
  const state = randomBytes(24).toString('base64url');
  const redirectUri = `${env.OAUTH_REDIRECT_BASE}/v1/auth/oauth/${provider}/callback`;
  const config = getProviderConfig(provider);
  const params = new URLSearchParams({
    client_id: provider === 'google' ? env.GOOGLE_CLIENT_ID : env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: config.scope,
    state,
  });

  if (provider === 'google') {
    params.set('prompt', 'select_account');
    params.set('access_type', 'offline');
  }

  return {
    state,
    location: `${config.authorizeUrl}?${params.toString()}`,
    payload: { provider, role, mode, redirectUri, state },
  };
}

export async function exchangeOauthCode(provider, code, redirectUri) {
  const config = getProviderConfig(provider);
  const body = new URLSearchParams({
    client_id: provider === 'google' ? env.GOOGLE_CLIENT_ID : env.GITHUB_CLIENT_ID,
    client_secret: provider === 'google' ? env.GOOGLE_CLIENT_SECRET : env.GITHUB_CLIENT_SECRET,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  const token = await response.json().catch(() => null);
  if (!response.ok || !token?.access_token) {
    throw Errors.unauthorized('OAuth token exchange failed');
  }
  return token;
}

export async function fetchOauthIdentity(provider, accessToken) {
  if (provider === 'google') {
    const response = await fetch(PROVIDERS.google.userInfoUrl, {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.sub || !body?.email) {
      throw Errors.unauthorized('Google account details are unavailable');
    }
    return {
      provider,
      providerUserId: body.sub,
      email: String(body.email).toLowerCase(),
      emailVerified: Boolean(body.email_verified),
      firstName: body.given_name ?? null,
      lastName: body.family_name ?? null,
    };
  }

  const [userResponse, emailsResponse] = await Promise.all([
    fetch(PROVIDERS.github.userUrl, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        accept: 'application/vnd.github+json',
        'user-agent': 'dev2win',
      },
    }),
    fetch(PROVIDERS.github.emailsUrl, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        accept: 'application/vnd.github+json',
        'user-agent': 'dev2win',
      },
    }),
  ]);
  const user = await userResponse.json().catch(() => null);
  const emails = await emailsResponse.json().catch(() => null);
  const primary = Array.isArray(emails)
    ? emails.find((entry) => entry?.primary) ?? emails.find((entry) => entry?.verified)
    : null;

  if (!userResponse.ok || !emailsResponse.ok || !user?.id || !primary?.email) {
    throw Errors.unauthorized('GitHub account details are unavailable');
  }

  const [firstName, ...rest] = String(user.name ?? '').trim().split(/\s+/).filter(Boolean);
  return {
    provider,
    providerUserId: String(user.id),
    email: String(primary.email).toLowerCase(),
    emailVerified: Boolean(primary.verified),
    firstName: firstName ?? null,
    lastName: rest.length ? rest.join(' ') : null,
  };
}

export function signOauthState(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function parseOauthState(value) {
  if (!value) return null;
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export function hashToken(value) {
  return createHash('sha256').update(value).digest('hex');
}
