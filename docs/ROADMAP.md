# Roadmap & Market Analysis

> Last reviewed 2026-06-04

This document looks at where Dev2Win sits in the market, the features competitors
ship, and a phased plan to evolve from MVP to a competitive product.

## 1. Market landscape

| Competitor | Category | What they do well |
|------------|----------|-------------------|
| **ADPList** | Mentorship marketplace | Free mentorship, easy booking, huge mentor supply, reviews |
| **MentorCruise** | Paid mentorship | Subscriptions, structured plans, accountability, payments |
| **Coursera / Udemy** | LMS | Structured courses, certificates, progress tracking |
| **Stack Overflow / Discord** | Community Q&A | Reputation, tagging, search, real-time community |
| **Calendly + Zoom** | Scheduling + video | Frictionless booking and calls |
| **Polywork / LinkedIn** | Professional profiles | Reputation, social proof, networking |

**Dev2Win's wedge:** combine mentorship + structured roadmaps + in-platform
video/chat/Q&A specifically for the **tech-career** journey, so users don't
stitch together five separate tools.

## 2. Gaps vs. the market (what we're missing today)

1. **Payments & paid bookings** — no monetization path.
2. **Real scheduling/booking** — Stream covers the call, not availability/booking.
3. **Reviews & ratings (backed)** — trust signal exists only as UI.
4. **Working chat** — socket layer is stubbed.
5. **Notifications** (email + in-app + push) — no delivery backend.
6. **Search & filtering** for mentors/mentees/content.
7. **Progress tracking & certificates** in the LMS.
8. **AI features** — matching, career assistant, content recommendations.
9. **Calendar integration** (Google/Outlook).
10. **Admin/CMS** for content and mentor verification.

## 3. Proposed features (prioritized)

### Tier 1 — Make the core loop actually work (finish MVP)
- Persist **role selection** and complete **onboarding → DB** wiring.
- Replace hardcoded dashboard matches with the real recommendations API.
- Stand up **working chat** (dedicated Socket.io service *or* Stream Chat).
- Compute real **LMS progress** and store per-user enrollment/completion.
- Fix broken URLs / env-driven config.

### Tier 2 — Monetization & trust
- **Booking & availability** system (mentor sets slots, mentee books a session).
- **Payments** (Stripe) — per-session, packages, or subscriptions.
- **Reviews & ratings** backend tied to completed sessions.
- **Mentor verification** workflow + badges.
- **Notifications** — email (Resend/SendGrid) + in-app + optional push.

### Tier 3 — Differentiation
- **AI mentor matching** — embeddings over skills/goals instead of equality match.
- **AI career assistant** — chatbot for roadmap guidance, resume/CV review,
  interview prep (Claude API; include prompt caching).
- **Certificates & badges** on roadmap/module completion; gamification (streaks, XP).
- **Group mentorship / cohorts** — 1-to-many sessions, communities.
- **Smart content recommendations** based on goals and progress.
- **Resume/portfolio builder** from profile data.

### Tier 4 — Scale & reach
- **Search** (mentors, content, Q&A) with filters and full-text/vector search.
- **Analytics dashboards** for mentors (mentee progress) and admins.
- **Calendar integration** (Google/Outlook two-way sync).
- **Mobile apps** (React Native) or PWA.
- **Internationalization** and timezone-aware scheduling.
- **Admin CMS** for authoring courses and moderating the forum.

## 4. Phased delivery plan

| Phase | Theme | Headline deliverables |
|-------|-------|------------------------|
| **P0 (now)** | Stabilize MVP | Persist onboarding, real matches, working chat, real progress, config cleanup |
| **P1** | Trust & money | Booking, Stripe payments, reviews backend, notifications, mentor verification |
| **P2** | Intelligence | AI matching, AI career assistant, certificates/gamification, search |
| **P3** | Scale | Cohorts, analytics, calendar sync, admin CMS, mobile/PWA, i18n |

## 5. Technical enablers needed along the way
- Move course content from static files → database + authoring CMS.
- Introduce a **Booking/Session** and **Notification** data model.
- Add **zod validation** + consistent error handling across the API.
- Add **background jobs** (reminders, digests) — queue/cron.
- Add **observability** (logging, error tracking, analytics).
- Consolidate the UI system (shadcn vs Mantine) to reduce bundle size.

## 6. Success metrics to watch
See [PRD.md §8](./PRD.md). Track activation, time-to-match, first-session rate,
weekly active pairs, retention, and (post-payments) revenue per active mentee.
