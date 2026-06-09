'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  AuthUser,
  MenteeDirectoryEntry,
  MenteeRoleProfile,
  MentorDirectoryEntry,
  MentorRoleProfile,
} from '../lib/types';

type RecommendationCandidate = {
  candidate_id: string;
  score: number;
  reasons: string[];
  similarity_score?: number;
  rule_score?: number;
  feedback_score?: number;
};

type RecommendationResponse = {
  candidates: RecommendationCandidate[];
  cache?: {
    hit: boolean;
    ttlSeconds: number;
  };
};

type RoleProfileResponse = {
  profile?: MentorRoleProfile | MenteeRoleProfile | null;
};

export function MentorRecommendations({ user, csrfToken }: { user: AuthUser; csrfToken: string | null }) {
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [roleProfile, setRoleProfile] = useState<MentorRoleProfile | MenteeRoleProfile | null>(null);
  const [candidates, setCandidates] = useState<Array<MentorDirectoryEntry | MenteeDirectoryEntry>>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const roleLabel = user.role === 'mentor' ? 'mentee' : 'mentor';
  const candidateDirectory = useMemo(
    () => Object.fromEntries(candidates.map((candidate) => [candidate.id, candidate])),
    [candidates],
  );

  useEffect(() => {
    void loadRecommendations();
  }, [user.id, user.role]);

  async function loadRecommendations() {
    setLoading(true);
    setError(null);
    try {
      const [roleProfileResponse, candidatesResponse] = await Promise.all([
        fetch('/api/v1/users/me/role-profile'),
        fetch(user.role === 'mentor' ? '/api/v1/users/mentees' : '/api/v1/users/mentors'),
      ]);

      const roleProfileBody = (await roleProfileResponse.json().catch(() => null)) as RoleProfileResponse | null;
      const directoryBody = (await candidatesResponse.json().catch(() => null)) as
        | { mentors?: MentorDirectoryEntry[]; mentees?: MenteeDirectoryEntry[] }
        | null;

      const nextRoleProfile = roleProfileBody?.profile ?? null;
      const nextCandidates =
        user.role === 'mentor'
          ? ((directoryBody?.mentees ?? []) as MenteeDirectoryEntry[])
          : ((directoryBody?.mentors ?? []) as MentorDirectoryEntry[]);

      setRoleProfile(nextRoleProfile);
      setCandidates(nextCandidates.filter((candidate) => candidate.id !== user.id));

      const requestUser = buildRecommendationUser(user, nextRoleProfile);
      if (!requestUser) {
        setData(null);
        return;
      }

      const response = await fetch('/api/v1/matching/recommendations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          role: user.role === 'mentor' ? 'mentor' : 'mentee',
          user: requestUser,
          candidates: nextCandidates.filter((candidate) => candidate.id !== user.id),
          limit: 3,
        }),
      });
      const body = (await response.json().catch(() => null)) as RecommendationResponse | null;
      if (!response.ok || !body) {
        throw new Error('Recommendations are unavailable right now.');
      }
      setData(body);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recommendations are unavailable right now.');
    } finally {
      setLoading(false);
    }
  }

  async function sendFeedback(candidateId: string, eventType: 'contacted' | 'dismissed') {
    setSubmittingId(candidateId);
    try {
      const response = await fetch('/api/v1/matching/feedback', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          actorUserId: user.id,
          candidateId,
          actorRole: user.role === 'mentor' ? 'mentor' : 'mentee',
          eventType,
          metadata: { source: 'client-dashboard' },
        }),
      });
      if (!response.ok) {
        throw new Error('Feedback could not be saved.');
      }
      await loadRecommendations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Feedback could not be saved.');
    } finally {
      setSubmittingId(null);
    }
  }

  const onboardingReady = Boolean(buildRecommendationUser(user, roleProfile));

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Phase 3 live</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Mentor recommendations</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Recommendations now use your persisted onboarding profile and the saved {roleLabel} directory instead of
            placeholder client data.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadRecommendations()}
          disabled={loading}
          className="min-h-10 rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-3 py-1">Role: {user.role}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">
          Directory: {candidates.length} saved {roleLabel}
          {candidates.length === 1 ? '' : 's'}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1">
          Cache: {data?.cache?.hit ? `hit (${data.cache.ttlSeconds}s)` : 'fresh'}
        </span>
      </div>

      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {!onboardingReady && !loading ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Complete the role-specific onboarding form above to unlock real recommendations.
        </p>
      ) : null}

      {onboardingReady && !loading && !candidates.length ? (
        <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          No saved {roleLabel} profiles are available yet. Create more role-specific profiles to start matching.
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {(loading ? [] : data?.candidates ?? []).map((candidate, index) => {
          const match = candidateDirectory[candidate.candidate_id];
          return (
            <article key={candidate.candidate_id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Match {index + 1}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {match?.name ?? candidate.candidate_id}
                  </h3>
                  <p className="text-sm text-slate-600">{readCandidateSubtitle(match)}</p>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  {Math.round(candidate.score * 100)}%
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
                <div className="rounded-xl bg-white px-2 py-2">
                  <div className="font-semibold text-slate-900">{Math.round((candidate.similarity_score ?? 0) * 100)}%</div>
                  <div>Similarity</div>
                </div>
                <div className="rounded-xl bg-white px-2 py-2">
                  <div className="font-semibold text-slate-900">{Math.round((candidate.rule_score ?? 0) * 100)}%</div>
                  <div>Rules</div>
                </div>
                <div className="rounded-xl bg-white px-2 py-2">
                  <div className="font-semibold text-slate-900">{Math.round((candidate.feedback_score ?? 0) * 100)}%</div>
                  <div>Feedback</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {candidate.reasons.map((reason) => (
                  <span key={reason} className="rounded-full bg-white px-3 py-1 text-xs text-slate-600">
                    {reason}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => void sendFeedback(candidate.candidate_id, 'contacted')}
                  disabled={submittingId === candidate.candidate_id}
                  className="min-h-10 flex-1 rounded-full bg-slate-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {submittingId === candidate.candidate_id ? 'Saving...' : 'Interested'}
                </button>
                <button
                  type="button"
                  onClick={() => void sendFeedback(candidate.candidate_id, 'dismissed')}
                  disabled={submittingId === candidate.candidate_id}
                  className="min-h-10 rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  Dismiss
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function buildRecommendationUser(user: AuthUser, profile: MentorRoleProfile | MenteeRoleProfile | null) {
  if (!profile) return null;

  if (user.role === 'mentor') {
    const mentor = profile as MentorRoleProfile;
    if (!mentor.expertise.length && !mentor.career_preferences.length) return null;
    return {
      id: user.id,
      expertise: mentor.expertise,
      career_preferences: mentor.career_preferences,
      languages: mentor.languages,
      availability: mentor.availability,
      title: mentor.title ?? '',
      bio: mentor.bio ?? '',
    };
  }

  const mentee = profile as MenteeRoleProfile;
  if (!mentee.career_path && !mentee.desired_skills.length) return null;
  return {
    id: user.id,
    career_path: mentee.career_path ?? '',
    desired_skills: mentee.desired_skills,
    languages: mentee.languages,
    availability: mentee.availability,
    goals: mentee.goals ?? '',
  };
}

function readCandidateSubtitle(candidate: MentorDirectoryEntry | MenteeDirectoryEntry | undefined) {
  if (!candidate) return 'Match profile';
  if ('title' in candidate) return candidate.title ?? 'Mentor profile';
  return candidate.career_path ?? 'Mentee profile';
}
