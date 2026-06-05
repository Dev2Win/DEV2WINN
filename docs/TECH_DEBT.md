# Technical Debt & Known Issues

A candid list of bugs, stubs, and refactors found during the codebase review.
Grouped by severity. Each item notes the location and a suggested fix.

## 🔴 High — breaks functionality or production

1. **Broken dashboard fetch.** `app/(root)/dashboard/page.tsx` fetches
   `https://localhost:3000/api/users/mentor/api/` (wrong protocol, wrong path,
   absolute localhost URL). The "top mentor matches" then render from a hardcoded
   `mentorsdata` array instead. → Use a relative path to the real recommendations
   API and render the response.

2. **Chat is non-functional.** `components/chat/useChat.ts` targets
   `http://localhost:3001` with a comment "not in use atm"; no socket server
   exists in the repo. → Build a Socket.io service or migrate to Stream Chat.

3. **Role selection not persisted.** `app/user-type/page.tsx` toggles UI state but
   the "Continue" button does nothing — the mentor/mentee choice is never saved.
   → Persist a `role` on the user and route into the correct onboarding.

4. **Deprecated Mongoose `remove()`.** `app/api/explore/post/route.ts` `DELETE`
   calls `post.remove()`, removed in Mongoose 7+ (repo uses ^8). → `deleteOne()`.

5. **`conversationModel.ts` model recompilation.** Uses `model('Message', …)`
   without the `models.Message || …` guard → `OverwriteModelError` on hot reload
   / repeated import in serverless.

## 🟠 Medium — correctness, security, consistency

6. **APIs return `200` on errors/not-found.** Most handlers return
   `NextResponse.json({ message })` with a default `200`. → Use proper status
   codes (401/404/500).

7. **Inconsistent / missing auth on routes.** `GET /api/users/mentor` has its auth
   commented out; mutating routes don't all verify the caller. → Enforce Clerk
   auth consistently; validate ownership.

8. **Recommendation logic bug.** `if(!recommendedMentors)` never triggers on an
   empty result (an empty array is truthy), so "no match" branch is dead for
   mentees. Matching is also naive single-field equality. → Check `.length` and
   improve matching.

9. **No request validation.** Route bodies are destructured without `zod`
   validation despite `zod` being a dependency. → Validate at the boundary.

10. **Hardcoded db name.** `lib/db.ts` pins `dbName: "testing-mentee"`. → Env var.

11. **Schema inconsistencies.** `Mentor.userId` required but `Mentee.userId` not;
    `User` fields mostly optional incl. names/email. → Tighten required fields and
    add a `role` discriminator.

12. **Mock data in production paths.** Dashboard performance value is a fixed
    `8.966`; mentor list, chat contacts, and reviews use placeholder data.

## 🟡 Low — maintainability & polish

13. **Two UI systems.** shadcn/ui (Radix) + Mantine coexist → larger bundle and
    styling drift. → Standardize on one.

14. **`any` types throughout** (API handlers, chat hook, forms). → Add types.

15. **Leftover console.logs** in API routes (`mentor`, `recommendations`).

16. **Typos / naming.** `components/notication/` (should be `notification`),
    `SheduleList.tsx` (should be `ScheduleList`), `sigin-in` route segment,
    `gallImage` assets.

17. **Stray files.** `components/tt.txt`, duplicated `postcss.config.cjs` and
    `postcss.config.js`, and an upstream `zoom-clone` description in `package.json`.

18. **README is a single word** ("Dev2win"). → Point to `docs/`.

19. **Unused/legacy deps** present (`express`, `cors`, `bcrypt`, `jsonwebtoken`,
    `multiparty`, `multer`) — confirm whether the planned socket/upload server
    needs them or remove.

## Suggested cleanup order
1. Fix the high-severity items (1–5) to make core flows work.
2. Add auth + zod validation + proper status codes across `app/api` (6–9).
3. Make config env-driven and tighten schemas (10–11).
4. Replace mock data with real queries (12).
5. Address maintainability/polish (13–19) opportunistically.
