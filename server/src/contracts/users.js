import { z } from 'zod';

/**
 * Shared request/response contracts for the users domain.
 * The client mirrors these in `client/lib/api/`. Single source of truth lives here.
 */
export const Role = z.enum(['mentee', 'mentor', 'admin']);

export const CreateUserBody = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(100).nullable().default(null),
  lastName: z.string().min(1).max(100).nullable().default(null),
  role: Role.default('mentee'),
});

export const UserDto = z.object({
  id: z.string(),
  email: z.string().email(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  role: Role,
  created_at: z.string(),
});
