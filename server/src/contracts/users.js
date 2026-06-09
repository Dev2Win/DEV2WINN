import { z } from 'zod';

/**
 * Shared request/response contracts for the users domain.
 * The client mirrors these in `client/lib/api/`. Single source of truth lives here.
 */
export const Role = z.enum(['mentee', 'mentor', 'admin']);
export const PublicRole = z.enum(['mentee', 'mentor']);

export const CreateUserBody = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(100).nullable().default(null),
  lastName: z.string().min(1).max(100).nullable().default(null),
  role: PublicRole.default('mentee'),
});

export const UpdateProfileBody = z.object({
  firstName: z.string().min(1).max(100).nullable().default(null),
  lastName: z.string().min(1).max(100).nullable().default(null),
  role: PublicRole,
});

export const UserDto = z.object({
  id: z.string(),
  email: z.string().email(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  avatar_url: z.string().nullable().optional(),
  avatar_public_id: z.string().nullable().optional(),
  role: Role,
  created_at: z.string(),
});

export const MentorProfileBody = z.object({
  title: z.string().min(1).max(140).nullable().default(null),
  bio: z.string().min(1).max(4000).nullable().default(null),
  experienceLevel: z.string().min(1).max(80).nullable().default(null),
  industries: z.array(z.string().min(1).max(80)).max(20).default([]),
  cvUrl: z.string().url().max(512).nullable().default(null),
  expertise: z.array(z.string().min(1).max(80)).max(20).default([]),
  careerPreferences: z.array(z.string().min(1).max(80)).max(20).default([]),
  languages: z.array(z.string().min(1).max(40)).max(10).default([]),
  availability: z.array(z.string().min(1).max(40)).max(10).default([]),
});

export const MenteeProfileBody = z.object({
  careerPath: z.string().min(1).max(120).nullable().default(null),
  goals: z.string().min(1).max(4000).nullable().default(null),
  experienceLevel: z.string().min(1).max(80).nullable().default(null),
  industryPreferences: z.array(z.string().min(1).max(80)).max(20).default([]),
  educationStatus: z.string().min(1).max(120).nullable().default(null),
  desiredSkills: z.array(z.string().min(1).max(80)).max(20).default([]),
  languages: z.array(z.string().min(1).max(40)).max(10).default([]),
  availability: z.array(z.string().min(1).max(40)).max(10).default([]),
});

export const AvatarBody = z.object({
  avatarUrl: z.string().url().max(512),
  avatarPublicId: z.string().min(1).max(255),
});

export const DirectoryQuery = z.object({
  limit: z.coerce.number().int().min(1).max(25).default(12),
  cursor: z.string().optional(),
  search: z.string().max(255).optional().default(''),
  language: z.string().max(80).optional().default(''),
  tag: z.string().max(80).optional().default(''),
});
