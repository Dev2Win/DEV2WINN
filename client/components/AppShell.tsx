'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { logout } from '../lib/api';
import type { AuthUser } from '../lib/types';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/onboarding', label: 'Onboarding' },
  { href: '/profile', label: 'Profile' },
  { href: '/mentors', label: 'Mentors' },
  { href: '/mentees', label: 'Mentees' },
];

export function AppShell({
  user,
  csrfToken,
  children,
}: {
  user: AuthUser;
  csrfToken: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const displayName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.email;

  async function onLogout() {
    setPending(true);
    try {
      await logout(csrfToken);
      startTransition(() => {
        router.replace('/login');
        router.refresh();
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#eef2ff_38%,_#e2e8f0_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6">
        <header className="rounded-[2rem] border border-slate-200/80 bg-white/90 px-5 py-4 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.4)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link href="/dashboard" className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">
                Dev2Win
              </Link>
              <p className="mt-1 text-sm text-slate-600">Secure auth, persisted onboarding, and real profile discovery.</p>
            </div>
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      active ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3 rounded-3xl bg-slate-950 px-4 py-3 text-white">
              <div className="h-11 w-11 overflow-hidden rounded-2xl bg-cyan-500/20">
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                    {displayName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-[150px]">
                <p className="text-sm font-semibold">{displayName}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">{user.role}</p>
              </div>
              <button
                type="button"
                onClick={() => void onLogout()}
                disabled={pending}
                className="rounded-full border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-60"
              >
                {pending ? '...' : 'Logout'}
              </button>
            </div>
          </div>
        </header>
        <div className="flex-1 py-6">{children}</div>
      </div>
    </main>
  );
}
