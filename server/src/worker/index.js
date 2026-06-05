/**
 * BullMQ worker process. Runs alongside the API (separate entrypoint:
 * `npm run worker`). Handles async jobs — email, notifications, embedding
 * generation, match recomputation, recording post-processing.
 *
 * Phase 0: one no-op queue to prove the wiring. Real jobs land in later phases.
 */
import { Queue, Worker } from 'bullmq';
import { bullConnection } from '../lib/redis.js';

export const QUEUE_NAME = 'dev2win';

/** Enqueue side — imported by services to schedule async work. */
export const queue = new Queue(QUEUE_NAME, { connection: bullConnection });

/** Process side — runs when this file is the entrypoint. */
const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    switch (job.name) {
      case 'noop':
        return { ok: true };
      // case 'send-email': ...
      // case 'recompute-match': ...
      default:
        throw new Error(`unknown job: ${job.name}`);
    }
  },
  { connection: bullConnection },
);

worker.on('completed', (job) => console.log(`✓ job ${job.id} (${job.name})`));
worker.on('failed', (job, err) => console.error(`✗ job ${job?.id}:`, err.message));

console.log('worker listening on queue:', QUEUE_NAME);
