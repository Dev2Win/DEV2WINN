import { callProc } from '../../db/pool.js';

/**
 * Thin data-access layer. Every method maps 1:1 to a stored procedure.
 * No business logic and no ad-hoc SQL here — that lives in the procedures.
 *
 * @typedef {Object} UserRow
 * @property {string} id
 * @property {string} email
 * @property {string|null} first_name
 * @property {string|null} last_name
 * @property {'mentee'|'mentor'|'admin'} role
 * @property {string} created_at
 */

export const usersRepository = {
  /** @returns {Promise<UserRow[]>} */
  create({ email, firstName, lastName, role }) {
    return callProc('sp_user_create', [email, firstName, lastName, role]);
  },

  /** @returns {Promise<UserRow[]>} */
  getById(id) {
    return callProc('sp_user_get_by_id', [id]);
  },

  getByEmail(email) {
    return callProc('sp_user_get_by_email', [email]);
  },

  /** @returns {Promise<UserRow[]>} */
  updateProfile({ id, firstName, lastName, role }) {
    return callProc('sp_user_update_profile', [id, firstName, lastName, role]);
  },

  updateAvatar({ id, avatarUrl, avatarPublicId }) {
    return callProc('sp_user_update_avatar', [id, avatarUrl, avatarPublicId]);
  },

  getMentorProfileByUserId(userId) {
    return callProc('sp_mentor_profile_get_by_user_id', [userId]);
  },

  deleteMentorProfileByUserId(userId) {
    return callProc('sp_mentor_profile_delete_by_user_id', [userId]);
  },

  listMentorProfiles({ limit, cursorUpdatedAt, cursorId, search, language, tag }) {
    return callProc('sp_mentor_profile_list', [
      limit,
      cursorUpdatedAt,
      cursorId,
      search,
      language,
      tag,
    ]);
  },

  upsertMentorProfile({
    userId,
    title,
    bio,
    experienceLevel,
    industries,
    cvUrl,
    expertise,
    careerPreferences,
    languages,
    availability,
  }) {
    return callProc('sp_mentor_profile_upsert', [
      userId,
      title,
      bio,
      experienceLevel,
      JSON.stringify(industries ?? []),
      cvUrl,
      JSON.stringify(expertise ?? []),
      JSON.stringify(careerPreferences ?? []),
      JSON.stringify(languages ?? []),
      JSON.stringify(availability ?? []),
    ]);
  },

  getMenteeProfileByUserId(userId) {
    return callProc('sp_mentee_profile_get_by_user_id', [userId]);
  },

  deleteMenteeProfileByUserId(userId) {
    return callProc('sp_mentee_profile_delete_by_user_id', [userId]);
  },

  listMenteeProfiles({ limit, cursorUpdatedAt, cursorId, search, language, tag }) {
    return callProc('sp_mentee_profile_list', [
      limit,
      cursorUpdatedAt,
      cursorId,
      search,
      language,
      tag,
    ]);
  },

  upsertMenteeProfile({
    userId,
    careerPath,
    goals,
    experienceLevel,
    industryPreferences,
    educationStatus,
    desiredSkills,
    languages,
    availability,
  }) {
    return callProc('sp_mentee_profile_upsert', [
      userId,
      careerPath,
      goals,
      experienceLevel,
      JSON.stringify(industryPreferences ?? []),
      educationStatus,
      JSON.stringify(desiredSkills ?? []),
      JSON.stringify(languages ?? []),
      JSON.stringify(availability ?? []),
    ]);
  },
};
