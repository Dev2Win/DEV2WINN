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
};
