# Dev2Win — Task Tracker

> Single source of truth for **work in progress**. Update this every working
> session. Pair with [plan.md](./plan.md) (the "why/what") — this file is the
> "who/when/status". Keep entries small and verifiable.

## How to use this file
- Each task has: `[ ]` todo / `[~]` in-progress / `[x]` done / `[!]` blocked.
- Group tasks under the phase from [plan.md §6](./plan.md).
- When you start a task, set `[~]` and add your initials + date.
- When done, set `[x]`, link the PR, and note any follow-ups.
- Move surprises/decisions into the **Decision log** at the bottom.
- Anything blocked → `[!]` with the blocker and who can unblock.

**Legend:** `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked
**Status key (current phase):** P0 — Foundations 🚧

---

## Phase 0 — Foundations 🚧 (nearly done)
- [x] Repo structure: `client/`, `server/`, `ai/`, `db/`; v1 moved to `legacy/`; git init
- [x] `docker-compose.yml` — MySQL 8.4 (host **3307**), Redis, Qdrant
- [x] Root `.env.example` + `.gitignore` + README
- [x] `server/` **Express + JavaScript** skeleton (helmet, CORS, cookie, rate-limit, pino-http, error envelope)
- [x] Env schema validation — zod (server) + pydantic-settings (ai), fail-fast
- [x] Migration runner (line-exact delimiter) + `db/migrations` + `db/procedures`
- [x] `server/` mysql2 pool + `callProc` helper
- [x] `server/src/contracts/` — zod schemas (users) + mirror convention
- [x] `server/src/worker/` BullMQ skeleton (no-op job) + `npm run worker`
- [x] `ai/` FastAPI skeleton (health, config, matching + agent stubs, /v1/match) — py syntax ✓
- [x] `client/` Next.js 15 skeleton (no Clerk; api proxy via rewrites)
- [x] **First vertical slice proven end-to-end**: `POST /v1/users` → service → repository → `sp_user_create` → MySQL; `EMAIL_TAKEN` SIGNAL → 422/409 envelope. **5/5 tests green** (3 unit + 2 integration); server boots and smoke-tested (health/ready/create/validation)
- [x] CI (GitHub Actions): server (migrate+test) · client (build) · ai (pytest)
- [ ] `server/src/lib/logger` — dedicated pino + OpenTelemetry bootstrap (currently inline pino-http)
- [ ] Verify `client` + `ai` `npm/pip install` + boot (server verified ✓)
- [ ] Add `eslint` config for server (JS, ESM) + a couple of pytest cases for ai

**Exit:** all three services boot locally; CI green; sample stored proc + test passing.
**Status:** server fully verified against real MySQL; client/ai boot-check remains.

## Phase 1 — Auth & identity ⏳
- [ ] User/session/credential schema + procedures (`sp_user_*`, `sp_session_*`)
- [ ] Register (argon2id) + login + logout
- [ ] Cookie session (httpOnly/Secure/SameSite) + Redis store + sliding TTL
- [ ] CSRF (double-submit) for cookie mutations
- [ ] OAuth: Google (arctic/oslo)
- [ ] OAuth: GitHub
- [ ] Account linking by verified email
- [ ] RBAC roles (`mentee|mentor|admin`) + Nest guards
- [ ] Password reset (token via email worker)
- [ ] Web: auth context, login/signup screens (reuse design), protected routes

## Phase 2 — Users & profiles ⏳
- [ ] User + mentor + mentee schema/procedures (clean, required fields, real `role`)
- [ ] Onboarding flow — **persisted** (role select → role-specific steps)
- [ ] Profile read/update endpoints + SDK
- [ ] Image upload (S3/Cloudinary signed upload)
- [ ] Mentor & mentee directories (cursor pagination + filters)

## Phase 3 — Matching engine ⏳
- [x] FastAPI matching endpoint (TF-IDF + cosine + structured filters) — 2026-06-06: hybrid scorer + `/v1/recommendations`
- [ ] Profile→document builder + embedding/vector pipeline
- [ ] Qdrant collection + upsert on profile change (via worker)
- [x] Hybrid scoring + cold-start heuristics — 2026-06-06: filters, rule boosts, feedback component, explainable reasons
- [x] Recommender benchmark/eval harness — 2026-06-07: seeded precision@k/MRR/nDCG + latency eval under `ai/scripts/eval_matching.py`
- [~] Recommendations API in `api` (cache in Redis) + dashboard wiring — 2026-06-07: Express proxy + Redis cache added; dashboard wiring pending
- [x] Feedback signal capture (accepted/dismissed matches) — 2026-06-07: stored-procedure-backed `/v1/matching/feedback`

## Phase 4 — Sessions & booking ⏳
- [ ] Mentor availability model + procedures
- [ ] Booking endpoint with idempotency keys + conflict handling
- [ ] Stream token issuance + call lifecycle
- [ ] Recordings listing
- [ ] Web: booking flow + meeting room (reuse design)

## Phase 5 — Realtime chat & notifications ⏳
- [ ] Socket.io gateway + Redis adapter
- [ ] Conversation/message persistence (procedures)
- [ ] Delivery/read receipts + presence
- [ ] Notification model + in-app center
- [ ] Email notifications via worker (Resend/SendGrid)

## Phase 6 — LMS ⏳
- [ ] Course/module/submodule schema + procedures (move off static files)
- [ ] Enrollment + **real progress tracking**
- [ ] Admin authoring (CMS) for content
- [ ] Web: roadmap + progress UI wired to real data

## Phase 7 — Explore Q&A ⏳
- [ ] Posts/answers/comments schema + procedures
- [ ] Voting + reputation
- [ ] Search (full-text / vector)
- [ ] Web: Q&A loop wired

## Phase 8 — AI mentor agent ⏳
- [x] FastAPI Claude tool loop + tool registry (see docs/AI_AGENT.md) — 2026-06-06: `/v1/agent/chat`, `/v1/agent/tools`
- [x] Tools: book_session, get_roadmap, lookup_mentor, summarize_progress, course_qa(RAG) — 2026-06-06: also added user info, LMS status/search, web search, reminders, escalation
- [x] RAG pipeline over course content (local FAISS + Google Generative AI embeddings) — 2026-06-06: `/v1/rag/chunks`
- [x] Chat document uploads + automatic chunking — 2026-06-07: TXT/MD/PDF/DOCX upload, recursive token chunker, session-scoped FAISS ingestion, chat UI attachment control
- [x] Token-efficiency: prompt caching, compaction, model routing, per-user budget — 2026-06-06: initial in-process budget store + compaction + model routing
- [x] SSE streaming chat UI in web — 2026-06-07: first-screen AI chat + Next proxy route, build + HTTP smoke green
- [~] Guardrails: safety, scope limits, escalation to human mentor — 2026-06-06: system scope prompt + mutating-tool confirmations + escalation tool; audit persistence pending

## Phase 9 — Monetization & trust ⏳
- [ ] Stripe: checkout, subscriptions, webhooks (idempotent)
- [ ] Reviews/ratings tied to completed sessions
- [ ] Mentor verification workflow + badges

## Phase 10 — Harden & launch ⏳
- [ ] OTel traces end-to-end + Grafana dashboards (incl. AI cost)
- [ ] Sentry + alerting + runbooks
- [ ] Security review (auth, CSRF, OWASP, deps)
- [ ] k6 load test + perf budget
- [ ] Accessibility (WCAG) pass + polish
- [ ] Launch checklist + on-call

---

## In progress (current)
| Task | Owner | Started | Notes |
|------|-------|---------|-------|
| Phase 0 scaffold | Claude | 2026-06-04 | client/server/ai + db + docker-compose done. Server (Express/JS) fully verified vs real MySQL: 5/5 tests, boots, smoke-tested. CI + worker done. Remaining: client/ai boot-check, server eslint, ai pytest |
| Phase 8 AI service | Codex | 2026-06-06 | Claude Sonnet 4 tool loop, Anthropic MCP connector config, registry, LMS/user/web tools, AI DB connector, local FAISS RAG with Google embeddings, token-efficiency layer, pytest + HTTP smoke green |
| Phase 3 recommender | Codex | 2026-06-06 | Hybrid mentor↔mentee ranker, reverse recommendations, Express proxy; AI/server tests + HTTP E2E smoke green |
| Phase 3 cache/feedback | Codex | 2026-06-07 | Redis recommendation cache + stored-procedure feedback endpoint added; migration written, local MySQL 3307 unavailable for apply |
| Phase 3 eval | Codex | 2026-06-07 | Matching eval harness added; seeded benchmark: precision@1=1.00, precision@3=1.00, MRR=1.00, nDCG@3=1.00, ~1.38 ms/case |
| Phase 8 chat UI | Codex | 2026-06-07 | Next AI mentor chat first screen + SSE proxy; client typecheck/build and proxy smoke green |
| Phase 8 document upload RAG | Codex | 2026-06-07 | Multipart document upload endpoint, TXT/MD/PDF/DOCX extraction, recursive token chunker with overlap, user/session scoped FAISS ingestion, UI attach flow |

## Blocked
| Task | Blocker | Needs |
|------|---------|-------|
| _none_ | | |

## Decision log
| Date | Decision | Why |
|------|----------|-----|
| 2026-06-04 | Monorepo (Turborepo+pnpm), NestJS API, FastAPI AI, MySQL stored procedures, custom cookie auth + Google/GitHub OAuth, Redis+BullMQ, greenfield | Kickoff architecture (see plan.md §0) |
| 2026-06-04 | **Revised structure:** single repo, three folders `client/`+`server/`+`ai/` (no Turborepo/pnpm). Workers live in `server/src/worker/`. v1 moved to `legacy/` as reference. | User wanted a simpler three-folder layout |
| 2026-06-05 | **Server = Node.js + Express in plain JavaScript (ESM), NOT TypeScript** (replaced the initial Fastify+TS scaffold). All server files are `.js`. | User instruction: "the main server should be javascript files not ts files" (clarified they meant Node/Express, not Next.js) |
| 2026-06-05 | MySQL container on host port **3307** (host 3306 was taken by a local MySQL); removed `--default-authentication-plugin` flag (unsupported/removed in MySQL 8.4) | Real conflicts hit during P0 bring-up |
| 2026-06-06 | AI RAG uses **Google Generative AI embeddings + local FAISS** instead of Qdrant for the current build; Claude Sonnet 4 remains the main tool-loop model; web search uses Gemini Google Search grounding; optional Anthropic MCP connector supports remote MCP toolsets | User requested Google Generative AI, local FAISS, Claude 4 Sonnet, Anthropic MCPs, LMS/user/web-search tools |
| 2026-06-06 | AI DB connector defaults to main API calls and keeps direct MySQL stored-procedure access disabled unless explicitly enabled with an allowlist | Preserve stored-procedure-first data boundary while satisfying AI data/tool needs |

## Follow-ups / parking lot
- Decide: keep Stream vs migrate to LiveKit (self-host) — revisit at P4.
- Decide: drop Mantine or shadcn (recommend keep shadcn) — do during web port.
- Confirm monetization model (free/freemium/subscription) — affects P9 scope.
- Hosting: confirm managed MySQL (RDS/Aiven) since PlanetScale lacks stored procs.
