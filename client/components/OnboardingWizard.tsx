'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { getRoleProfile, updateProfile, upsertMenteeRoleProfile, upsertMentorRoleProfile } from '../lib/api';
import type { AuthUser, MenteeRoleProfile, MentorRoleProfile } from '../lib/types';

export function OnboardingWizard({
  user: initialUser,
  csrfToken,
}: {
  user: AuthUser;
  csrfToken: string | null;
}) {
  const [user, setUser] = useState(initialUser);
  const [step, setStep] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [basics, setBasics] = useState({
    firstName: initialUser.first_name ?? '',
    lastName: initialUser.last_name ?? '',
    role: (initialUser.role === 'mentor' ? 'mentor' : 'mentee') as 'mentor' | 'mentee',
  });
  const [mentorForm, setMentorForm] = useState({
    title: '',
    bio: '',
    experienceLevel: '',
    industries: '',
    cvUrl: '',
    expertise: '',
    careerPreferences: '',
    languages: '',
    availability: '',
  });
  const [menteeForm, setMenteeForm] = useState({
    careerPath: '',
    goals: '',
    experienceLevel: '',
    industryPreferences: '',
    educationStatus: '',
    desiredSkills: '',
    languages: '',
    availability: '',
  });

  useEffect(() => {
    void loadRoleProfile();
  }, []);

  async function loadRoleProfile() {
    const result = await getRoleProfile();
    const profile = result.profile;
    if (!profile) return;

    if (user.role === 'mentor') {
      const mentor = profile as MentorRoleProfile;
      setMentorForm({
        title: mentor.title ?? '',
        bio: mentor.bio ?? '',
        experienceLevel: mentor.experience_level ?? '',
        industries: (mentor.industries ?? []).join(', '),
        cvUrl: mentor.cv_url ?? '',
        expertise: mentor.expertise.join(', '),
        careerPreferences: mentor.career_preferences.join(', '),
        languages: mentor.languages.join(', '),
        availability: mentor.availability.join(', '),
      });
      if (mentor.expertise.length || mentor.title) setStep(3);
    } else {
      const mentee = profile as MenteeRoleProfile;
      setMenteeForm({
        careerPath: mentee.career_path ?? '',
        goals: mentee.goals ?? '',
        experienceLevel: mentee.experience_level ?? '',
        industryPreferences: (mentee.industry_preferences ?? []).join(', '),
        educationStatus: mentee.education_status ?? '',
        desiredSkills: mentee.desired_skills.join(', '),
        languages: mentee.languages.join(', '),
        availability: mentee.availability.join(', '),
      });
      if (mentee.desired_skills.length || mentee.career_path) setStep(3);
    }
  }

  const ready = useMemo(() => {
    if (user.role === 'mentor') return Boolean(mentorForm.title || mentorForm.expertise);
    return Boolean(menteeForm.careerPath || menteeForm.desiredSkills);
  }, [menteeForm.careerPath, menteeForm.desiredSkills, mentorForm.expertise, mentorForm.title, user.role]);

  async function saveBasics(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await updateProfile(
        {
          firstName: basics.firstName.trim() || null,
          lastName: basics.lastName.trim() || null,
          role: basics.role,
        },
        csrfToken,
      );
      setUser(result.user);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save basics.');
    } finally {
      setPending(false);
    }
  }

  async function saveRoleStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      if (user.role === 'mentor') {
        await upsertMentorRoleProfile(
          {
            title: mentorForm.title.trim() || null,
            bio: mentorForm.bio.trim() || null,
            experienceLevel: mentorForm.experienceLevel.trim() || null,
            industries: splitCsv(mentorForm.industries),
            cvUrl: mentorForm.cvUrl.trim() || null,
            expertise: splitCsv(mentorForm.expertise),
            careerPreferences: splitCsv(mentorForm.careerPreferences),
            languages: splitCsv(mentorForm.languages),
            availability: splitCsv(mentorForm.availability),
          },
          csrfToken,
        );
      } else {
        await upsertMenteeRoleProfile(
          {
            careerPath: menteeForm.careerPath.trim() || null,
            goals: menteeForm.goals.trim() || null,
            experienceLevel: menteeForm.experienceLevel.trim() || null,
            industryPreferences: splitCsv(menteeForm.industryPreferences),
            educationStatus: menteeForm.educationStatus.trim() || null,
            desiredSkills: splitCsv(menteeForm.desiredSkills),
            languages: splitCsv(menteeForm.languages),
            availability: splitCsv(menteeForm.availability),
          },
          csrfToken,
        );
      }
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save onboarding.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.36fr_0.64fr]">
      <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Onboarding flow</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Finish your role setup</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          The old single-block homepage form has been replaced with a step-by-step protected flow. Each step saves to
          the server and survives refreshes.
        </p>
        <div className="mt-6 space-y-3">
          {[
            { index: 1, label: 'Profile basics' },
            { index: 2, label: user.role === 'mentor' ? 'Mentor details' : 'Mentee details' },
            { index: 3, label: 'Complete' },
          ].map((item) => (
            <div
              key={item.index}
              className={`rounded-2xl border px-4 py-3 ${
                step === item.index ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Step {item.index}</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">{item.label}</p>
            </div>
          ))}
        </div>
      </aside>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        {error ? <p className="mb-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

        {step === 1 ? (
          <form onSubmit={saveBasics} className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-950">Step 1: confirm your basics</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={basics.firstName}
                onChange={(event) => setBasics((current) => ({ ...current, firstName: event.target.value }))}
                placeholder="First name"
                className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
              />
              <input
                value={basics.lastName}
                onChange={(event) => setBasics((current) => ({ ...current, lastName: event.target.value }))}
                placeholder="Last name"
                className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(['mentee', 'mentor'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setBasics((current) => ({ ...current, role }))}
                  className={`rounded-2xl border px-4 py-4 text-left ${
                    basics.role === role ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'
                  }`}
                >
                  <p className="text-sm font-semibold capitalize text-slate-950">{role}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {role === 'mentor' ? 'Coach the next generation.' : 'Get matched with experienced mentors.'}
                  </p>
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? 'Saving...' : 'Save and continue'}
            </button>
          </form>
        ) : null}

        {step === 2 ? (
          <form onSubmit={saveRoleStep} className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-950">
              Step 2: add your {user.role === 'mentor' ? 'mentor' : 'mentee'} details
            </h2>
            {user.role === 'mentor' ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={mentorForm.title}
                    onChange={(event) => setMentorForm((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Headline"
                    className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                  />
                  <input
                    value={mentorForm.experienceLevel}
                    onChange={(event) =>
                      setMentorForm((current) => ({ ...current, experienceLevel: event.target.value }))
                    }
                    placeholder="Experience level"
                    className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                  />
                </div>
                <textarea
                  value={mentorForm.bio}
                  onChange={(event) => setMentorForm((current) => ({ ...current, bio: event.target.value }))}
                  placeholder="Short mentor bio"
                  className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-cyan-600"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={mentorForm.industries}
                    onChange={(event) => setMentorForm((current) => ({ ...current, industries: event.target.value }))}
                    placeholder="Industries, comma separated"
                    className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                  />
                  <input
                    value={mentorForm.cvUrl}
                    onChange={(event) => setMentorForm((current) => ({ ...current, cvUrl: event.target.value }))}
                    placeholder="CV URL"
                    className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                  />
                </div>
                <input
                  value={mentorForm.expertise}
                  onChange={(event) => setMentorForm((current) => ({ ...current, expertise: event.target.value }))}
                  placeholder="Expertise, comma separated"
                  className="min-h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                />
                <input
                  value={mentorForm.careerPreferences}
                  onChange={(event) =>
                    setMentorForm((current) => ({ ...current, careerPreferences: event.target.value }))
                  }
                  placeholder="Career preferences, comma separated"
                  className="min-h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={mentorForm.languages}
                    onChange={(event) => setMentorForm((current) => ({ ...current, languages: event.target.value }))}
                    placeholder="Languages, comma separated"
                    className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                  />
                  <input
                    value={mentorForm.availability}
                    onChange={(event) =>
                      setMentorForm((current) => ({ ...current, availability: event.target.value }))
                    }
                    placeholder="Availability, comma separated"
                    className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={menteeForm.careerPath}
                    onChange={(event) => setMenteeForm((current) => ({ ...current, careerPath: event.target.value }))}
                    placeholder="Career path"
                    className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                  />
                  <input
                    value={menteeForm.experienceLevel}
                    onChange={(event) =>
                      setMenteeForm((current) => ({ ...current, experienceLevel: event.target.value }))
                    }
                    placeholder="Experience level"
                    className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                  />
                </div>
                <textarea
                  value={menteeForm.goals}
                  onChange={(event) => setMenteeForm((current) => ({ ...current, goals: event.target.value }))}
                  placeholder="Learning or career goals"
                  className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-cyan-600"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={menteeForm.industryPreferences}
                    onChange={(event) =>
                      setMenteeForm((current) => ({ ...current, industryPreferences: event.target.value }))
                    }
                    placeholder="Industry preferences, comma separated"
                    className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                  />
                  <input
                    value={menteeForm.educationStatus}
                    onChange={(event) =>
                      setMenteeForm((current) => ({ ...current, educationStatus: event.target.value }))
                    }
                    placeholder="Education status"
                    className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                  />
                </div>
                <input
                  value={menteeForm.desiredSkills}
                  onChange={(event) =>
                    setMenteeForm((current) => ({ ...current, desiredSkills: event.target.value }))
                  }
                  placeholder="Desired skills, comma separated"
                  className="min-h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={menteeForm.languages}
                    onChange={(event) => setMenteeForm((current) => ({ ...current, languages: event.target.value }))}
                    placeholder="Languages, comma separated"
                    className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                  />
                  <input
                    value={menteeForm.availability}
                    onChange={(event) =>
                      setMenteeForm((current) => ({ ...current, availability: event.target.value }))
                    }
                    placeholder="Availability, comma separated"
                    className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
                  />
                </div>
              </>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {pending ? 'Saving...' : 'Save role details'}
              </button>
            </div>
          </form>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-950">Step 3: you’re ready</h2>
            <p className="text-sm leading-7 text-slate-600">
              Your onboarding now persists end-to-end. You can revisit this anytime, but the directory and recommendation
              flows can already use your saved data.
            </p>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
              {ready
                ? 'Your role profile is complete enough for real matching.'
                : 'You can still add more detail later for stronger recommendations.'}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Go to dashboard
              </Link>
              <Link href="/profile" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                Open profile
              </Link>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Edit details
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function splitCsv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
