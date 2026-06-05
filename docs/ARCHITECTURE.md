# Architecture

> Last reviewed 2026-06-04

## 1. Overview

Dev2Win is a **Next.js 15 (App Router)** monolith that serves both the marketing
site and the authenticated application. It uses **server actions** and **route
handlers** for backend logic, **MongoDB/Mongoose** for persistence, **Clerk** for
identity, and **Stream** for real-time video. Real-time chat is intended to run on
a separate **Socket.io** server (currently a stub).

```
                    ┌─────────────────────────────────────────────┐
                    │                  Browser                     │
                    │  Marketing pages · Dashboard · Meeting · Chat │
                    └───────────────┬───────────────┬─────────────┘
                                    │               │
                        HTTPS (App) │               │ WebRTC / WS
                                    ▼               ▼
        ┌───────────────────────────────────┐   ┌──────────────────┐
        │        Next.js 15 (App Router)     │   │   Stream Video    │
        │  ┌─────────────┐  ┌─────────────┐  │   │   (SaaS / SFU)    │
        │  │ Server Comp.│  │ Route Hand. │  │   └──────────────────┘
        │  │  + Actions  │  │  /app/api   │  │
        │  └──────┬──────┘  └──────┬──────┘  │   ┌──────────────────┐
        │         │                │         │   │  Socket.io server │
        │  ┌──────▼────────────────▼──────┐  │   │  (chat, :3001)    │
        │  │      Clerk middleware        │  │   │  ⚠ not wired      │
        │  └──────────────┬───────────────┘  │   └──────────────────┘
        └─────────────────┼──────────────────┘
                          │ Mongoose
                          ▼
                 ┌──────────────────┐        ┌──────────────────┐
                 │   MongoDB Atlas  │        │      Clerk       │
                 │ (db: testing-... )│◄──────│  webhook (svix)  │
                 └──────────────────┘        └──────────────────┘
```

## 2. Tech stack

### Framework & language
- **Next.js ^15** (App Router, route groups, server actions, route handlers)
- **React 18**, **TypeScript 5**

### Auth
- **@clerk/nextjs ^5** — sign-in/up, session, middleware route protection
- **svix** — verifies Clerk webhooks
- **jsonwebtoken**, **bcrypt** — present in deps (legacy/auxiliary auth utilities)

### Data
- **MongoDB** via **mongoose ^8** (cached connection helper in `lib/db.ts`)

### Real-time / video
- **@stream-io/video-react-sdk** + **@stream-io/node-sdk** — video calls & recordings
- **socket.io / socket.io-client** — chat transport (stubbed)

### UI
- **Tailwind CSS** + **tailwind-merge**, **tailwindcss-animate**
- **shadcn/ui** primitives over **Radix UI** (`components/ui/*`)
- **@mantine/core / charts / hooks / notifications** — charts & some widgets
- **lucide-react**, **react-icons** — icons
- **recharts** — charts (e.g., speedometer/bar charts)
- **react-datepicker** — meeting scheduling

### State & forms
- **zustand** — client state (`lib/store.ts`)
- **react-hook-form** + **@hookform/resolvers** + **zod** — forms & validation

### Misc
- **axios** — HTTP client; **date-fns / moment** — dates; **uuid** — ids;
  **express / cors / multiparty / multer** — present (file upload / chat server helpers)

## 3. Folder structure

```
app/
  (auth)/                 # Clerk sign-in / sign-up (route group, no shared layout)
    sign-in/ , sign-up/
  (root)/                 # Authenticated app shell
    layout.tsx            # StreamVideoProvider wrapper, etc.
    dashboard/
      layout.tsx          # Sidebar + Navbar shell
      page.tsx            # LMS home (courses, mentor matches, performance)
      (course)/[courseId]/[courseDetail]/   # Course roadmap & submodule detail
      chat/               # Messaging UI
      explore/[postId]/   # Q&A forum
      meet/               # Meeting type list (instant/schedule/join)
      mentors/            # Mentor/mentee directory
      personal-room/      # Personal Stream room
      previous/ upcoming/ recordings/       # Meeting history
      resources/ profile/
    meeting/[id]/         # Active call room
  about/ contact/         # Marketing subpages
  user-type/              # Mentor vs mentee selection
  profile/                # Profile builder (mentor/mentee)
  api/                    # Route handlers (REST + webhook) — see API.md
  layout.tsx  page.tsx    # Root layout + marketing landing page

actions/        # Server actions (stream.actions.ts — Stream token provider)
components/      # Feature-grouped React components (chat, explore, lms, meeting,
                #   profile, userProfile, users, shared, reusables, ui)
constants/      # Sidebar config, avatar lists
hooks/          # useGetCalls, useGetCallById (Stream)
lib/            # db.ts, connect.ts, store.ts, uploadFile.ts, lmscontent.ts, utils.ts, data.tsx
models/         # Mongoose schemas (User, Mentor, Mentee, Post, Comment, conversationModel)
providers/      # StreamClientProvider
middleware.ts   # Clerk route protection
software-engineering.json  # Large static course/skills dataset
```

