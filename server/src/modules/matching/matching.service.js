import { env } from '../../config/env.js';
import { Errors } from '../../lib/errors.js';
import { matchingRepository } from './matching.repository.js';

const RECOMMENDATION_CACHE_TTL_SECONDS = 300;

async function postAi(path, payload) {
  const response = await fetch(`${env.AI_URL}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.SERVICE_JWT_SECRET}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw Errors.internal(`AI matching request failed: ${text.slice(0, 240)}`);
  }
  return response.json();
}

async function getRedis() {
  if (env.NODE_ENV === 'test') return null;
  try {
    const { redis } = await import('../../lib/redis.js');
    return redis;
  } catch {
    return null;
  }
}

async function cacheGet(key) {
  const redis = await getRedis();
  if (!redis) return null;
  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

async function cacheSet(key, result, userId) {
  const redis = await getRedis();
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(result), 'EX', RECOMMENDATION_CACHE_TTL_SECONDS);
    if (userId) {
      await redis.sadd(userCacheSetKey(userId), key);
      await redis.expire(userCacheSetKey(userId), RECOMMENDATION_CACHE_TTL_SECONDS);
    }
  } catch {
    // Cache failures should not block recommendation delivery.
  }
}

async function invalidateUserCache(userId) {
  const redis = await getRedis();
  if (!redis || !userId) return;
  try {
    const setKey = userCacheSetKey(userId);
    const keys = await redis.smembers(setKey);
    if (keys.length) await redis.del(...keys);
    await redis.del(setKey);
  } catch {
    // Feedback capture still succeeds if cache invalidation fails.
  }
}

function recommendationCacheKey(payload) {
  const body = stableStringify(payload);
  return `matching:recommendations:${Buffer.from(body).toString('base64url')}`;
}

function userCacheSetKey(userId) {
  return `matching:user:${userId}:keys`;
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

export const matchingService = {
  async recommendations({ user, candidates, role, limit }) {
    const payload = { user, candidates, role, limit };
    const key = recommendationCacheKey(payload);
    const cached = await cacheGet(key);
    if (cached) return { ...cached, cache: { hit: true, ttlSeconds: RECOMMENDATION_CACHE_TTL_SECONDS } };

    const result = await postAi('/v1/recommendations', payload);
    await cacheSet(key, result, user?.id);
    return { ...result, cache: { hit: false, ttlSeconds: RECOMMENDATION_CACHE_TTL_SECONDS } };
  },

  match({ mentee, mentors, limit }) {
    return postAi('/v1/match', { mentee, mentors, limit });
  },

  async recordFeedback(payload) {
    const [feedback] = await matchingRepository.recordFeedback(payload);
    await invalidateUserCache(payload.actorUserId);
    return feedback;
  },
};
