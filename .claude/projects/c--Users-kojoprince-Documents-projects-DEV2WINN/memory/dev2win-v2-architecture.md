---
name: dev2win-v2-architecture
description: Dev2Win is being rebuilt ground-up (v2). Locked stack/architecture decisions for the rebuild.
metadata:
  type: project
---

Dev2Win (tech-career mentorship + learning platform) is being **rebuilt from scratch (v2)** as of 2026-06-04. Keep the existing UI/design; rebuild everything else.

**Locked decisions (see plan.md §0):**
- Single repo, **three service folders**: `client/` (Next.js), `server/` (Node API), `ai/` (FastAPI). Plus `db/{migrations,procedures,seeds}` and `legacy/` (v1 app, reference only). **No Turborepo/pnpm** — each folder self-contained (npm/pip). Workers live in `server/src/worker/`.
- Core API (`server/`): **Node.js + Express in plain JavaScript (ESM), NOT TypeScript** — all `.js` files. Modular: `server/src/modules/<domain>/{<domain>.routes.js,.service.js,.repository.js}`, mounted in `app.js`. (Evolution: planned NestJS → Fastify → settled on Express/JS per user instruction.) Data via `callProc('sp_*')` in `db/pool.js`. Error envelope in `lib/errors.js`. Run on port 4000.
- **Local infra gotchas:** MySQL runs on host port **3307** (3306 is taken by a local MySQL); MySQL 8.4 dropped `--default-authentication-plugin`. `server/.env` has MYSQL_PORT=3307.
- AI service: Python FastAPI + Claude API custom tool loop (the "24/7 mentor agent").
- Database: MySQL 8 with **stored procedures** (stored-procedure-first data layer; thin repository calls `sp_<domain>_<action>`). Rules out PlanetScale → use RDS/Aiven.
- Auth: **custom** cookie sessions (httpOnly, Redis-backed) + CSRF + OAuth (Google, GitHub via arctic/oslo). **Clerk removed.**
- Redis + BullMQ workers; Socket.io (+Redis adapter) for realtime; Stream kept for video; Qdrant for vectors/RAG.
- Greenfield — no migration from the old MongoDB.

**Matching:** TF-IDF + cosine similarity + structured rule re-rank, explainable, in `apps/ai` (see docs/MATCHING_ALGORITHM.md).
**AI agent:** token-efficiency is first-class (prompt caching, compaction, model routing, per-user Redis budgets, tools-on-demand) — see docs/AI_AGENT.md.

Planning artifacts live at repo root: `plan.md` (master plan + 10 phases), `task.md` (tracker), `CLAUDE.md` (agent rules), and `.claude/skills/` (add-stored-procedure, add-api-module, add-ai-tool, add-frontend-feature). Market analysis in docs/MARKET_ANALYSIS.md. v1 docs in docs/ describe the old app (UI/behavior reference only).
