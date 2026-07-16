import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(20).default(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  CRON_SECRET: z.string().min(16).optional(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  APP_VERSION: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .default("0.1.0"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  VERCEL_GIT_COMMIT_SHA: z
    .string()
    .regex(/^[a-f0-9]{7,40}$/i)
    .optional(),
  VERCEL_URL: z
    .string()
    .regex(/^[a-z0-9.-]+$/i)
    .optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).optional(),
  WEB_PUSH_PUBLIC_KEY: z.string().min(1).optional(),
  WEB_PUSH_PRIVATE_KEY: z.string().min(1).optional(),
  WEB_PUSH_SUBJECT: z
    .string()
    .refine((value) => value.startsWith("mailto:") || value.startsWith("https://"))
    .optional(),
});

const parsedEnv = serverEnvSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_POOL_MAX: process.env.DATABASE_POOL_MAX,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  CRON_SECRET: process.env.CRON_SECRET || undefined,
  LOG_LEVEL: process.env.LOG_LEVEL,
  APP_VERSION: process.env.APP_VERSION,
  VERCEL_ENV: process.env.VERCEL_ENV || undefined,
  VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || undefined,
  VERCEL_URL: process.env.VERCEL_URL || undefined,
  RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
  EMAIL_FROM: process.env.EMAIL_FROM || undefined,
  WEB_PUSH_PUBLIC_KEY: process.env.WEB_PUSH_PUBLIC_KEY || undefined,
  WEB_PUSH_PRIVATE_KEY: process.env.WEB_PUSH_PRIVATE_KEY || undefined,
  WEB_PUSH_SUBJECT: process.env.WEB_PUSH_SUBJECT || undefined,
});

if (!parsedEnv.success) {
  throw new Error("La configuration serveur de Vintra est incomplète.");
}

export const serverEnv = parsedEnv.data;
