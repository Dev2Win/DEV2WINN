import { Router } from 'express';
import { MatchBody, MatchingFeedbackBody, RecommendationBody } from '../../contracts/matching.js';
import { Errors } from '../../lib/errors.js';
import { matchingService } from './matching.service.js';

export const matchingRouter = Router();

matchingRouter.post('/v1/matching/recommendations', async (req, res) => {
  const parsed = RecommendationBody.safeParse(req.body);
  if (!parsed.success) {
    throw Errors.validation('Invalid recommendation payload', parsed.error.flatten());
  }
  const result = await matchingService.recommendations(parsed.data);
  res.json(result);
});

matchingRouter.post('/v1/matching/match', async (req, res) => {
  const parsed = MatchBody.safeParse(req.body);
  if (!parsed.success) {
    throw Errors.validation('Invalid match payload', parsed.error.flatten());
  }
  const result = await matchingService.match(parsed.data);
  res.json(result);
});

matchingRouter.post('/v1/matching/feedback', async (req, res) => {
  const parsed = MatchingFeedbackBody.safeParse(req.body);
  if (!parsed.success) {
    throw Errors.validation('Invalid matching feedback payload', parsed.error.flatten());
  }
  const feedback = await matchingService.recordFeedback(parsed.data);
  res.status(201).json({ feedback });
});
