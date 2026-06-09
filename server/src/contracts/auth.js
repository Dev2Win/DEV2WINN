import { z } from 'zod';
import { PublicRole, UserDto } from './users.js';

export const RegisterBody = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(100).nullable().default(null),
  lastName: z.string().min(1).max(100).nullable().default(null),
  role: PublicRole.default('mentee'),
});

export const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

export const SessionDto = z.object({
  user: UserDto,
});

export const PasswordResetRequestBody = z.object({
  email: z.string().email(),
});

export const PasswordResetConfirmBody = z.object({
  token: z.string().min(20).max(255),
  password: z.string().min(8).max(128),
});
