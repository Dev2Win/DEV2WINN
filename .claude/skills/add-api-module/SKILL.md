---
name: add-api-module
description: Use when adding a new domain/feature to the Dev2Win Node API (server/). Scaffolds an Express module in JavaScript — router, service, repository (stored-proc calls), zod contracts, auth guards, and tests — following project conventions. Trigger on "new endpoint", "new resource", "add the X module/feature to the API".
---

# Add an API Module (Dev2Win — Express, JavaScript)

The `server/` is **Node.js + Express in plain JavaScript (ESM) — NOT TypeScript**.
Each domain is a self-contained module mounted as an Express Router in
`server/src/app.js`. See [plan.md §4](../../../plan.md) and [CLAUDE.md](../../../CLAUDE.md).

## Structure to create
```
server/src/modules/<domain>/
  <domain>.routes.js       # Express Router (/v1/<resource>), validate with zod
  <domain>.service.js      # business logic; orchestrates repo + worker queue
  <domain>.repository.js   # thin stored-procedure calls (callProc('sp_<domain>_*'))
  <domain>.guard.js        # auth/RBAC/ownership middleware (if needed)
  <domain>.test.js         # unit + integration (skips if no DB)
```
Shared request/response schemas go in `server/src/contracts/<domain>.js` (zod).

## Steps
1. **Contracts first** — define zod schemas in `server/src/contracts/<domain>.js`;
   the client mirrors them in `client/lib/api/`.
2. **Router** — `const <domain>Router = Router()`; routes under `/v1/<resource>`
   (plural), cursor pagination on lists. `safeParse` body/query and
   `throw Errors.validation(...)` on failure. (Express 5 forwards async throws to
   the error middleware automatically.)
3. **Service** — business logic only; enqueue async work to `server/src/worker/`
   when needed; **no SQL here**.
4. **Repository** — call stored procedures via `callProc` from `db/pool.js` (use the
   [add-stored-procedure skill](../add-stored-procedure/SKILL.md)). The error
   middleware maps `SIGNAL` (`CODE:message`) errors to the API envelope.
5. **Guards** — Express middleware for cookie-session auth + RBAC
   (`mentee|mentor|admin`) + resource ownership.
6. **Errors** — throw `AppError`/`Errors.*` from `server/src/lib/errors.js`; the
   envelope `{ error:{code,message,details,traceId} }` + status is applied centrally.
7. **Logging** — `pino-http` is mounted; use `req.log`.
8. **Mount** the router in `server/src/app.js` (`app.use(<domain>Router)`).
9. **Tests** — unit (service/guards) + integration (route→repo→MySQL; the existing
   pattern auto-skips when the DB is unreachable). Run `npm test`.
10. **Client** — extend `client/lib/api/` so the frontend calls it typed.
11. **Track** — update [task.md](../../../task.md).

## Conventions
- Plain JavaScript (ESM), `import`/`export` with `.js` extensions. No `.ts` files.
- Validate at the boundary (zod). Never trust input.
- Rate-limit sensitive routes; idempotency keys on unsafe mutations.
- Auth is custom cookie sessions — **no Clerk**.

## Checklist
- [ ] Contracts in server/src/contracts/<domain>.js
- [ ] Router (validated, versioned, paginated) + guard middleware
- [ ] Service (no SQL) + worker enqueue if needed
- [ ] Repository → stored procedures (callProc)
- [ ] AppError envelope + status codes + req.log
- [ ] Router mounted in app.js
- [ ] Unit + integration tests green (npm test)
- [ ] client/lib/api updated; task.md updated
