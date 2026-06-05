# Dev2Win — Documentation

Dev2Win is a career mentorship and learning platform for aspiring and practicing
software developers. It connects **mentees** with **mentors**, and surrounds that
relationship with a learning-management system (course roadmaps), 1:1 video
meetings, real-time chat, and a community Q&A forum.

This `docs/` folder is the single source of truth for product and engineering.

## Document index

| Document | What it covers |
|----------|----------------|
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Vision, target users, value proposition, current status |
| [PRD.md](./PRD.md) | Product Requirements: goals, personas, user stories, scope, success metrics |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, tech stack, request flows, folder structure |
| [FEATURES.md](./FEATURES.md) | Detailed catalog of built features and feature gaps |
| [DATA_MODEL.md](./DATA_MODEL.md) | MongoDB/Mongoose schemas and relationships |
| [API.md](./API.md) | REST API routes, server actions, and webhooks |
| [ROADMAP.md](./ROADMAP.md) | Market analysis, proposed features, and phased roadmap |
| [SETUP.md](./SETUP.md) | Local setup, environment variables, scripts |
| [TECH_DEBT.md](./TECH_DEBT.md) | Known issues, bugs, and refactors needed |

### v2 rebuild docs (current direction)

| Document | What it covers |
|----------|----------------|
| [../plan.md](../plan.md) | **Master rebuild plan** — v2 architecture, locked decisions, phases, standards |
| [../task.md](../task.md) | Living task tracker (per-phase checklists, decision log) |
| [../CLAUDE.md](../CLAUDE.md) | Agent context + golden rules for working in the repo |
| [MARKET_ANALYSIS.md](./MARKET_ANALYSIS.md) | EdTech/mentorship market analysis and positioning |
| [MATCHING_ALGORITHM.md](./MATCHING_ALGORITHM.md) | Mentor↔mentee matching (TF-IDF + cosine + hybrid) |
| [AI_AGENT.md](./AI_AGENT.md) | 24/7 AI mentor agent (Claude tool loop + token efficiency) |
| [../.claude/skills/](../.claude/skills/) | Repeatable build skills (stored proc, API module, AI tool, FE feature) |

> **Note:** docs above the divider describe the **v1** app (current code). The v2
> docs describe the **ground-up rebuild** we are now executing. v1 stays as a UI/
> behavior reference only.

## Quick facts

- **Stack:** Next.js 15 (App Router), React 18, TypeScript, MongoDB/Mongoose, Clerk, Stream Video SDK, Tailwind + shadcn/ui, Mantine, Zustand.
- **Auth:** Clerk, with a svix webhook syncing users into MongoDB.
- **Video:** Stream Video SDK (instant, scheduled, join-by-link, recordings).
- **Status:** MVP / work-in-progress. Core flows exist; several features are stubbed or partially wired.

> Last reviewed: 2026-06-04
