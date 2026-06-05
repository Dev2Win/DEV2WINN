# Dev2Win (v2)

Tech-career mentorship + learning platform. Ground-up rebuild — three services in
one repo.

```
DEV2WINN/
├─ client/     # Next.js 15 frontend (reuses the v1 design)
├─ server/     # Node.js main API (Express + JavaScript, MySQL stored procedures)
├─ ai/         # FastAPI AI service (Claude mentor agent + matching engine)
├─ db/         # SQL migrations + stored procedures + seeds
├─ docs/       # product + engineering docs
├─ legacy/     # the v1 app (UI / behaviour reference only — not built)
├─ plan.md     # master rebuild plan + phases
├─ task.md     # living task tracker
└─ CLAUDE.md   # agent context + golden rules
```

## Quick start

```bash
# 1. infra (MySQL, Redis, Qdrant)
docker compose up -d

# 2. database (migrations + procedures)
cd server && cp .env.example .env && npm install && npm run db:migrate

# 3. main server  → http://localhost:4000
npm run dev

# 4. ai service   → http://localhost:8000
cd ../ai && cp .env.example .env && python -m venv .venv && . .venv/Scripts/activate \
  && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000

# 5. client       → http://localhost:3000
cd ../client && cp .env.example .env.local && npm install && npm run dev
```

| Service | Port | Stack |
|---------|------|-------|
| client  | 3000 | Next.js 15, React 18, Tailwind + shadcn/ui |
| server  | 4000 | Node.js, Express, JavaScript, mysql2, Redis, BullMQ |
| ai      | 8000 | FastAPI, Anthropic Claude, Qdrant, scikit-learn |

## Docs
- Plan & phases: [plan.md](./plan.md) · Tasks: [task.md](./task.md) · Agent rules: [CLAUDE.md](./CLAUDE.md)
- Architecture, PRD, market analysis, matching, AI agent: [docs/](./docs/README.md)

> Ports: client 3000 · server 4000 · ai 8000 · MySQL 3306 · Redis 6379 · Qdrant 6333.
