# API Reference

Backend logic is implemented as **Next.js route handlers** under `app/api/**`,
plus one **server action** and one **webhook**. Auth context is read from Clerk via
`auth()` / `sessionClaims.userId` (the MongoDB `_id` mirrored into Clerk metadata).

> ⚠️ Many handlers return `200` with `{ message }` even on "not found" / error
> cases, and not all handlers enforce auth. See [TECH_DEBT.md](./TECH_DEBT.md).

## Conventions
- Base path: `/api`
- Format: JSON
- Auth: Clerk session (where enforced); user id via `sessionClaims.userId`

---

## Users

### `POST /api/users/mentor`
Create a mentor profile for the current user.
- **Body:** mentor fields (expertise, career_preferences, availability, …)
- **Returns:** `{ message, user }`
- Source: `app/api/users/mentor/route.ts`

### `GET /api/users/mentor`
List all mentors (with populated `userId`).
- **Returns:** `Mentor[]` or `{ message }`

### `GET|PATCH|DELETE /api/users/mentor/[mentorId]`
Operate on a single mentor.
- Source: `app/api/users/mentor/[mentorId]/route.ts`

### `POST /api/users/mentee`
Create a mentee profile for the current user.
- Source: `app/api/users/mentee/route.ts`

### `GET /api/users/mentee`
List all mentees.

### `GET|PATCH|DELETE /api/users/mentee/[menteeId]`
Operate on a single mentee.

### `GET /api/users/[userId]`
Fetch a user by id. · Source: `app/api/users/[userId]/route.ts`

### `GET /api/users/me/[Id]`
Fetch the current user. · Source: `app/api/users/me/[Id]/route.ts`

### `GET /api/users/recommendations`
Return recommended counterparts for the current user.
- If caller is a **mentee** → mentors whose `career_preferences` match the
  mentee's `career_path`.
- If caller is a **mentor** → mentees whose `career_path` matches the mentor's
  `career_preferences`.
- **Returns:** `{ message, recommendations? }`
- Source: `app/api/users/recommendations/route.ts`
- ⚠️ Naive equality matching; `if(!recommendedMentors)` never catches an empty array.

---

## Explore (Q&A)

### `POST /api/explore/post`
Create a post. **Body:** `{ title, content, ultimateSuggestion }` → `{ message, newPost }`

### `GET /api/explore/post`
List all posts (populates comments).

### `PATCH /api/explore/post`
Update a post. **Body:** `{ postId, title?, content?, ultimateSuggestion? }`

### `DELETE /api/explore/post`
Delete a post. **Body:** `{ postId }`
- ⚠️ Uses deprecated `post.remove()` (removed in Mongoose 7+) — use `deleteOne()`.
- Source: `app/api/explore/post/route.ts`

### `*/api/explore/post/comment`
Comment operations on a post. · Source: `app/api/explore/post/comment/route.ts`

---

## Webhooks

### `POST /api/webhooks/clerk`
Receives Clerk events, verified with svix using `WEBHOOK_SECRET`.
- `user.created` → `createUser()` inserts a Mongo `User`, then writes
  `publicMetadata.userId` back to Clerk.
- `user.updated` → handler stub (commented out).
- Source: `app/api/webhooks/clerk/route.ts`

---

## Server actions

### `tokenProvider()` — `actions/stream.actions.ts`
`'use server'`. Mints a Stream user token for the current Clerk user
(`currentUser().id`), valid 1 hour. Requires `NEXT_PUBLIC_STREAM_API_KEY` and
`STREAM_SECRET_KEY`. Consumed by `providers/StreamClientProvider.tsx`.

---

## Real-time (intended, not in repo)

### Socket.io chat — `localhost:3001`
Client hook `components/chat/useChat.ts` expects a Socket.io server emitting/
receiving `sendMessage` / `receiveMessage`. The server is **not implemented**.
Recommended: stand up a dedicated socket service or migrate to Stream Chat.

---

## Suggested API improvements
- Return proper HTTP status codes (401/404/500) instead of `200 + message`.
- Enforce auth consistently on all mutating routes.
- Validate request bodies with `zod` at the route boundary.
- Add pagination to list endpoints (mentors, mentees, posts).
- Replace deprecated Mongoose calls (`remove()` → `deleteOne()`).
