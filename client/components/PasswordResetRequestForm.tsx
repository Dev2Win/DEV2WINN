'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { requestPasswordReset } from '../lib/api';

export function PasswordResetRequestForm() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      await requestPasswordReset(email.trim());
      setMessage('If that account exists, a reset link has been queued.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset request failed.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-8">
      <form onSubmit={onSubmit} className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Password reset</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Request a reset link</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          We will queue a reset email for this account. The reset token is single-use and expires after one hour.
        </p>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Email"
          className="mt-6 min-h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
        />
        {message ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-5 min-h-12 w-full rounded-full bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? 'Working...' : 'Send reset link'}
        </button>
        <Link href="/login" className="mt-4 inline-flex text-sm font-medium text-cyan-700">
          Back to login
        </Link>
      </form>
    </section>
  );
}
