import { headers } from 'next/headers';
import Link from 'next/link';

const SERVER_URL = process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:4000';

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const headerStore = await headers();
  const cookie = headerStore.get('cookie') ?? '';
  const response = await fetch(`${SERVER_URL}/v1/users/${id}/profile`, {
    headers: cookie ? { cookie } : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-8">
        <section className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-950">Profile unavailable</h1>
          <p className="mt-3 text-sm text-slate-600">We couldn’t load that public profile.</p>
          <Link href="/" className="mt-5 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Back home
          </Link>
        </section>
      </main>
    );
  }

  const body = (await response.json()) as {
    user: {
      id: string;
      email: string;
      first_name: string | null;
      last_name: string | null;
      avatar_url?: string | null;
      role: 'mentor' | 'mentee' | 'admin';
    };
    profile: Record<string, unknown> | null;
  };

  const displayName = `${body.user.first_name ?? ''} ${body.user.last_name ?? ''}`.trim() || body.user.email;
  const tags = readTags(body.profile);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="h-28 w-28 overflow-hidden rounded-[2rem] bg-slate-200">
              {body.user.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={body.user.avatar_url} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl font-semibold text-slate-500">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Public profile</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-950">{displayName}</h1>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">{body.user.role}</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">{readSummary(body.profile)}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function readSummary(profile: Record<string, unknown> | null) {
  if (!profile) return 'This user has not published extra profile details yet.';
  if (typeof profile.bio === 'string' && profile.bio) return profile.bio;
  if (typeof profile.goals === 'string' && profile.goals) return profile.goals;
  return 'This user has not published extra profile details yet.';
}

function readTags(profile: Record<string, unknown> | null) {
  if (!profile) return [];
  const arrays = ['expertise', 'career_preferences', 'industries', 'desired_skills', 'industry_preferences', 'languages'];
  const values = arrays.flatMap((key) => {
    const value = profile[key];
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  });
  return Array.from(new Set(values)).slice(0, 10);
}
