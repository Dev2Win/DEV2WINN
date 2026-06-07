# Dev2Win

Tech-career mentorship and learning platform. This repo contains the frontend,
main API, AI mentor service, database migrations, and planning docs.

```text
DEV2WINN/
├─ client/     # Next.js 15 frontend (reuses the v1 design)
├─ server/     # Node.js main API (Express + JavaScript, MySQL stored procedures)
├─ ai/         # FastAPI AI service (Claude mentor agent, RAG, matching)
├─ db/         # SQL migrations + stored procedures + seeds
├─ docs/       # product + engineering docs
├─ legacy/     # v1 app reference only
├─ plan.md     # master rebuild plan + phases
├─ task.md     # living task tracker
└─ CLAUDE.md   # agent context + golden rules
```

## Current Status

Implemented and verified:

- AI mentor agent using Claude Sonnet 4.
- Tool registry and tool-calling loop.
- LMS, user-info, web-search, mentor lookup, roadmap, progress, and RAG tools.
- Google Generative AI embeddings with local FAISS storage.
- User/session-scoped chat memory and FAISS retrieval isolation.
- Chat sessions: list, rename, and soft-delete.
- Chat document uploads for TXT, MD, PDF, and DOCX.
- Automatic document extraction and token-window chunking with overlap.
- Adaptive learning engine using Bayesian skill mastery estimates.
- Course/RAG recommender path.
- Mentor recommender and mentor/mentee matching algorithm.
- Matching feedback capture and seeded benchmark/eval harness.
- Frontend AI mentor interface.
- Local `dev2win/` Python virtualenv and AI runner script.

Known caveats:

- Real LMS/profile production data endpoints still need full app data wiring.
- Uploaded document metadata is stored in FAISS chunk metadata, not a dedicated DB table yet.
- Matching eval is seeded/synthetic until real profile/outcome data exists.
- Rotate any API keys that were shared in chat before production use.

## Quick start

```bash
# 1. Install server deps
cd server
npm install

# 2. Database with Docker MySQL on host 3307
cd ..
docker compose up -d
cd server
npm run db:migrate

# Alternative: use local MySQL on normal port 3306
MYSQL_HOST=127.0.0.1 MYSQL_PORT=3306 MYSQL_USER=dev2win MYSQL_PASSWORD=dev2win MYSQL_DATABASE=dev2win npm run db:migrate

# 3. Main server -> http://localhost:4000
npm run dev

# 4. AI service -> http://127.0.0.1:8000
cd ..
python3 -m venv dev2win
dev2win/bin/python -m pip install -r ai/requirements.txt
scripts/run-ai-agent.sh

# 5. Client -> http://localhost:3000
cd client
npm install
npm run dev
```

## Environment

Put local secrets in `.env.local`. Do not commit real keys.

Required for live AI calls:

```bash
ANTHROPIC_API_KEY=...
GOOGLE_API_KEY=...
```

The AI runner loads root `.env.local` automatically.

| Service | Port | Stack |
|---------|------|-------|
| client  | 3000 | Next.js 15, React 18, Tailwind + shadcn/ui |
| server  | 4000 | Node.js, Express, JavaScript, mysql2, Redis, BullMQ |
| ai      | 8000 | FastAPI, Anthropic Claude, Google Generative AI, local FAISS, scikit-learn |

## AI Service

Start:

```bash
scripts/run-ai-agent.sh
```

Core endpoints:

- `GET /health`
- `POST /v1/agent/chat`
- `GET /v1/agent/tools`
- `POST /v1/rag/chunks`
- `POST /v1/rag/documents`
- `GET /v1/agent/users/{user_id}/sessions`
- `PATCH /v1/agent/users/{user_id}/sessions/{conversation_id}`
- `DELETE /v1/agent/users/{user_id}/sessions/{conversation_id}`
- `GET /v1/agent/learners/{user_id}`
- `POST /v1/match`
- `POST /v1/recommendations`

Document uploads support TXT, MD, PDF, and DOCX. Uploaded documents are extracted,
chunked, and indexed into local FAISS with `user_id` and `conversation_id` scope.
Default chunking is `750` tokens with `100` token overlap.

## Verification

```bash
# AI tests
cd ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=. ../dev2win/bin/python -m pytest tests

# Matching benchmark
PYTHONPATH=. ../dev2win/bin/python scripts/eval_matching.py

# Server tests
cd ../server
npm test

# Client checks
cd ../client
npm run typecheck
npm run build
```

Latest verified results:

- AI tests: `16 passed`
- Server tests: `7 passed, 2 skipped`
- Client typecheck/build: passed
- Matching seeded benchmark: precision@1 `1.00`, precision@3 `1.00`, MRR `1.00`, nDCG@3 `1.00`
- DB migrations applied on local MySQL `127.0.0.1:3306`

## Generated Files

The repo ignores local/generated artifacts including:

- `dev2win/`
- `.env.local`
- `node_modules/`
- `client/.next/`
- Python `__pycache__/`
- `ai/.rag/`
- `ai/.agent/`
- FAISS/index files

## Docs
- Plan & phases: [plan.md](./plan.md) · Tasks: [task.md](./task.md) · Agent rules: [CLAUDE.md](./CLAUDE.md)
- Architecture, PRD, market analysis, matching, AI agent: [docs/](./docs/README.md)

Ports: client `3000` · server `4000` · ai `8000` · MySQL `3306`/`3307` · Redis `6379` · Qdrant `6333`.
