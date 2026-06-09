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
| `sp_user_update_profile` | 0004 | Update the signed-in user's name and role |
| `sp_mentor_profile_upsert` | 0005 | Create/update the signed-in mentor profile |
| `sp_mentor_profile_get_by_user_id` | 0005 | Fetch a mentor profile by user id |
| `sp_mentor_profile_list` | 0006 | List mentor directory entries |
| `sp_mentee_profile_upsert` | 0005 | Create/update the signed-in mentee profile |
| `sp_mentee_profile_get_by_user_id` | 0005 | Fetch a mentee profile by user id |
| `sp_mentee_profile_list` | 0006 | List mentee directory entries |
| `sp_auth_register` | 0003 | Create a user plus password credential |
| `sp_auth_get_login_by_email` | 0003 | Fetch a login record by email |
