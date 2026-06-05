import { usersRepository } from './users.repository.js';
import { Errors } from '../../lib/errors.js';

/** Business logic for users. Orchestrates the repository; no SQL here. */
export const usersService = {
  async create({ email, firstName, lastName, role }) {
    const [user] = await usersRepository.create({ email, firstName, lastName, role });
    if (!user) throw Errors.internal('User was not created');
    return user;
  },

  async getById(id) {
    const [user] = await usersRepository.getById(id);
    if (!user) throw Errors.notFound('User not found');
    return user;
  },
};
