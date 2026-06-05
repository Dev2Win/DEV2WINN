# CLAUDE.md — Agent Context for Dev2Win

This file orients any AI agent (Claude Code or the Claude Agent SDK) working in
this repo. Read this first, then [plan.md](./plan.md) and [task.md](./task.md).

## What this project is
Dev2Win is a tech-career **mentorship + learning platform** (mentor↔mentee
matching, LMS roadmaps, video sessions, chat, Q&A, and a 24/7 AI mentor agent).
We are doing a **ground-up v2 rebuild** — keep the existing UI/design, rebuild
everything else. Background: [docs/PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md),
[docs/PRD.md](./docs/PRD.md). The old (v1) architecture and its debt:
[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md), [docs/TECH_DEBT.md](./docs/TECH_DEBT.md).

## Architecture at a glance (v2)
One repo, three service folders (no workspace tooling):
- `client/` — Next.js 15, reused v1 design, cookie auth, typed API client (`client/lib/api`).
- `server/` — **Node.js + Express in JavaScript (ESM, no TypeScript)** API; all
  persistence via **MySQL stored procedures** (modules in
  `server/src/modules/<domain>/{<domain>.routes.js,.service.js,.repository.js}`).
  BullMQ workers live in `server/src/worker/`.
- `ai/` — FastAPI + **Claude API** custom tool loop (mentor agent + matching engine).
- `db/{migrations,procedures,seeds}` · `docker-compose.yml` (mysql/redis/qdrant).
- `legacy/` — the v1 app, **reference only** (don't build it).

Path mapping (older docs may say `apps/*`): `apps/web`→`client/`, `apps/api`→`server/`,
`apps/ai`→`ai/`, `apps/worker`→`server/src/worker/`, `packages/contracts`→`server/src/contracts/`.

Full detail: [plan.md](./plan.md). Locked decisions: [plan.md §0](./plan.md).

## Golden rules (do these by default)
1. **Stored-procedure-first data layer.** Never write ad-hoc SQL in services.
   Add/modify a procedure in `db/procedures/`, ship it via a migration, and call it
   through the thin repository layer. Use the
   [add-stored-procedure skill](./.claude/skills/add-stored-procedure/SKILL.md).
2. **Validate at the boundary.** Every endpoint validates input with zod (Node) or
   pydantic (Python). Server schemas live in `server/src/contracts/` and are mirrored
   by `client/lib/api/` — don't duplicate ad-hoc.
3. **Auth is custom.** Cookie sessions (httpOnly/Secure/SameSite) + Redis +
   CSRF; OAuth via arctic/oslo. **No Clerk.** Enforce RBAC with Express middleware guards.
4. **Errors are typed.** Return the standard envelope `{ error:{code,message,details,traceId} }`
   with correct HTTP status. Map DB `SIGNAL` errors to API errors.
5. **Token efficiency for AI is non-negotiable.** Prompt caching, context
   compaction, model routing, per-user budgets, tools called only when needed.
   See [docs/AI_AGENT.md](./docs/AI_AGENT.md).
6. **Tests gate merges.** Unit + integration (Testcontainers for MySQL/Redis/Qdrant)
   + contract + (web) Playwright. No feature is done without tests.
7. **Update [task.md](./task.md)** when you start/finish work; log decisions there.
8. **Reuse the existing UI/design.** Port components; restructure flow only where
   the new system requires it. Prefer shadcn/ui + Tailwind (consolidate away from Mantine).

## Conventions
- **Language/stack:** `server/` is **JavaScript (ESM, Node 22 + Express) — NOT
  TypeScript**; `client/` is Next.js (TS ok there); `ai/` is Python 3.12+. npm per
  service (no pnpm/workspaces).
- **Naming:** procedures `sp_<domain>_<action>`; tables snake_case; JS camelCase;
  module files `<domain>.routes.js`/`.service.js`/`.repository.js`; REST routes
  `/v1/<resource>` plural, cursor pagination.
- **Commits:** Conventional Commits. Small, vertical PRs.
- **Config:** env validated at boot (zod/pydantic-settings); never commit secrets.
- **Service-to-service:** api↔ai use short-lived signed JWT; allowlist origins.
- **Observability:** structured logs (pino/structlog) with traceId; OTel spans.

## When implementing a feature (checklist)
1. Find the phase/task in [task.md](./task.md); set it `[~]`.
2. Define/extend contracts in `packages/contracts` (zod).
3. Data: add stored procedure(s) + migration + repository method.
4. API: Express router/service/guard (JS); validate + map errors.
5. Worker: enqueue async work if needed.
6. Web: wire via SDK; reuse design; server components/actions for fetch.
7. Tests: unit + integration (+ contract/e2e as relevant).
8. Telemetry + docs; set task `[x]`, link PR, note follow-ups.

## Skills available (in `.claude/skills/`)
- **add-stored-procedure** — create a MySQL procedure + migration + repo + test.
- **add-api-module** — scaffold an Express domain module in JS (router/service/repo/contracts).
- **add-ai-tool** — register a new tool for the AI mentor agent (schema + handler + budget).
- **add-frontend-feature** — add a Next.js feature reusing the design system + SDK.

## Key references
- Master plan & phases: [plan.md](./plan.md)
- Work tracking: [task.md](./task.md)
- Matching engine design: [docs/MATCHING_ALGORITHM.md](./docs/MATCHING_ALGORITHM.md)
- AI agent design: [docs/AI_AGENT.md](./docs/AI_AGENT.md)
- Market analysis: [docs/MARKET_ANALYSIS.md](./docs/MARKET_ANALYSIS.md)
- v1 reference (UI/behavior only): the original Next.js app at repo root.

## Guardrails
- Don't reintroduce Clerk, ad-hoc SQL, or unvalidated endpoints.
- Don't dump large context into Claude prompts — retrieve + cache instead.
- Don't break the contracts package without updating both sides + the SDK.
- Ask before: irreversible data ops, new external services, or changing locked
  decisions in [plan.md §0](./plan.md).