## 4. Key flows

### 4.1 User signup → DB sync
1. User signs up via Clerk hosted UI (`app/(auth)/sign-up`).
2. Clerk fires a `user.created` webhook to `app/api/webhooks/clerk/route.ts`.
3. svix verifies the signature; `createUser()` (`lib/connect.ts`) inserts a `User`.
4. The new Mongo `_id` is written back into Clerk **publicMetadata.userId**, so it
   is available on every request via `sessionClaims.userId`.

### 4.2 Role + onboarding
1. After signup the user picks mentor/mentee at `app/user-type`.
2. Onboarding forms (`components/profile/Step*`) collect role-specific data.
3. `POST /api/users/mentor` or `POST /api/users/mentee` creates the role document,
   linked to `User._id` via `sessionClaims.userId`.

### 4.3 Recommendations
- `GET /api/users/recommendations` reads the caller's role doc and matches the
  opposite role by `career_path` / `career_preferences` (naive equality match).

### 4.4 Video meeting
1. `(root)/layout` mounts `StreamClientProvider`, which calls the
   `tokenProvider` **server action** (`actions/stream.actions.ts`) to mint a
   Stream user token from the Clerk `user.id`.
2. `MeetingTypeList` creates/join calls via the Stream client.
3. `meeting/[id]/page.tsx` renders the call room; `hooks/useGetCalls` &
   `useGetCallById` query calls and recordings.

### 4.5 Chat (intended)
- `components/chat/useChat.ts` connects to a Socket.io server at
  `http://localhost:3001` and exchanges `sendMessage` / `receiveMessage` events.
  The server is not part of this repo yet → chat is non-functional. Conversations
  are modeled in `models/conversationModel.ts` for future persistence.

## 5. Auth & route protection

`middleware.ts` uses Clerk's `clerkMiddleware` + `createRouteMatcher` to protect:
`/dashboard`, `/upcoming`, `/meeting(.*)`, `/previous`, `/recordings`,
`/personal-room`. The matcher excludes static assets and `_next`.

> Note: several dashboard sub-routes (e.g. `/dashboard/chat`, `/dashboard/explore`)
> are nested under `/dashboard` and inherit protection, but API routes are **not**
> all individually guarded — see [TECH_DEBT.md](./TECH_DEBT.md).

## 6. Data layer

- `lib/db.ts` caches a single Mongoose connection on `global` (serverless-safe),
  targeting db name **`testing-mentee`** (placeholder — should be env-driven).
- Models use the `models.X || model('X', schema)` guard to avoid recompilation in
  dev hot-reload. See [DATA_MODEL.md](./DATA_MODEL.md).

## 7. Configuration / environment

Secrets live in `.env.local`. Key variables (see [SETUP.md](./SETUP.md)):
`MONGODB_URL`, `WEBHOOK_SECRET`, `NEXT_PUBLIC_STREAM_API_KEY`,
`STREAM_SECRET_KEY`, `NEXT_PUBLIC_BASE_URL`, plus Clerk publishable/secret keys.

## 8. Architectural risks
- **Mixed UI systems** (shadcn + Mantine) increase bundle size and styling drift.
- **Chat** depends on an external Socket.io server that doesn't exist in-repo.
- **Static course content** in TS/JSON is not authorable or per-user trackable.
- **Hardcoded URLs** (`https://localhost:3000`, `localhost:3001`) break in prod.
- **Naive recommendations** won't scale to real matching needs.

See [TECH_DEBT.md](./TECH_DEBT.md) for the full list.
