'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, startTransition, useState } from 'react';
import { confirmPasswordReset } from '../lib/api';

export function PasswordResetConfirmForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await confirmPasswordReset(token, password);
      startTransition(() => {
        router.replace('/dashboard');
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-8">
      <form onSubmit={onSubmit} className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Reset password</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This token must be valid and unused. After a successful reset, you’ll be signed in automatically.
        </p>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="New password"
          className="mt-6 min-h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
        />
        {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        <button
          type="submit"
          disabled={pending || !token}
          className="mt-5 min-h-12 w-full rounded-full bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? 'Working...' : 'Reset password'}
        </button>
        <Link href="/login" className="mt-4 inline-flex text-sm font-medium text-cyan-700">
          Back to login
        </Link>
      </form>
    </section>
  );
}
