'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listMentees, listMentors } from '../lib/api';
import type { DirectoryPageInfo, MenteeDirectoryEntry, MentorDirectoryEntry } from '../lib/types';

type DirectoryMode = 'mentors' | 'mentees';

export function DirectoryBrowser({ mode }: { mode: DirectoryMode }) {
  const [items, setItems] = useState<Array<MentorDirectoryEntry | MenteeDirectoryEntry>>([]);
  const [pageInfo, setPageInfo] = useState<DirectoryPageInfo>({ hasMore: false, nextCursor: null });
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingNext, setPendingNext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    language: '',
    tag: '',
  });

  useEffect(() => {
    setCursor(null);
    void loadDirectory(true, null);
  }, [mode]);

  async function loadDirectory(reset: boolean, nextCursor: string | null) {
    const params = new URLSearchParams({
      limit: '9',
      search: filters.search.trim(),
      language: filters.language.trim(),
      tag: filters.tag.trim(),
    });
    if (nextCursor) params.set('cursor', nextCursor);

    if (reset) {
      setLoading(true);
    } else {
      setPendingNext(true);
    }
    setError(null);

    try {
      const response =
        mode === 'mentors'
          ? await listMentors(params)
          : await listMentees(params);
      setItems((current) => (reset ? readItems(mode, response) : [...current, ...readItems(mode, response)]));
      setPageInfo(response.pageInfo);
      setCursor(nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Directory unavailable.');
    } finally {
      setLoading(false);
      setPendingNext(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Phase 2 directories</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">
          Browse saved {mode === 'mentors' ? 'mentor' : 'mentee'} profiles
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          These lists now come from paginated and filterable API endpoints instead of a one-shot unfiltered directory
          read. Use the filters below to test the new query contract.
        </p>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
          <input
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            placeholder="Search name, email, title, goals..."
            className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
          />
          <input
            value={filters.language}
            onChange={(event) => setFilters((current) => ({ ...current, language: event.target.value }))}
            placeholder="Language"
            className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
          />
          <input
            value={filters.tag}
            onChange={(event) => setFilters((current) => ({ ...current, tag: event.target.value }))}
            placeholder={mode === 'mentors' ? 'Expertise' : 'Desired skill'}
            className="min-h-12 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-cyan-600"
          />
          <button
            type="button"
            onClick={() => void loadDirectory(true, null)}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Apply
          </button>
        </div>
      </section>

      {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(loading ? [] : items).map((item) => (
          <article key={item.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-200">
                {item.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.avatar_url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{item.name}</h2>
                <p className="text-sm text-slate-600">{'title' in item ? item.title ?? 'Mentor profile' : item.career_path ?? 'Mentee profile'}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {readTags(item).slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{readSummary(item)}</p>
            <Link
              href={`/users/${item.id}`}
              className="mt-5 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Open profile
            </Link>
          </article>
        ))}
      </section>

      <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm text-slate-600">
          {items.length} result{items.length === 1 ? '' : 's'} loaded
          {cursor ? ' across multiple pages' : ''}
        </p>
        <button
          type="button"
          onClick={() => void loadDirectory(false, pageInfo.nextCursor)}
          disabled={!pageInfo.hasMore || pendingNext}
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pendingNext ? 'Loading...' : pageInfo.hasMore ? 'Load more' : 'No more results'}
        </button>
      </div>
    </div>
  );
}

function readItems(
  mode: DirectoryMode,
  response:
    | { mentors: MentorDirectoryEntry[]; pageInfo: DirectoryPageInfo }
    | { mentees: MenteeDirectoryEntry[]; pageInfo: DirectoryPageInfo },
) {
  return mode === 'mentors'
    ? (response as { mentors: MentorDirectoryEntry[] }).mentors
    : (response as { mentees: MenteeDirectoryEntry[] }).mentees;
}

function readTags(item: MentorDirectoryEntry | MenteeDirectoryEntry) {
  if ('expertise' in item) {
    return [...item.expertise, ...(item.industries ?? []), ...item.languages];
  }
  return [...item.desired_skills, ...(item.industry_preferences ?? []), ...item.languages];
}

function readSummary(item: MentorDirectoryEntry | MenteeDirectoryEntry) {
  if ('bio' in item) {
    return item.bio ?? 'This mentor has not added a public summary yet.';
  }
  return item.goals ?? 'This mentee has not added a public summary yet.';
}
