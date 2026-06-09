import { Router } from 'express';
import { z } from 'zod';
import { usersService } from './users.service.js';
import { requireAuth, requireCsrf } from '../../lib/auth.js';
import { Errors } from '../../lib/errors.js';
import {
  AvatarBody,
  CreateUserBody,
  DirectoryQuery,
  MenteeProfileBody,
  MentorProfileBody,
  UpdateProfileBody,
} from '../../contracts/users.js';
import { getCloudinaryUploadConfig } from '../../lib/cloudinary.js';

export const usersRouter = Router();

// POST /v1/users
usersRouter.post('/v1/users', async (req, res) => {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    throw Errors.validation('Invalid user payload', parsed.error.flatten());
  }
  const user = await usersService.create(parsed.data);
  res.status(201).json({ user });
});

usersRouter.get('/v1/users/me', requireAuth, async (req, res) => {
  res.json({ user: req.auth.user });
});

usersRouter.patch('/v1/users/me', requireAuth, requireCsrf, async (req, res) => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    throw Errors.validation('Invalid profile update payload', parsed.error.flatten());
  }

  const user = await usersService.updateProfile({
    id: req.auth.user.id,
    ...parsed.data,
  });
  req.auth.user = user;
  res.json({ user });
});

usersRouter.put('/v1/users/me/avatar', requireAuth, requireCsrf, async (req, res) => {
  const parsed = AvatarBody.safeParse(req.body);
  if (!parsed.success) {
    throw Errors.validation('Invalid avatar payload', parsed.error.flatten());
  }
  const user = await usersService.updateAvatar({
    id: req.auth.user.id,
    ...parsed.data,
  });
  req.auth.user = user;
  res.json({ user });
});

usersRouter.get('/v1/users/me/role-profile', requireAuth, async (req, res) => {
  if (req.auth.user.role === 'admin') {
    return res.json({ profile: null });
  }

  const profile = await usersService.getRoleProfile({
    userId: req.auth.user.id,
    role: req.auth.user.role,
  });
  res.json({ profile });
});

usersRouter.get('/v1/users/me/profile', requireAuth, async (req, res) => {
  const result = await usersService.getPublicProfile(req.auth.user.id);
  res.json(result);
});

usersRouter.put('/v1/users/me/role-profile', requireAuth, requireCsrf, async (req, res) => {
  if (req.auth.user.role === 'admin') {
    throw Errors.validation('Admins do not have mentor or mentee onboarding profiles');
  }

  const schema = req.auth.user.role === 'mentor' ? MentorProfileBody : MenteeProfileBody;
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw Errors.validation('Invalid role profile payload', parsed.error.flatten());
  }

  const profile = await usersService.upsertRoleProfile({
    userId: req.auth.user.id,
    role: req.auth.user.role,
    payload: parsed.data,
  });
  res.json({ profile });
});

usersRouter.get('/v1/users/upload-signature', requireAuth, async (_req, res) => {
  res.json({ upload: getCloudinaryUploadConfig() });
});

usersRouter.get('/v1/users/mentors', async (req, res) => {
  const query = DirectoryQuery.parse(req.query);
  const mentors = await usersService.listMentorProfiles(query);
  res.json({ mentors: mentors.items, pageInfo: mentors.pageInfo });
});

usersRouter.get('/v1/users/mentees', async (req, res) => {
  const query = DirectoryQuery.parse(req.query);
  const mentees = await usersService.listMenteeProfiles(query);
  res.json({ mentees: mentees.items, pageInfo: mentees.pageInfo });
});

usersRouter.get('/v1/users/:id/profile', async (req, res) => {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  const profile = await usersService.getPublicProfile(id);
  res.json(profile);
});

// GET /v1/users/:id
usersRouter.get('/v1/users/:id', async (req, res) => {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  const user = await usersService.getById(id);
  res.json({ user });
});
