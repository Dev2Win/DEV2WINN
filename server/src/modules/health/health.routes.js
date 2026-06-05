import { Router } from 'express';
import { pingDb } from '../../db/pool.js';

/** Liveness + readiness. Readiness checks the DB connection. */
export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'server' });
});

healthRouter.get('/health/ready', async (_req, res) => {
  try {
    await pingDb();
    res.json({ status: 'ready', db: 'up' });
  } catch {
    res.status(503).json({ status: 'not-ready', db: 'down' });
  }
});
