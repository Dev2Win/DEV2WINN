# Product Requirements Document (PRD) — Dev2Win

> Status: Living document · Last reviewed 2026-06-04 · Owner: Product

## 1. Summary

Dev2Win is a mentorship + learning platform for tech careers. It matches mentees
with mentors and provides structured learning roadmaps, live video sessions, chat,
and a community Q&A forum. This PRD captures the product goals, personas, scope,
and requirements for the current MVP and the next iterations.

## 2. Problem statement

Aspiring and junior developers face two compounding problems:

1. **Direction:** an overwhelming amount of free learning content with no clear,
   personalized path. They don't know what to learn or in what order.
2. **Guidance:** no access to experienced professionals who can review their work,
   unblock them, and advise on career decisions.

Mentors, meanwhile, lack a structured, low-friction way to find mentees, run
sessions, and build a credible public profile.

## 3. Goals & non-goals

### Goals
- Let a mentee go from sign-up → matched mentor → first booked session quickly.
- Give mentees a structured, trackable learning roadmap.
- Give mentors a profile, a mentee pipeline, and tools to run sessions.
- Keep communication (video + chat + Q&A) inside the platform.

### Non-goals (for now)
- Being a general-purpose LMS for all subjects (focus: software/tech careers).
- Replacing full HR/recruiting workflows.
- Native mobile apps (web-first; responsive).

## 4. Personas

### 4.1 Mentee — "Ama, the career switcher"
- 24, switching from a non-tech job into frontend development.
- Needs a roadmap, a mentor to check her progress, and answers to questions.
- Success = she lands an internship/junior role.

### 4.2 Mentor — "Kwesi, the senior engineer"
- 32, senior engineer who wants to give back and build a personal brand.
- Needs to find motivated mentees, schedule sessions easily, and track them.
- Success = a steady, manageable mentee pipeline and good reviews.

### 4.3 Visitor — "Unauthenticated prospect"
- Lands on the marketing site, evaluates the offering, signs up.

## 5. User stories

### Authentication & onboarding
- As a visitor, I can sign up and sign in (Clerk).
- As a new user, I can choose whether I am a **mentor** or **mentee**.
- As a mentee, I can complete onboarding capturing career path, desired skills,
  experience level, industry preference, availability, and education status.
- As a mentor, I can complete onboarding capturing expertise, industry/career
  preferences, experience level, availability, languages, title, and a CV.

### Matching & discovery
- As a mentee, I see recommended mentors based on my career path.
- As a mentor, I see recommended mentees based on my career preferences.
- As any user, I can browse a directory of mentors / mentees and open profiles.

### Learning (LMS)
- As a mentee, I can browse courses and open a course roadmap (modules → submodules).
- As a mentee, I can open a submodule and read its content/activity.
- As a mentee, I can see my performance/progress on the dashboard.

### Sessions (video)
- As a user, I can start an instant meeting.
- As a user, I can schedule a meeting for a future date/time with a description.
- As a user, I can join a meeting via an invitation link.
- As a user, I can view past meetings and recordings.
- As a user, I have a personal room for recurring calls.

### Communication
- As a user, I can chat 1:1 with my mentor/mentee in real time.
- As a user, I can post a question to the Explore forum and receive answers/comments.

### Profile & reputation
- As a user, I can build a rich profile (about, education, experience, social links).
- As a user, I can view another user's reviews and background.

## 6. Functional requirements (MVP scope)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-1 | Email/social auth via Clerk | ✅ Built |
| FR-2 | Sync authenticated users into MongoDB via webhook | ✅ Built |
| FR-3 | Role selection (mentor/mentee) | ⚠️ UI only — selection not persisted |
| FR-4 | Mentor onboarding form + persistence | ⚠️ API exists; form wiring partial |
| FR-5 | Mentee onboarding form + persistence | ⚠️ API exists; form wiring partial |
| FR-6 | Mentor & mentee directories | ✅ Built (API + UI) |
| FR-7 | Recommendation endpoint (career-path match) | ⚠️ Basic, naive matching |
| FR-8 | Course roadmap browsing | ✅ Built (static content) |
| FR-9 | Progress/performance display | ⚠️ Mock value, not computed |
| FR-10 | Instant/scheduled/join meetings (Stream) | ✅ Built |
| FR-11 | Recordings & previous meetings | ✅ Built (Stream) |
| FR-12 | 1:1 chat | ⚠️ Scaffolded; socket server not wired |
| FR-13 | Q&A forum posts + comments | ✅ API + UI built |
| FR-14 | Rich user profiles | ✅ UI built; persistence partial |
| FR-15 | Notifications | ⚠️ UI popup only; no backend |

Legend: ✅ Built · ⚠️ Partial/stubbed · ❌ Not started

## 7. Out of scope (current release)
- Payments / paid bookings.
- Reviews & ratings backend.
- Email / push notification delivery.
- Calendar (Google/Outlook) integration.
- AI-assisted matching or career chatbot.

These are tracked in [ROADMAP.md](./ROADMAP.md).

## 8. Success metrics

| Metric | Definition | Target (early) |
|--------|------------|----------------|
| Activation | % of sign-ups completing onboarding | ≥ 60% |
| Time-to-match | Median time from onboarding to viewing matches | < 5 min |
| First session | % of matched mentees booking a session in 7 days | ≥ 25% |
| Engagement | Weekly active mentee/mentor pairs | Trend up |
| Retention | 4-week mentee retention | ≥ 30% |
| Content | Avg submodules completed per mentee / week | ≥ 3 |

## 9. Assumptions & dependencies
- **Clerk** for identity; **Stream** for video; **MongoDB Atlas** for data.
- Course content is currently static (`lib/lmscontent.ts`, `software-engineering.json`);
  long-term it should be database-backed and authorable.
- Mentors are trusted/verified manually for the MVP.

## 10. Open questions
- How are mentors vetted/verified before appearing in matches?
- Is the platform free, freemium, or subscription? (drives payments scope)
- Who authors course content, and does it need a CMS/admin?
- How is "performance/progress" actually computed?
