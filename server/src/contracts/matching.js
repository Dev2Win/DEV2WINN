import { z } from 'zod';

const Profile = z.record(z.unknown());

export const RecommendationBody = z.object({
  user: Profile,
  candidates: z.array(Profile).default([]),
  role: z.enum(['mentee', 'mentor']).default('mentee'),
  limit: z.number().int().min(1).max(50).default(10),
});

export const MatchBody = z.object({
  mentee: Profile,
  mentors: z.array(Profile).default([]),
  limit: z.number().int().min(1).max(50).default(10),
});

export const MatchingFeedbackBody = z.object({
  actorUserId: z.string().min(1),
  candidateId: z.string().min(1),
  actorRole: z.enum(['mentee', 'mentor']),
  eventType: z.enum(['shown', 'viewed', 'dismissed', 'contacted', 'booked', 'completed', 'reviewed']),
  rating: z.number().int().min(1).max(5).optional(),
  metadata: z.record(z.unknown()).optional().default({}),
});
