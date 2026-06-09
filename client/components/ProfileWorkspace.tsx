'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  getRoleProfile,
  getUploadSignature,
  saveAvatar,
  updateProfile,
  upsertMenteeRoleProfile,
  upsertMentorRoleProfile,
} from '../lib/api';
import type { AuthUser, MenteeRoleProfile, MentorRoleProfile } from '../lib/types';

export function ProfileWorkspace({
  user: initialUser,
  csrfToken,
}: {
  user: AuthUser;
  csrfToken: string | null;
}) {
  const [user, setUser] = useState(initialUser);
  const [roleProfile, setRoleProfile] = useState<MentorRoleProfile | MenteeRoleProfile | null>(null);
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [basicForm, setBasicForm] = useState({
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
    void hydrateRoleProfile();
  }, [user.role]);

  async function hydrateRoleProfile() {
    try {
      const result = await getRoleProfile();
      const profile = result.profile;
      setRoleProfile(profile);
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
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load role profile.');
    }
  }

  async function onSaveBasics(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const result = await updateProfile(
        {
          firstName: basicForm.firstName.trim() || null,
          lastName: basicForm.lastName.trim() || null,
          role: basicForm.role,
        },
        csrfToken,
      );
      setUser(result.user);
      setMessage('Basic profile saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile.');
    } finally {
      setPending(false);
    }
  }

  async function onSaveRoleProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      if (user.role === 'mentor') {
        const result = await upsertMentorRoleProfile(
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
        setRoleProfile(result.profile);
      } else {
        const result = await upsertMenteeRoleProfile(
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
        setRoleProfile(result.profile);
      }
      setMessage('Role profile saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save role profile.');
    } finally {
      setPending(false);
    }
  }

  async function onAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setMessage(null);
    try {
      const signature = await getUploadSignature();
      const formData = new FormData();
      formData.set('file', file);
      formData.set('api_key', signature.upload.apiKey);
      formData.set('timestamp', String(signature.upload.timestamp));
      formData.set('folder', signature.upload.folder);
      formData.set('signature', signature.upload.signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.upload.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );
      const uploadBody = (await uploadResponse.json().catch(() => null)) as
        | { secure_url?: string; public_id?: string; error?: { message?: string } }
        | null;
      if (!uploadResponse.ok || !uploadBody?.secure_url || !uploadBody.public_id) {
        throw new Error(uploadBody?.error?.message ?? 'Avatar upload failed.');
      }

      const result = await saveAvatar(uploadBody.secure_url, uploadBody.public_id, csrfToken);
      setUser(result.user);
      setMessage('Avatar uploaded and saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Avatar upload failed.');
    } finally {
      setUploading(false);
    }
  }

  const displayName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.email;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Manage your public presence</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            This page now owns profile basics, role editing, and Cloudinary avatar uploads instead of mixing those
            concerns into the homepage.
          </p>
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
            <div className="aspect-square bg-slate-200">
              {user.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar_url} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl font-semibold text-slate-500">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-lg font-semibold text-slate-950">{displayName}</p>
              <p className="text-sm text-slate-600">{user.email}</p>
              <label className="mt-4 inline-flex cursor-pointer rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
                {uploading ? 'Uploading...' : 'Upload avatar'}
                <input type="file" accept="image/*" className="hidden" onChange={(event) => void onAvatarChange(event)} />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

          <form onSubmit={onSaveBasics} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Basic details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                value={basicForm.firstName}
                onChange={(event) => setBasicForm((current) => ({ ...current, firstName: event.target.value }))}
                placeholder="First name"
                className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
              />
              <input
                value={basicForm.lastName}
                onChange={(event) => setBasicForm((current) => ({ ...current, lastName: event.target.value }))}
                placeholder="Last name"
                className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
              />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(['mentee', 'mentor'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setBasicForm((current) => ({ ...current, role }))}
                  className={`rounded-2xl border px-4 py-4 text-left ${
                    basicForm.role === role ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'
                  }`}
                >
                  <p className="text-sm font-semibold capitalize text-slate-950">{role}</p>
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={pending}
              className="mt-5 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? 'Saving...' : 'Save basics'}
            </button>
          </form>

          <form onSubmit={onSaveRoleProfile} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">
              {user.role === 'mentor' ? 'Mentor profile' : 'Mentee profile'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              These fields also power the public profile page and the paginated directories.
            </p>
            <div className="mt-4 space-y-4">
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
                    placeholder="Bio"
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
                    placeholder="Goals"
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
            </div>
            <button
              type="submit"
              disabled={pending}
              className="mt-5 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? 'Saving...' : 'Save role profile'}
            </button>
          </form>
        </div>
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
