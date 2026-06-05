# Dev2Win — Rebuild Plan (v2 Architecture)

> Status: Living plan · Created 2026-06-04 · Owner: Eng
> Companion files: [task.md](./task.md) · [CLAUDE.md](./CLAUDE.md) ·
> [docs/MARKET_ANALYSIS.md](./docs/MARKET_ANALYSIS.md) ·
> [docs/MATCHING_ALGORITHM.md](./docs/MATCHING_ALGORITHM.md) ·
> [docs/AI_AGENT.md](./docs/AI_AGENT.md)

This is a **ground-up rebuild** of Dev2Win. We keep the **existing visual design
and UI** (it's good) but rebuild the entire system architecture, backend, auth,
data layer, and add an AI mentor agent + a real matching engine. The frontend flow
is re-shaped to suit the new system where needed.

---

## 0. Locked decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Repo layout | **Single repo, three service folders** (`client/`, `server/`, `ai/`) | Simple, clear boundaries; no workspace tooling needed |
| Core API | **Node.js + Express (modular, router-per-domain) + JavaScript (ESM)** | Plain Node/Express in JS per the team's choice; no TypeScript on the server |
| AI service | **Python (FastAPI)** + **Claude API** custom tool loop | Token-level control, prompt caching, ML libs for matching |
| Database | **MySQL 8** with **stored procedures** | Business/data logic in versioned procedures; thin app data layer |
| Auth | **Custom**, cookie sessions + **OAuth (Google, GitHub)** | Remove Clerk; own the identity layer |
| Cache/Queue | **Redis** (sessions, cache, rate-limit, pub/sub) + **BullMQ** workers | Async jobs, realtime fan-out, token budgeting |
| Realtime | **Socket.io** + Redis adapter | Chat + live notifications, horizontally scalable |
| Video | **Stream Video SDK** (keep) · LiveKit noted as self-host option | Proven; avoid rebuilding WebRTC |
| Vector search | **Qdrant** (or Redis Stack) | RAG for AI agent + content similarity in matching |
| Data start | **Greenfield** — no migration from MongoDB | Existing data is mock/test |

> **Hosting caveat:** stored procedures rule out PlanetScale (historically
> disabled). Use **AWS RDS MySQL / Aiven / self-hosted MySQL 8**.

---

## 1. Target architecture

```
                          ┌─────────────────────────────────────┐
                          │            Next.js (client/)          │
                          │  reused UI · new auth context · SDK   │
                          └───────┬───────────────────┬──────────┘
                          cookies │ REST/SSE           │ WebSocket
                                  ▼                    ▼
            ┌──────────────────────────────┐   ┌────────────────────┐
            │      Node API (server/)       │   │  Realtime gateway   │
            │  Express routers · guards     │   │  Socket.io+Redis    │
            │  auth · users · sessions      │   └─────────┬──────────┘
            │  lms · explore · bookings     │             │
            │  thin data layer → CALL sp_*  │             │
            └───┬───────────┬──────────┬────┘             │
                │           │          │ enqueue          │ pub/sub
       CALL sp_*│      cache│          ▼                  │
                ▼           ▼   ┌─────────────┐           │
        ┌──────────────┐ ┌─────┐│ Workers     │◄──────────┘
        │  MySQL 8     │ │Redis││ (BullMQ)    │
        │  + stored    │ │     ││ email·notif │
        │  procedures  │ └─────┘│ embeddings  │
        └──────────────┘        │ match recompute
                │               └──────┬──────┘
                │ service-to-service   │
                ▼  (signed JWT)        ▼
        ┌──────────────────────────────────────┐   ┌──────────────┐
        │        AI service (ai/)               │──►│   Qdrant      │
        │  FastAPI · Claude custom tool loop     │   │  (vectors)    │
        │  matching (TF-IDF+cosine) · RAG        │   └──────────────┘
        │  token-budget · prompt caching · tools │
        └───────────────────┬───────────────────┘
                            │ Claude Messages API
                            ▼
                     ┌──────────────┐
                     │  Anthropic    │
                     └──────────────┘
            external: Stream (video) · Stripe (payments) · Google/GitHub OAuth
```

### Service responsibilities
- **web** — UI, client state, calls API via a typed SDK; holds auth context (reads
  session via API), renders AI agent chat (SSE stream).
- **api** — system of record gateway. All persistence goes through stored
  procedures. Owns auth, RBAC, business endpoints, enqueues jobs, brokers
  service-to-service auth to the AI service.
- **ai** — Claude-powered mentor agent + matching engine. Stateless per request;
  pulls context via tools that call back into the API. Owns vector ops.
- **worker** — async/background: email, notifications, embedding generation, match
  recomputation, recording post-processing, scheduled digests.
- **realtime** — Socket.io gateway for chat/notifications (can live inside `api` or
  as its own process; Redis adapter either way).

---

## 2. Repository layout

One repo, three service folders (each self-contained with its own deps), plus
shared `db/` and `docs/`. The old v1 app is preserved under `legacy/` as a UI /
behaviour reference only.

```
DEV2WINN/
├─ client/                 # Next.js 15 (App Router) — port the v1 design here
│  ├─ app/                 # routes (server components / actions)
│  ├─ components/          # ported UI (shadcn/ui + Tailwind)
│  └─ lib/                 # typed API client (SDK), auth context
├─ server/                 # Node.js Express API in JavaScript (+ worker entrypoint)
│  └─ src/
│     ├─ config/           # env.js — env validation (zod)
│     ├─ db/               # pool.js (mysql2 + callProc) + migrate.js
│     ├─ lib/              # errors.js (envelope), redis.js, auth helpers
│     ├─ contracts/        # zod request/response schemas (mirrored client-side)
│     ├─ modules/<domain>/ # <domain>.routes.js + .service.js + .repository.js
│     └─ worker/           # BullMQ workers (email, notifications, embeddings)
├─ ai/                     # FastAPI AI service (Python)
│  └─ app/
│     ├─ core/             # config (pydantic-settings)
│     ├─ routers/          # health, match, agent (SSE)
│     ├─ agent/            # Claude tool loop + tool registry
│     └─ matching/         # TF-IDF + cosine engine
├─ db/
│  ├─ migrations/          # versioned SQL: schema + stored procedures
│  ├─ procedures/          # readable source-of-truth for procedures
│  └─ seeds/               # seed/dev data
├─ docker-compose.yml      # mysql, redis, qdrant for local dev
├─ .env.example            # root env reference (each service has its own too)
├─ CLAUDE.md  task.md  plan.md
├─ docs/
└─ legacy/                 # v1 app — reference only, not built
```

> **Shared types:** without a workspace, the API request/response schemas (zod)
> live in `server/src/contracts/` and are mirrored by a thin typed client in
> `client/lib/api/`. If type-sharing friction grows, revisit a workspace later.
> **Workers** live inside `server/` (separate entrypoint) rather than a 4th folder.

---

## 3. Cross-cutting standards (apply everywhere)

### 3.1 API design
- **REST**, versioned under `/v1`, documented via **OpenAPI** (auto-generated).
- **Validation at the boundary**: zod (Node) / pydantic (Python). Never trust input.
- **Consistent error envelope**: `{ error: { code, message, details, traceId } }`
  with correct HTTP status codes (401/403/404/409/422/429/500).
- **Pagination** (cursor-based) on all list endpoints.
- **Idempotency keys** on unsafe mutations (bookings, payments).
- **Rate limiting** (Redis token bucket) per IP + per user.

### 3.2 Data layer (stored-procedure-first)
- All reads/writes go through **stored procedures** (`sp_<domain>_<action>`).
- App code uses a **thin repository layer**: `repo.users.create(...)` →
  `CALL sp_user_create(...)`. No ad-hoc SQL scattered in services.
- **Migrations are versioned** (timestamped, forward-only, reviewed). Procedures
  live as files in `db/procedures/`, applied via migrations; never edited in prod
  directly. Tool: **dbmate** or **Flyway** (both support raw SQL + procedures).
- **Transactions** wrap multi-step procedures. Use explicit error signaling
  (`SIGNAL SQLSTATE`) so the app maps DB errors to API errors.
- **Testing**: integration tests run procedures against a disposable MySQL via
  **Testcontainers**. Every procedure has at least one test.
- See the [add-stored-procedure skill](./.claude/skills/add-stored-procedure/SKILL.md).

### 3.3 Auth & security
- **Sessions**: opaque session id in an **httpOnly, Secure, SameSite=Lax** cookie;
  session record in Redis (TTL + sliding expiry + rotation on privilege change).
- **Passwords**: **argon2id** hashing. **OAuth**: Google + GitHub via
  **arctic/oslo** (or Passport). Account linking by verified email.
- **CSRF**: double-submit token for cookie-auth mutations.
- **Headers**: helmet, strict CORS allowlist, HSTS.
- **RBAC**: roles `mentee | mentor | admin` enforced by Express **middleware guards**.
- **Secrets**: env-schema-validated, stored in a secrets manager (never in repo).
- **Service-to-service**: short-lived signed JWT between api↔ai; allowlisted.
- **OWASP** baseline; dependency scanning (Dependabot + `npm audit` / `pip-audit`).

### 3.4 Observability
- **Structured logging** (pino / structlog) with request + trace ids.
- **OpenTelemetry** traces across web→api→ai→db; **Sentry** for errors;
  **Prometheus + Grafana** for metrics; **AI cost/token dashboards** (see AI doc).

### 3.5 Testing strategy
- **Unit** (vitest / pytest) · **Integration** (Testcontainers: MySQL, Redis,
  Qdrant) · **Contract** (web↔api via the shared `contracts` package) ·
  **E2E** (Playwright on web) · **Load** (k6) before launch.
- CI gates: lint + typecheck + tests + build must pass to merge.

### 3.6 Config & DX
- **12-factor**; env validated by zod/pydantic-settings at boot (fail fast).
- **npm** per service (`client/`, `server/`, `ai/` each self-contained); no workspace tooling.
- **Conventional Commits** + changesets; pre-commit hooks (lint-staged, typecheck).
- **Dev**: `docker compose up -d` (mysql/redis/qdrant), then `npm run dev` in each service.

### 3.7 CI/CD & infra
- **GitHub Actions**: per-app affected builds via Turbo; preview deploys per PR.
- **Containers** for api/ai/worker; **web** on Vercel (or container).
- **Managed**: MySQL (RDS/Aiven), Redis (Upstash/Elasticache), Qdrant Cloud.
- Blue/green or rolling deploys; DB migrations run as a gated pipeline step.

---

## 4. Domain modules (in `server/`)

Each is an Express module: `<domain>.routes.js` (HTTP) · `.service.js` (logic) ·
`.repository.js` (stored-proc calls) · `contracts/<domain>.js` (zod) · `*.test.js`.

1. **auth** — register/login/logout, OAuth, sessions, CSRF, password reset.
2. **users** — profile, role, settings, image upload (S3/Cloudinary).
3. **mentors / mentees** — role profiles, onboarding, directories.
4. **matching** — proxies the AI service; caches recommendations.
5. **bookings** — mentor availability, session booking, calendar (later).
6. **sessions/video** — Stream token issuance, call lifecycle, recordings.
7. **chat** — conversations/messages persistence + realtime gateway.
8. **lms** — courses, modules, submodules, enrollment, progress.
9. **explore** — posts, answers, comments, votes, reputation.
10. **notifications** — in-app + email (enqueues to worker).
11. **reviews** — ratings tied to completed sessions.
12. **payments** — Stripe (later): checkout, subscriptions, webhooks.
13. **admin** — content authoring/CMS, mentor verification, moderation.

---

## 5. Feature workstreams (what we're building)

### 5.1 Mentor↔Mentee matching engine
TF-IDF + cosine similarity over profile text, blended with structured filters and
a learned weight. Runs in the AI/Python service; vectors in Qdrant; recomputed by a
worker on profile change. **Full design → [docs/MATCHING_ALGORITHM.md](./docs/MATCHING_ALGORITHM.md).**

### 5.2 24/7 AI mentor agent
Claude-powered agent in FastAPI with a custom tool loop. Tools (book a session,
fetch roadmap, look up a mentor, summarize progress, answer from course content via
RAG) are invoked **on demand**. Aggressive **token-efficiency** (prompt caching,
context compaction, model routing, per-user budgets). **Full design →
[docs/AI_AGENT.md](./docs/AI_AGENT.md).**

### 5.3 Everything from the v1 roadmap
Booking + Stripe payments, reviews backend, real notifications, search, certificates
/ gamification, cohorts, calendar sync, admin CMS — sequenced in the phases below
and tracked in [task.md](./task.md). Market context → [docs/MARKET_ANALYSIS.md](./docs/MARKET_ANALYSIS.md).

### 5.4 Frontend (reuse design, re-shape flow)
- Keep the existing visual language, components, and pages.
- Replace **Clerk** with the new cookie-based auth context + protected routes.
- Replace direct/mock fetches with the typed API client (`client/lib/api`).
- Add: AI agent chat surface (SSE streaming), booking flow, real progress, working
  chat, notifications center, search.
- Adopt **server components + server actions** for data fetching; React Query for
  client mutations where needed. Consolidate UI system (drop Mantine *or* shadcn —
  pick one; recommend **shadcn/ui** + Tailwind only).

---

## 6. Phased delivery

> Each phase ends with: tests green, docs updated, demoable. Track in [task.md](./task.md).

| Phase | Theme | Key deliverables | Exit criteria |
|------|-------|------------------|---------------|
| **P0** | Foundations | Three-folder repo, docker-compose (mysql/redis/qdrant), CI, env validation, migration runner, server contracts | all three services boot; CI green; one sample stored proc + test runs |
| **P1** | Auth & identity | Custom cookie sessions, argon2 register/login, Google+GitHub OAuth, CSRF, RBAC guards, Redis sessions | A user can sign up (3 ways), stay logged in, log out; protected routes enforced |
| **P2** | Users & profiles | User/mentor/mentee schema + procedures, onboarding flow (persisted!), directories, image upload | Role selection + onboarding fully saved; directories render real data |
| **P3** | Matching engine | FastAPI matching (TF-IDF+cosine+filters), Qdrant vectors, recompute worker, recommendations API + cache | Dashboard shows real, ranked matches; recompute on profile edit |
| **P4** | Sessions & booking | Mentor availability, booking + idempotency, Stream video, recordings | Mentee books a slot → call happens → recording listed |
| **P5** | Realtime | Socket.io+Redis chat (persisted via procedures), notifications (in-app + email worker) | Two users chat live; notifications delivered |
| **P6** | LMS | Course/module/submodule schema, enrollment, **real progress tracking**, admin authoring | Progress computed from activity; admin can author a course |
| **P7** | Explore Q&A | Posts/answers/comments/votes, reputation, search | Full Q&A loop with voting + search |
| **P8** | AI mentor agent | FastAPI Claude loop, tool registry, RAG over course content, token budgeting, streaming chat UI | Mentee asks agent → it uses tools (book/roadmap/lookup) and answers, within budget |
| **P9** | Monetization & trust | Stripe (sessions/subscriptions), reviews tied to sessions, mentor verification | Paid booking works end-to-end; reviews appear post-session |
| **P10** | Harden & launch | OTel/Sentry/Grafana, security review, k6 load test, a11y, polish, runbooks | SLOs met; security sign-off; launch checklist done |

Parallelization: P3/P4/P5 can overlap once P1–P2 land. AI agent (P8) can start a
spike during P3 (shares the FastAPI service + Qdrant).

---

## 7. Restructuring approach (from v1 → v2)

1. **Stand up the three-folder repo fresh** (P0, done) — do **not** migrate the old
   Next app in place. Build `client/` and **port UI components** from `legacy/`
   (they're reusable), stripping Clerk and mock fetches as we go.
2. **Port the design system** into `client/components/` (from `legacy/components/`).
3. **Re-implement each feature** behind the new Express API + `client/lib/api`,
   phase by phase, instead of porting old API routes (they had auth/validation gaps
   — see v1 [docs/TECH_DEBT.md](./docs/TECH_DEBT.md)).
4. **Greenfield DB** — model schema cleanly with required fields, a real `role`,
   progress/enrollment, bookings, notifications, reviews (see v1 DATA_MODEL notes).
5. Old repo stays as a **reference** for UI/markup and product behavior only.

---

## 8. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Stored-proc-heavy logic is hard to test/version | Procedures as files + migrations + Testcontainers tests; SIGNAL for errors |
| AI token costs spiral | Per-user budgets, prompt caching, model routing, compaction (AI doc §token-efficiency) |
| Matching quality poor at small data | Hybrid score (rules + similarity), cold-start heuristics, feedback loop |
| Two-language (Node+Python) overhead | Shared contracts package, OpenAPI, strict service boundaries, one CI |
| Custom auth security bugs | Use vetted libs (argon2, arctic/oslo), CSRF, security review in P10 |
| Scope creep across 10 phases | Phase exit criteria + task.md tracking; ship vertically |

---

## 9. Definition of Done (per feature)
Code + tests (unit/integration) green · zod/pydantic validation · authz enforced ·
errors mapped to proper status · telemetry added · docs + `task.md` updated ·
reviewed · demoable behind a flag.

---

## 10. Immediate next steps
See [task.md](./task.md) → **Phase 0** checklist. Start by scaffolding the monorepo,
docker-compose, and the first vertical slice (auth register/login) to prove the
stored-procedure + repository + contracts pattern end-to-end.
