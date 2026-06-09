'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AIMentorChat } from './AIMentorChat';
import { MentorRecommendations } from './MentorRecommendations';
import type { AuthUser, MenteeRoleProfile, MentorRoleProfile } from '../lib/types';

type AuthMode = 'login' | 'register';

type SessionResponse = {
  user: AuthUser | null;
  csrfToken?: string | null;
};

export function HomeWorkspace() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [roleProfileSaving, setRoleProfileSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AuthMode>('register');
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'mentee' as AuthUser['role'],
  });
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    role: 'mentee' as AuthUser['role'],
  });
  const [mentorForm, setMentorForm] = useState({
    title: '',
    bio: '',
    expertise: '',
    careerPreferences: '',
    languages: '',
    availability: '',
  });
  const [menteeForm, setMenteeForm] = useState({
    careerPath: '',
    goals: '',
    desiredSkills: '',
    languages: '',
    availability: '',
  });

  useEffect(() => {
    void loadSession();
  }, []);

  const displayName = useMemo(() => {
    if (!user) return '';
    const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
    return fullName || user.email;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      firstName: user.first_name ?? '',
      lastName: user.last_name ?? '',
      role: user.role,
    });
  }, [user]);

  useEffect(() => {
    if (!user || user.role === 'admin') return;
    void loadRoleProfile(user.role);
  }, [user?.id, user?.role]);

  async function loadSession() {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/auth/session');
      const body = (await response.json().catch(() => null)) as SessionResponse | null;
      setUser(body?.user ?? null);
      setCsrfToken(body?.csrfToken ?? null);
      setError(null);
    } catch {
      setError('We could not load your current session.');
    } finally {
      setLoading(false);
    }
  }

  async function loadRoleProfile(role: AuthUser['role']) {
    const response = await fetch('/api/v1/users/me/role-profile');
    const body = (await response.json().catch(() => null)) as
      | { profile?: MentorRoleProfile | MenteeRoleProfile | null }
      | null;
    const profile = body?.profile;
    if (!profile) {
      if (role === 'mentor') {
        setMentorForm({
          title: '',
          bio: '',
          expertise: '',
          careerPreferences: '',
          languages: '',
          availability: '',
        });
      } else {
        setMenteeForm({
          careerPath: '',
          goals: '',
          desiredSkills: '',
          languages: '',
          availability: '',
        });
      }
      return;
    }

    if (role === 'mentor') {
      const mentor = profile as MentorRoleProfile;
      setMentorForm({
        title: mentor.title ?? '',
        bio: mentor.bio ?? '',
        expertise: mentor.expertise.join(', '),
        careerPreferences: mentor.career_preferences.join(', '),
        languages: mentor.languages.join(', '),
        availability: mentor.availability.join(', '),
      });
    } else {
      const mentee = profile as MenteeRoleProfile;
      setMenteeForm({
        careerPath: mentee.career_path ?? '',
        goals: mentee.goals ?? '',
        desiredSkills: mentee.desired_skills.join(', '),
        languages: mentee.languages.join(', '),
        availability: mentee.availability.join(', '),
      });
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const endpoint = mode === 'register' ? '/api/v1/auth/register' : '/api/v1/auth/login';
    const payload =
      mode === 'register'
        ? {
            email: form.email.trim(),
            password: form.password,
            firstName: form.firstName.trim() || null,
            lastName: form.lastName.trim() || null,
            role: form.role,
          }
        : {
            email: form.email.trim(),
            password: form.password,
          };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => null)) as
        | { user?: AuthUser; csrfToken?: string | null; error?: { message?: string } }
        | null;
      if (!response.ok || !body?.user) {
        throw new Error(body?.error?.message ?? 'Authentication failed.');
      }

      setUser(body.user);
      setCsrfToken(body.csrfToken ?? null);
      setForm((current) => ({ ...current, password: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  }

  async function logout() {
    setSubmitting(true);
    setError(null);
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined,
      });
      setUser(null);
      setCsrfToken(null);
    } catch {
      setError('Logout failed.');
    } finally {
      setSubmitting(false);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setProfileSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          firstName: profileForm.firstName.trim() || null,
          lastName: profileForm.lastName.trim() || null,
          role: profileForm.role,
        }),
      });
      const body = (await response.json().catch(() => null)) as { user?: AuthUser; error?: { message?: string } } | null;
      if (!response.ok || !body?.user) {
        throw new Error(body?.error?.message ?? 'Profile update failed.');
      }
      setUser(body.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed.');
    } finally {
      setProfileSaving(false);
    }
  }

  async function saveRoleProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || user.role === 'admin') return;
    setRoleProfileSaving(true);
    setError(null);

    const payload =
      user.role === 'mentor'
        ? {
            title: mentorForm.title.trim() || null,
            bio: mentorForm.bio.trim() || null,
            expertise: splitCsv(mentorForm.expertise),
            careerPreferences: splitCsv(mentorForm.careerPreferences),
            languages: splitCsv(mentorForm.languages),
            availability: splitCsv(mentorForm.availability),
          }
        : {
            careerPath: menteeForm.careerPath.trim() || null,
            goals: menteeForm.goals.trim() || null,
            desiredSkills: splitCsv(menteeForm.desiredSkills),
            languages: splitCsv(menteeForm.languages),
            availability: splitCsv(menteeForm.availability),
          };

    try {
      const response = await fetch('/api/v1/users/me/role-profile', {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
      if (!response.ok) {
        throw new Error(body?.error?.message ?? 'Role profile update failed.');
      }
      await loadRoleProfile(user.role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Role profile update failed.');
    } finally {
      setRoleProfileSaving(false);
    }
  }

  return (
    <main className="bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Phase 1 live</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">Auth-backed Dev2Win workspace</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Register or sign in to use the new server session flow. The homepage now reads the real auth session
                instead of relying on hard-coded demo identities.
              </p>
            </div>

            {user ? (
              <div className="min-w-[280px] rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Signed in</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-950">{displayName}</h2>
                <p className="text-sm text-slate-600">{user.email}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-full bg-white px-3 py-1">Role: {user.role}</span>
                  <span className="rounded-full bg-white px-3 py-1">User ID: {user.id.slice(0, 8)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => void logout()}
                  disabled={submitting}
                  className="mt-4 min-h-10 rounded-full bg-slate-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {submitting ? 'Working...' : 'Logout'}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="min-w-[320px] rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex rounded-full bg-white p-1 text-sm">
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className={`flex-1 rounded-full px-3 py-2 ${mode === 'register' ? 'bg-slate-950 text-white' : 'text-slate-600'}`}
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className={`flex-1 rounded-full px-3 py-2 ${mode === 'login' ? 'bg-slate-950 text-white' : 'text-slate-600'}`}
                  >
                    Login
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    type="email"
                    placeholder="Email"
                    className="min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                  />
                  <input
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    type="password"
                    placeholder="Password"
                    className="min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                  />

                  {mode === 'register' ? (
                    <>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          value={form.firstName}
                          onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                          placeholder="First name"
                          className="min-h-11 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                        />
                        <input
                          value={form.lastName}
                          onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                          placeholder="Last name"
                          className="min-h-11 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                        />
                      </div>
                      <select
                        value={form.role}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            role: event.target.value as AuthUser['role'],
                          }))
                        }
                        className="min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                      >
                        <option value="mentee">Mentee</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </>
                  ) : null}
                </div>

                {error ? <p className="mt-3 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="mt-4 min-h-11 w-full rounded-full bg-slate-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {submitting ? 'Working...' : mode === 'register' ? 'Create account' : 'Login'}
                </button>
              </form>
            )}
          </div>
        </section>

        {loading ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            Loading session...
          </section>
        ) : null}

        {user ? (
          <>
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Phase 2 started</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Profile basics</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your name and role now persist through the server with auth and CSRF protection. This gives us a
                    real profile foothold for onboarding and matching.
                  </p>
                </div>

                <form onSubmit={saveProfile} className="w-full max-w-xl space-y-3 rounded-3xl bg-slate-50 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={profileForm.firstName}
                      onChange={(event) =>
                        setProfileForm((current) => ({ ...current, firstName: event.target.value }))
                      }
                      placeholder="First name"
                      className="min-h-11 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                    />
                    <input
                      value={profileForm.lastName}
                      onChange={(event) =>
                        setProfileForm((current) => ({ ...current, lastName: event.target.value }))
                      }
                      placeholder="Last name"
                      className="min-h-11 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                    />
                  </div>
                  <select
                    value={profileForm.role}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        role: event.target.value as AuthUser['role'],
                      }))
                    }
                    className="min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                  >
                    <option value="mentee">Mentee</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="min-h-11 rounded-full bg-slate-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {profileSaving ? 'Saving...' : 'Save profile'}
                  </button>
                </form>
              </div>
            </section>
            {user.role !== 'admin' ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Persisted onboarding</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                      {user.role === 'mentor' ? 'Mentor onboarding details' : 'Mentee onboarding details'}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      This is the first real role-specific onboarding record. We are now saving matching-relevant profile
                      data per role instead of keeping it in placeholder client state.
                    </p>
                  </div>

                  <form onSubmit={saveRoleProfile} className="w-full max-w-xl space-y-3 rounded-3xl bg-slate-50 p-4">
                    {user.role === 'mentor' ? (
                      <>
                        <input
                          value={mentorForm.title}
                          onChange={(event) => setMentorForm((current) => ({ ...current, title: event.target.value }))}
                          placeholder="Title or headline"
                          className="min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                        />
                        <textarea
                          value={mentorForm.bio}
                          onChange={(event) => setMentorForm((current) => ({ ...current, bio: event.target.value }))}
                          placeholder="Short mentor bio"
                          className="min-h-28 w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-slate-700"
                        />
                        <input
                          value={mentorForm.expertise}
                          onChange={(event) => setMentorForm((current) => ({ ...current, expertise: event.target.value }))}
                          placeholder="Expertise, comma separated"
                          className="min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                        />
                        <input
                          value={mentorForm.careerPreferences}
                          onChange={(event) =>
                            setMentorForm((current) => ({ ...current, careerPreferences: event.target.value }))
                          }
                          placeholder="Career preferences, comma separated"
                          className="min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={mentorForm.languages}
                            onChange={(event) =>
                              setMentorForm((current) => ({ ...current, languages: event.target.value }))
                            }
                            placeholder="Languages, comma separated"
                            className="min-h-11 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                          />
                          <input
                            value={mentorForm.availability}
                            onChange={(event) =>
                              setMentorForm((current) => ({ ...current, availability: event.target.value }))
                            }
                            placeholder="Availability, comma separated"
                            className="min-h-11 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <input
                          value={menteeForm.careerPath}
                          onChange={(event) => setMenteeForm((current) => ({ ...current, careerPath: event.target.value }))}
                          placeholder="Career path"
                          className="min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                        />
                        <textarea
                          value={menteeForm.goals}
                          onChange={(event) => setMenteeForm((current) => ({ ...current, goals: event.target.value }))}
                          placeholder="Learning or career goals"
                          className="min-h-28 w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-slate-700"
                        />
                        <input
                          value={menteeForm.desiredSkills}
                          onChange={(event) =>
                            setMenteeForm((current) => ({ ...current, desiredSkills: event.target.value }))
                          }
                          placeholder="Desired skills, comma separated"
                          className="min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={menteeForm.languages}
                            onChange={(event) =>
                              setMenteeForm((current) => ({ ...current, languages: event.target.value }))
                            }
                            placeholder="Languages, comma separated"
                            className="min-h-11 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                          />
                          <input
                            value={menteeForm.availability}
                            onChange={(event) =>
                              setMenteeForm((current) => ({ ...current, availability: event.target.value }))
                            }
                            placeholder="Availability, comma separated"
                            className="min-h-11 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                          />
                        </div>
                      </>
                    )}
                    <button
                      type="submit"
                      disabled={roleProfileSaving}
                      className="min-h-11 rounded-full bg-slate-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {roleProfileSaving ? 'Saving...' : 'Save onboarding'}
                    </button>
                  </form>
                </div>
              </section>
            ) : null}
            <MentorRecommendations user={user} csrfToken={csrfToken} />
            <AIMentorChat key={user.id} user={user} />
          </>
        ) : !loading ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 shadow-sm">
            Sign in above to use the authenticated recommendations dashboard and AI mentor workspace.
          </section>
        ) : null}
      </div>
    </main>
  );
}

function splitCsv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
