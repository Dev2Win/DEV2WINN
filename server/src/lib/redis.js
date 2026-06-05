import { Redis } from 'ioredis';
import { env } from '../config/env.js';

/**
 * Shared Redis connection — used for sessions, rate limiting, and caching.
 */
export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

/**
 * Connection *options* for BullMQ. We pass options (not the shared instance) so
 * BullMQ manages its own connections — the recommended pattern. `maxRetriesPerRequest:
 * null` is required by BullMQ.
 */
const url = new URL(env.REDIS_URL);
export const bullConnection = {
  host: url.hostname,
  port: Number(url.port || 6379),
  password: url.password || undefined,
  maxRetriesPerRequest: null,
};
