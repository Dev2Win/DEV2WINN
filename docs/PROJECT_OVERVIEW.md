# Project Overview

## 1. What is Dev2Win?

**Dev2Win** is a web-based career mentorship and learning platform aimed at the
software-development / tech career space. Its core premise: pair people who want
to grow a tech career (**mentees**) with experienced professionals (**mentors**),
and give both sides the tools they need to make the relationship productive —
structured learning content, live video sessions, chat, and a community Q&A board.

It blends three product categories that usually live in separate tools:

1. **Mentorship marketplace** (think ADPList, MentorCruise) — discovery, matching, profiles.
2. **Learning Management System** (think Coursera/Udemy roadmaps) — structured course modules.
3. **Communication suite** (think Zoom + Slack + Stack Overflow) — video calls, chat, Q&A.

## 2. Vision

> Help anyone "win" at a tech career by removing the two biggest blockers:
> not knowing *what* to learn (structured roadmaps) and not having *someone to learn
> from* (mentor matching + live guidance).

## 3. Target users

| Persona | Description | Primary jobs-to-be-done |
|---------|-------------|--------------------------|
| **Mentee** | Student, career-switcher, or junior dev | Find a mentor, follow a learning roadmap, book sessions, ask questions |
| **Mentor** | Mid/senior engineer or program manager | Discover mentees, share expertise, run sessions, build reputation |
| **Visitor** | Unauthenticated prospect | Understand the offering, sign up |

## 4. Value proposition

- **For mentees:** a guided path (roadmap + mentor) instead of scattered free content.
- **For mentors:** a structured way to find mentees, run sessions, and grow a profile/brand.
- **For both:** everything in one place — no juggling Calendly + Zoom + Slack + Notion.

## 5. Core capabilities (today)

- Marketing site (hero, "what we offer", features, contact, about).
- Clerk authentication (sign-in / sign-up) with role selection (mentor vs mentee).
- Multi-step onboarding to capture career preferences, expertise, availability, etc.
- Dashboard with course carousel, "top mentor matches", and a performance gauge.
- LMS course roadmaps (modules → submodules with articles/videos/activities).
- Mentor & mentee directories and rich profile pages.
- Career-path-based recommendation endpoint.
- 1:1 video meetings via Stream (instant, scheduled, join-by-link, recordings, personal room).
- Q&A "Explore" forum (posts, questions, answers, comments).
- Real-time chat scaffolding (Socket.io — partially wired).
- Resources page.

## 6. Current status

This is an **MVP / work-in-progress**. The happy-path UI for most features exists,
but several capabilities are stubbed, mock-data-driven, or not fully persisted to
the backend. See [TECH_DEBT.md](./TECH_DEBT.md) and [FEATURES.md](./FEATURES.md)
for the precise state of each feature.

## 7. Naming note

The repo, package name, and UI use **Dev2Win / dev2win** interchangeably (the folder
is `DEV2WINN`). The `package.json` description still references an upstream
`zoom-clone` tutorial, which is the origin of the Stream video integration.
