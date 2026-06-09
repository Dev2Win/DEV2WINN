import { headers } from 'next/headers';
import { DashboardWorkspace } from '../../../components/DashboardWorkspace';
import { requireServerSession } from '../../../lib/server-session';
import type { MenteeRoleProfile, MentorRoleProfile } from '../../../lib/types';

const SERVER_URL = process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:4000';

export default async function DashboardPage() {
  const session = await requireServerSession();
  const headerStore = await headers();
  const cookie = headerStore.get('cookie') ?? '';
  const response = await fetch(`${SERVER_URL}/v1/users/me/role-profile`, {
    headers: cookie ? { cookie } : undefined,
    cache: 'no-store',
  }).catch(() => null);

  let roleProfile = null;
  if (response?.ok) {
    const body = (await response.json().catch(() => null)) as { profile?: unknown } | null;
    roleProfile = body?.profile ?? null;
  }

  return (
    <DashboardWorkspace
      user={session.user}
      csrfToken={session.csrfToken}
      roleProfile={roleProfile as MentorRoleProfile | MenteeRoleProfile | null}
    />
  );
}
