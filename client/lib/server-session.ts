import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { AuthUser, SessionResponse } from './types';

const SERVER_URL = process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:4000';

async function fetchServerSession(): Promise<SessionResponse> {
  const headerStore = await headers();
  const cookie = headerStore.get('cookie') ?? '';
  const response = await fetch(`${SERVER_URL}/v1/auth/session`, {
    headers: { cookie },
    cache: 'no-store',
  });
  if (!response.ok) {
    return { user: null, csrfToken: null };
  }
  return (await response.json()) as SessionResponse;
}

export async function getOptionalServerSession() {
  return fetchServerSession();
}

export async function requireServerSession() {
  const session = await fetchServerSession();
  if (!session.user) {
    redirect('/login');
  }
  return session as { user: AuthUser; csrfToken: string | null };
}
