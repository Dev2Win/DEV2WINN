import { describe, expect, it, vi, afterEach } from 'vitest';
import { MatchingFeedbackBody, RecommendationBody } from '../../contracts/matching.js';
import { matchingService } from './matching.service.js';
import { matchingRepository } from './matching.repository.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('matching routes', () => {
  it('validates recommendation payloads', async () => {
    const parsed = RecommendationBody.safeParse({
      user: {},
      candidates: [],
      role: 'invalid',
    });
    expect(parsed.success).toBe(false);
  });

  it('validates feedback payloads', () => {
    const parsed = MatchingFeedbackBody.safeParse({
      actorUserId: 'u1',
      candidateId: 'm1',
      actorRole: 'mentee',
      eventType: 'viewed',
      rating: 5,
    });
    expect(parsed.success).toBe(true);
  });

  it('proxies recommendations to the AI service', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          candidates: [{ candidate_id: 'mentor-1', score: 0.9, reasons: ['shares: react'] }],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );

    const res = await matchingService.recommendations({
      role: 'mentee',
      user: { career_path: 'frontend' },
      candidates: [{ id: 'mentor-1', expertise: ['React'] }],
      limit: 5,
    });

    expect(res.candidates[0].candidate_id).toBe('mentor-1');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/recommendations'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(res.cache.hit).toBe(false);
  });

  it('records feedback through the repository', async () => {
    vi.spyOn(matchingRepository, 'recordFeedback').mockResolvedValue([
      {
        id: 1,
        actor_user_id: 'u1',
        candidate_id: 'm1',
        event_type: 'viewed',
      },
    ]);

    const feedback = await matchingService.recordFeedback({
      actorUserId: 'u1',
      candidateId: 'm1',
      actorRole: 'mentee',
      eventType: 'viewed',
      metadata: { source: 'test' },
    });

    expect(feedback.id).toBe(1);
    expect(matchingRepository.recordFeedback).toHaveBeenCalledWith(
      expect.objectContaining({ actorUserId: 'u1', candidateId: 'm1' }),
    );
  });
});
