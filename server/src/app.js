import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { errorHandler } from './lib/errors.js';
import { healthRouter } from './modules/health/health.routes.js';
import { usersRouter } from './modules/users/users.routes.js';
import { matchingRouter } from './modules/matching/matching.routes.js';

/**
 * Builds the Express app. Each domain is a Router (module) mounted here — the
 * modular structure mirrors the planned per-domain layout. Express 5 forwards
 * rejected async handlers to the error middleware automatically.
 */
export function buildApp() {
  const app = express();

  // Security & platform middleware
  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(cookieParser(env.SESSION_SECRET));
  app.use(express.json());
  app.use(rateLimit({ windowMs: 60_000, max: 100 }));
  app.use(
    pinoHttp({
      transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
    }),
  );

  // Domain modules
  app.use(healthRouter);
  app.use(usersRouter);
  app.use(matchingRouter);
  // app.use(authRouter);    // Phase 1
  // app.use(mentorsRouter); // Phase 2
  // ...

  // Consistent error envelope (must be last)
  app.use(errorHandler);

  return app;
}
