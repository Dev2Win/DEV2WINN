import Link from 'next/link';
import { getOptionalServerSession } from '../lib/server-session';

export default async function HomePage() {
  const session = await getOptionalServerSession();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#e0f2fe_40%,_#f8fafc_100%)] px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-[2.75rem] border border-cyan-200/70 bg-[linear-gradient(135deg,_rgba(8,145,178,0.98),_rgba(15,23,42,0.98))] p-8 text-white shadow-[0_35px_90px_-45px_rgba(8,145,178,0.75)] sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-100">Dev2Win</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Mentorship, matching, and onboarding now run on the new auth stack.
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-cyan-50/90 sm:text-base">
            Phase 1 and Phase 2 now have dedicated routes, protected app areas, persisted role onboarding, paginated
            directories, public profile pages, password reset, OAuth, and signed Cloudinary avatar uploads.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={session.user ? '/dashboard' : '/signup'}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950"
            >
              {session.user ? 'Open dashboard' : 'Create account'}
            </Link>
            <Link href={session.user ? '/profile' : '/login'} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white">
              {session.user ? 'View profile' : 'Login'}
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Protected routes',
              text: 'Auth now lives in dedicated login/signup screens, and the app area redirects unauthenticated users.',
            },
            {
              title: 'Saved onboarding',
              text: 'Mentor and mentee onboarding is step-based, persisted, and reused by profile discovery and matching.',
            },
            {
              title: 'Real discovery',
              text: 'Mentor and mentee directories support pagination, filters, and public profile links backed by the new API.',
            },
          ].map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
