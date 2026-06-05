# Stored procedures

This folder is the **readable source of truth** for procedure logic. The applied
artifacts live in `db/migrations/*.sql` (a procedure change ships as a new,
forward-only migration that `DROP`s + `CREATE`s the procedure).

Naming: `sp_<domain>_<action>` (e.g., `sp_user_create`, `sp_match_record_feedback`).

Conventions (see [.claude/skills/add-stored-procedure](../../.claude/skills/add-stored-procedure/SKILL.md)):
- Validate inputs; wrap multi-write logic in a transaction.
- Signal domain errors: `SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='CODE:message'`
  — the API maps the `CODE:` prefix to an error code.
- Return result sets the repository maps directly.

## Current procedures
| Procedure | Migration | Purpose |
|-----------|-----------|---------|
| `sp_user_create` | 0001 | Create a user (signals `EMAIL_TAKEN`) |
| `sp_user_get_by_id` | 0001 | Fetch a user by id |
