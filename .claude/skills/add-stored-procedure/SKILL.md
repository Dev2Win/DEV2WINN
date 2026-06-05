---
name: add-stored-procedure
description: Use when adding or changing how data is read/written in Dev2Win. Creates a MySQL stored procedure (the only sanctioned data path), a forward-only migration, a thin repository binding, and an integration test. Trigger on "add a query", "persist X", "new table/field", "data access", or any DB change.
---

# Add a Stored Procedure (Dev2Win data layer)

Dev2Win's data layer is **stored-procedure-first**: business/data logic lives in
versioned MySQL procedures, and app code only calls them through a thin repository.
Never write ad-hoc SQL in services. See [plan.md §3.2](../../../plan.md).

## Steps

1. **Define the contract** in `server/src/contracts/<domain>.js` (zod) for
   inputs/outputs; the client mirrors it in `client/lib/api/`.

2. **Author the procedure** in `db/procedures/sp_<domain>_<action>.sql`:
   - Name `sp_<domain>_<action>` (e.g., `sp_user_create`, `sp_match_record_feedback`).
   - Validate inputs; wrap multi-step writes in a transaction.
   - Signal domain errors with `SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CODE:...'`
     so the app can map them to API error codes.
   - Return result sets the repository can map directly.

3. **Create a migration** in `db/migrations/<timestamp>_<name>.sql` that
   `DROP PROCEDURE IF EXISTS` + `CREATE PROCEDURE` (forward-only; never edit prod
   procedures by hand). Apply via the project's migration tool (dbmate/Flyway).

4. **Bind a repository method** (thin) in `server/src/modules/<domain>/`:
   `<domain>Repository.<action>(params)` → `callProc('sp_<domain>_<action>', [...])`
   via the mysql2 pool (`server/src/db/pool.js`). The global error handler maps
   `SIGNAL` errors → the API envelope. No logic here beyond marshaling.

5. **Write an integration test** (Testcontainers MySQL) that runs the migration and
   asserts happy-path + at least one error path (`SIGNAL`).

6. **Wire it up**: call the repo from the Express service (JS); update `client/lib/api` if exposed.

7. **Track it**: tick the task in [task.md](../../../task.md).

## Conventions
- Procedures: `sp_<domain>_<action>`; tables/columns `snake_case`.
- One procedure file = one procedure; migrations are timestamped + reviewed.
- Always: input validation, transactions for multi-write, explicit error signaling.
- Add indexes for any column used in `WHERE`/`JOIN` (e.g., `career_path`).

## Checklist
- [ ] Contract (zod) added/updated
- [ ] `db/procedures/sp_*.sql` authored (validates, transactional, SIGNALs)
- [ ] Migration created + applies cleanly
- [ ] Repository method added (thin) + error mapping
- [ ] Integration test (happy + error) green
- [ ] Service/SDK wired; task.md updated
