import 'dotenv/config';
import { z } from 'zod';

/**
 * Environment is validated once at boot. Missing/invalid config fails fast
 * instead of surfacing as confusing runtime errors later.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),

  MYSQL_HOST: z.string().default('127.0.0.1'),
  MYSQL_PORT: z.coerce.number().default(3307),
  MYSQL_USER: z.string().default('dev2win'),
  MYSQL_PASSWORD: z.string().default('dev2win'),
  MYSQL_DATABASE: z.string().default('dev2win'),

  REDIS_URL: z.string().default('redis://localhost:6379'),

  SESSION_SECRET: z.string().min(16).default('dev-only-session-secret-change-me'),
  COOKIE_DOMAIN: z.string().default('localhost'),

  SERVICE_JWT_SECRET: z.string().default('dev-only-service-secret'),
  AI_URL: z.string().url().default('http://localhost:8000'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
});

export const env = EnvSchema.parse(process.env);
