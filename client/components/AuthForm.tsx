'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, startTransition, useState } from 'react';
import { login, register, startOauth } from '../lib/api';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'mentee' as 'mentor' | 'mentee',
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      if (mode === 'signup') {
        await register({
          email: form.email.trim(),
          password: form.password,
          firstName: form.firstName.trim() || null,
          lastName: form.lastName.trim() || null,
          role: form.role,
        });
      } else {
        await login({
          email: form.email.trim(),
          password: form.password,
        });
      }
      startTransition(() => {
        router.replace('/dashboard');
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2.5rem] border border-cyan-200/70 bg-[linear-gradient(135deg,_rgba(8,145,178,0.96),_rgba(15,23,42,0.98))] p-8 text-white shadow-[0_30px_80px_-40px_rgba(8,145,178,0.7)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-100">
          {mode === 'signup' ? 'Phase 1 complete' : 'Welcome back'}
        </p>
        <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {mode === 'signup' ? 'Create your mentor or mentee account.' : 'Sign in to your protected Dev2Win workspace.'}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-50/90">
          Email/password, Google, and GitHub now flow through the custom session stack. Once you’re in, onboarding,
          directories, recommendations, and profile editing all run against persisted server data.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-cyan-100/90">
          <span className="rounded-full border border-white/15 px-4 py-2">Signed cookies</span>
          <span className="rounded-full border border-white/15 px-4 py-2">Redis sessions</span>
          <span className="rounded-full border border-white/15 px-4 py-2">CSRF protected</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              {mode === 'signup' ? 'Create account' : 'Login'}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              {mode === 'signup' ? 'Start your journey' : 'Access your dashboard'}
            </h2>
          </div>
          <Link
            href={mode === 'signup' ? '/login' : '/signup'}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            {mode === 'signup' ? 'Login' : 'Sign up'}
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          <input
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            type="email"
            placeholder="Email"
            className="min-h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
          />
          <input
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            type="password"
            placeholder="Password"
            className="min-h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
          />
          {mode === 'signup' ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={form.firstName}
                  onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                  placeholder="First name"
                  className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                />
                <input
                  value={form.lastName}
                  onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                  placeholder="Last name"
                  className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, role: 'mentee' }))}
                  className={`rounded-2xl border px-4 py-4 text-left ${
                    form.role === 'mentee' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-950">Mentee</p>
                  <p className="mt-1 text-xs text-slate-600">Learn from mentors and unlock tailored guidance.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, role: 'mentor' }))}
                  className={`rounded-2xl border px-4 py-4 text-left ${
                    form.role === 'mentor' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-950">Mentor</p>
                  <p className="mt-1 text-xs text-slate-600">Build your profile and connect with growing talent.</p>
                </button>
              </div>
            </>
          ) : null}
        </div>

        {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 min-h-12 w-full rounded-full bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? 'Working...' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => startOauth('google', mode, form.role)}
            className="min-h-12 rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-700"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => startOauth('github', mode, form.role)}
            className="min-h-12 rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-700"
          >
            Continue with GitHub
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
          <Link href="/forgot-password" className="font-medium text-cyan-700">
            Forgot password?
          </Link>
          <Link href="/" className="font-medium text-slate-700">
            Back home
          </Link>
        </div>
      </form>
    </section>
  );
}
