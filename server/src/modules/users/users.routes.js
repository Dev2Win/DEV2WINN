import { Router } from 'express';
import { z } from 'zod';
import { usersService } from './users.service.js';
import { Errors } from '../../lib/errors.js';
import { CreateUserBody } from '../../contracts/users.js';

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

// GET /v1/users/:id
usersRouter.get('/v1/users/:id', async (req, res) => {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  const user = await usersService.getById(id);
  res.json({ user });
});
