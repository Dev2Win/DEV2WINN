---
name: add-frontend-feature
description: Use when building or wiring a UI feature in the Dev2Win web app (apps/web, Next.js 15). Reuses the existing design system, calls the backend via the typed SDK (not raw fetch), uses the custom cookie auth context (no Clerk), and follows server-component/action data patterns. Trigger on "add a page/screen", "wire up the UI", "build the X frontend".
---

# Add a Frontend Feature (Dev2Win web)

We **reuse the existing visual design and UI**, restructuring flow only where the
v2 system requires it. See [plan.md §5.4](../../../plan.md).

## Steps
1. **Reuse the design** — port components from `legacy/components/` into
   `client/components/`. Match the existing visual language. Prefer **shadcn/ui +
   Tailwind**; do **not** add Mantine (we're consolidating away from it).

2. **Data via the API client** — call the server through `client/lib/api/` (typed,
   mirrors `server/src/contracts`). **No raw `fetch` to hardcoded URLs**, no mock
   data left in production paths. (Dev calls proxy via `next.config` rewrites.)

3. **Auth context** — use the custom cookie-session auth context (**no Clerk**).
   Protected routes check the session via the API; redirect unauthenticated users.

4. **Data fetching** — prefer **React Server Components / server actions** for reads
   and mutations; use a client query lib only where interactivity needs it. Stream
   where it helps (e.g., AI chat via SSE).

5. **States** — handle loading, empty, and error states (use the shared error
   envelope). No silent failures.

6. **Forms** — react-hook-form + zod resolvers, mirroring schemas from
   `server/src/contracts` in `client/lib/api/`.

7. **Accessibility** — semantic HTML, labels, keyboard nav, focus management.

8. **Tests** — component tests + a Playwright e2e for the happy path.

9. **Track** — update [task.md](../../../task.md).

## Conventions
- One UI system (shadcn/ui + Tailwind). Share components, don't fork them.
- Reference files with markdown links; keep flows consistent with the design.
- Never reintroduce Clerk or `localhost` hardcoded URLs (v1 bugs — see
  [docs/TECH_DEBT.md](../../../docs/TECH_DEBT.md)).

## Checklist
- [ ] UI reuses design system (shadcn/Tailwind), no Mantine added
- [ ] Data via typed client/lib/api (no raw fetch / mock data)
- [ ] Custom auth context + route protection (no Clerk)
- [ ] Server components/actions for fetch; SSE where streaming
- [ ] Loading/empty/error states handled
- [ ] Forms use rhf + zod (shared contracts)
- [ ] a11y + component test + Playwright e2e
- [ ] task.md updated
