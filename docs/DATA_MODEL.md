# Data Model

MongoDB via Mongoose. Connection is cached in `lib/db.ts` against db name
**`testing-mentee`**. All models use the `models.X || model('X', schema)` guard.

> ⚠️ `MentorSchema.userId` is `required`, but `MenteeSchema.userId` is not, and
> the `User` schema makes most fields optional. These inconsistencies are noted
> in [TECH_DEBT.md](./TECH_DEBT.md).

## Entity relationship overview

```
        ┌──────────┐
        │   User   │  (synced from Clerk)
        └────┬─────┘
             │ 1
      ┌──────┴───────┐
      │ 1            │ 1
 ┌────▼────┐    ┌────▼────┐
 │ Mentor  │    │ Mentee  │
 └────┬────┘    └─────────┘
      │ * connections → User

 ┌──────────┐ 1   * ┌──────────┐
 │   Post   ├───────►│ Comment │
 └──────────┘        └──────────┘

 ┌──────────────┐ *   * ┌──────────┐
 │ Conversation ├───────►│ Message │
 │ sender/recv → User    │ msgBy → User
 └──────────────┘        └──────────┘
```

## Models

### User — `models/User.ts`
Synced from Clerk on `user.created`. The Mongo `_id` is mirrored into Clerk
`publicMetadata.userId`.

| Field | Type | Notes |
|-------|------|-------|
| firstName | String | optional |
| lastName | String | optional |
| image | String | optional |
| userName | String | optional |
| email | String | optional, **unique** |
| date | Date | default now |

### Mentor — `models/Mentor.ts`

| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId → User | **required** |
| career_preferences | [String] | careers they mentor for |
| industry_pref | [String] | |
| expertise | [String] | |
| education | [String] | |
| experience_level | String | |
| work_experience | [String] | |
| availability | [String] | weekdays/weekends/etc. |
| connections | [ObjectId → User] | linked mentees |
| title | String | e.g. "Senior PM at Upstart" |
| gender | String | |
| country | String | |
| languages | [String] | |
| description | String | |
| cv | String | uploaded CV reference |
| date | Date | default now |

### Mentee — `models/Mentee.ts`

| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId → User | (not required — should be) |
| career_path | String | drives matching |
| desired_skills | [String] | |
| experience_level | String | novice / experienced / professional |
| industry_pref | [String] | health, agriculture, law, … |
| availability | [String] | weekdays / weekends / everyday |
| education_status | String | high school / degree / masters / phd |

### Post — `models/Post.ts` (Explore / Q&A)

| Field | Type | Notes |
|-------|------|-------|
| title | String | **required** |
| content | String | **required** |
| ultimateSuggestion | String | **required** (accepted answer) |
| comments | [ObjectId → Comment] | |
| createdAt | Date | default now |

### Comment — `models/Comment.ts`
Referenced by `Post.comments`. (See file for fields — author/user + body.)

### Conversation & Message — `models/conversationModel.ts`

**Message**

| Field | Type | Notes |
|-------|------|-------|
| text | String | default "" |
| imageUrl | String | default "" |
| videoUrl | String | default "" |
| seen | Boolean | default false |
| msgByUserId | ObjectId → User | **required** |
| timestamps | — | createdAt/updatedAt |

**Conversation**

| Field | Type | Notes |
|-------|------|-------|
| sender | ObjectId → User | **required** |
| receiver | ObjectId → User | **required** |
| messages | [ObjectId → Message] | |
| timestamps | — | createdAt/updatedAt |

> ⚠️ `conversationModel.ts` uses `model(...)` (not the `models.X ||` guard), which
> can throw `OverwriteModelError` on hot reload.

## Notes & recommendations
- Add a `role` field on `User` (or a discriminator) so role selection persists
  without inferring from the existence of a Mentor/Mentee doc.
- Add `progress` / `enrollment` collections to track LMS completion per user.
- Add `Review`, `Booking/Session`, and `Notification` collections for roadmap items.
- Make `dbName` environment-driven instead of the hardcoded `testing-mentee`.
- Index `career_path` / `career_preferences` for matching queries.
