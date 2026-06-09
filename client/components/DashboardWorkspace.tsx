'use client';

import Link from 'next/link';
import { AIMentorChat } from './AIMentorChat';
import { MentorRecommendations } from './MentorRecommendations';
import type { AuthUser, MenteeRoleProfile, MentorRoleProfile } from '../lib/types';

export function DashboardWorkspace({
  user,
  csrfToken,
  roleProfile,
}: {
  user: AuthUser;
  csrfToken: string | null;
  roleProfile: MentorRoleProfile | MenteeRoleProfile | null;
}) {
  const onboardingReady =
    user.role === 'mentor'
      ? Boolean((roleProfile as MentorRoleProfile | null)?.expertise?.length)
      : Boolean((roleProfile as MenteeRoleProfile | null)?.desired_skills?.length || (roleProfile as MenteeRoleProfile | null)?.career_path);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Protected dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Your Phase 1/2 workspace is now route-protected.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Sessions, onboarding, profile editing, and directories all live behind the new auth flow. The dashboard
            now reads real persisted state instead of placeholder homepage-only UI.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/onboarding" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
              {onboardingReady ? 'Review onboarding' : 'Finish onboarding'}
            </Link>
            <Link href="/profile" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
              Edit profile
            </Link>
            <Link
              href={user.role === 'mentor' ? '/mentees' : '/mentors'}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
            >
              Browse directory
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Account</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{user.role}</p>
            <p className="mt-1 text-sm text-slate-600">{user.email}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Onboarding</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{onboardingReady ? 'Ready' : 'Pending'}</p>
            <p className="mt-1 text-sm text-slate-600">
              {onboardingReady ? 'Recommendations can use your saved role profile.' : 'Complete the step-based wizard to unlock matching.'}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Profile</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">
              {user.avatar_url ? 'Avatar set' : 'Add avatar'}
            </p>
            <p className="mt-1 text-sm text-slate-600">Profile images are now signed and saved through Cloudinary.</p>
          </div>
        </div>
      </section>

      <MentorRecommendations user={user} csrfToken={csrfToken} />
      <AIMentorChat key={user.id} user={user} />
    </div>
  );
}
