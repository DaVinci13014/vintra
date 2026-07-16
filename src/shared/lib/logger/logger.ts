import "server-only";

import pino from "pino";

import { serverEnv } from "@/shared/config/server";

const REDACTED_PATHS = [
  "authorization",
  "cookie",
  "email",
  "password",
  "token",
  "req.headers.authorization",
  "req.headers.cookie",
  "request.headers.authorization",
  "request.headers.cookie",
  "*.authorization",
  "*.cookie",
  "*.email",
  "*.password",
  "*.secret",
  "*.token",
] as const;

export const logger = pino({
  base: {
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    service: "vintra",
  },
  level: serverEnv.LOG_LEVEL,
  redact: {
    censor: "[REDACTED]",
    paths: [...REDACTED_PATHS],
  },
  serializers: {
    error: pino.stdSerializers.err,
  },
});
