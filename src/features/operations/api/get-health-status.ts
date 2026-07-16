import * as Sentry from "@sentry/nextjs";

import { prisma } from "@/shared/api/database";
import { serverEnv } from "@/shared/config/server";
import { logger } from "@/shared/lib/logger";

type CheckStatus = "ok" | "error";

export async function getHealthStatus() {
  const configuration = getConfigurationStatus();
  let database: CheckStatus = "ok";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    database = "error";
    logger.error({ error }, "health_check_database_failed");
    Sentry.captureException(error);
  }

  const isHealthy = configuration === "ok" && database === "ok";
  return {
    body: {
      checks: { configuration, database },
      environment: serverEnv.VERCEL_ENV ?? "development",
      status: isHealthy ? ("ok" as const) : ("degraded" as const),
      timestamp: new Date().toISOString(),
      version: serverEnv.APP_VERSION,
    },
    status: isHealthy ? 200 : 503,
  };
}

function getConfigurationStatus(): CheckStatus {
  if (serverEnv.VERCEL_ENV !== "production") return "ok";

  return serverEnv.CRON_SECRET && serverEnv.RESEND_API_KEY && serverEnv.EMAIL_FROM ? "ok" : "error";
}
