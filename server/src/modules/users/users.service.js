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

  async updateProfile({ id, firstName, lastName, role }) {
    const existing = await this.getById(id);
    validateRoleTransition({ previousRole: existing.role, nextRole: role });
    const [user] = await usersRepository.updateProfile({ id, firstName, lastName, role });
    if (!user) throw Errors.internal('User profile was not updated');
    if (existing.role !== role) {
      await cleanupRoleTransition({ userId: id, previousRole: existing.role });
    }
    return user;
  },

  async updateAvatar({ id, avatarUrl, avatarPublicId }) {
    const [user] = await usersRepository.updateAvatar({ id, avatarUrl, avatarPublicId });
    if (!user) throw Errors.internal('User avatar was not updated');
    return user;
  },

  async getRoleProfile({ userId, role }) {
    if (role === 'mentor') {
      const [profile] = await usersRepository.getMentorProfileByUserId(userId);
      return profile ? normalizeMentorProfile(profile) : null;
    }

    const [profile] = await usersRepository.getMenteeProfileByUserId(userId);
    return profile ? normalizeMenteeProfile(profile) : null;
  },

  async upsertRoleProfile({ userId, role, payload }) {
    if (role === 'mentor') {
      const [profile] = await usersRepository.upsertMentorProfile({ userId, ...payload });
      if (!profile) throw Errors.internal('Mentor profile was not updated');
      return normalizeMentorProfile(profile);
    }

    const [profile] = await usersRepository.upsertMenteeProfile({ userId, ...payload });
    if (!profile) throw Errors.internal('Mentee profile was not updated');
    return normalizeMenteeProfile(profile);
  },

  async getPublicProfile(userId) {
    const user = await this.getById(userId);
    const profile = user.role === 'admin' ? null : await this.getRoleProfile({ userId, role: user.role });
    return { user, profile };
  },

  async listMentorProfiles(query) {
    const { cursorUpdatedAt, cursorId } = parseCursor(query.cursor);
    const rows = await usersRepository.listMentorProfiles({
      limit: query.limit + 1,
      cursorUpdatedAt,
      cursorId,
      search: query.search,
      language: query.language,
      tag: query.tag,
    });
    return paginate(rows.map(normalizeMentorDirectoryEntry), query.limit, readUpdatedAt);
  },

  async listMenteeProfiles(query) {
    const { cursorUpdatedAt, cursorId } = parseCursor(query.cursor);
    const rows = await usersRepository.listMenteeProfiles({
      limit: query.limit + 1,
      cursorUpdatedAt,
      cursorId,
      search: query.search,
      language: query.language,
      tag: query.tag,
    });
    return paginate(rows.map(normalizeMenteeDirectoryEntry), query.limit, readUpdatedAt);
  },
};

function normalizeMentorProfile(profile) {
  return {
    ...profile,
    industries: parseJsonArray(profile.industries),
    expertise: parseJsonArray(profile.expertise),
    career_preferences: parseJsonArray(profile.career_preferences),
    languages: parseJsonArray(profile.languages),
    availability: parseJsonArray(profile.availability),
  };
}

function normalizeMenteeProfile(profile) {
  return {
    ...profile,
    industry_preferences: parseJsonArray(profile.industry_preferences),
    desired_skills: parseJsonArray(profile.desired_skills),
    languages: parseJsonArray(profile.languages),
    availability: parseJsonArray(profile.availability),
  };
}

function normalizeMentorDirectoryEntry(profile) {
  return {
    ...normalizeMentorProfile(profile),
    name: buildName(profile.first_name, profile.last_name, profile.email),
  };
}

function normalizeMenteeDirectoryEntry(profile) {
  return {
    ...normalizeMenteeProfile(profile),
    name: buildName(profile.first_name, profile.last_name, profile.email),
  };
}

function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildName(firstName, lastName, email) {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
  return fullName || email;
}

function paginate(items, limit, getCursorValue) {
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  const last = data.at(-1);
  return {
    items: data,
    pageInfo: {
      hasMore,
      nextCursor: hasMore && last ? getCursorValue(last) : null,
    },
  };
}

function readUpdatedAt(item) {
  return encodeCursor(item.updated_at, item.id);
}

function encodeCursor(updatedAt, id) {
  return Buffer.from(JSON.stringify({ updatedAt, id })).toString('base64url');
}

function parseCursor(cursor) {
  if (!cursor) return { cursorUpdatedAt: null, cursorId: null };
  try {
    const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    return {
      cursorUpdatedAt: parsed.updatedAt ?? null,
      cursorId: parsed.id ?? null,
    };
  } catch {
    throw Errors.validation('Invalid pagination cursor');
  }
}

function validateRoleTransition({ previousRole, nextRole }) {
  if (nextRole === 'admin') {
    throw Errors.forbidden('Admin role cannot be self-assigned');
  }
  if (previousRole === 'admin') {
    throw Errors.forbidden('Admin role cannot be changed from this endpoint');
  }
}

async function cleanupRoleTransition({ userId, previousRole }) {
  if (previousRole === 'mentor') {
    await usersRepository.deleteMentorProfileByUserId(userId);
  }
  if (previousRole === 'mentee') {
    await usersRepository.deleteMenteeProfileByUserId(userId);
  }
}
