import * as Sentry from "@sentry/nextjs";
import type { NextRequest } from "next/server";

import { generateWeeklySummaries } from "@/entities/notification/server";
import { serverEnv } from "@/shared/config/server";
import { logger } from "@/shared/lib/logger";
import { isValidCronAuthorization } from "../model/cron-authorization";

export async function runWeeklySummaryCron(request: NextRequest) {
  if (!serverEnv.CRON_SECRET) {
    return Response.json({ error: "CRON_NOT_CONFIGURED" }, { status: 503 });
  }

  if (!isValidCronAuthorization(request.headers.get("authorization"), serverEnv.CRON_SECRET)) {
    return Response.json({ error: "CRON_UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const result = await generateWeeklySummaries();
    logger.info(result, "weekly_summary_cron_completed");
    return Response.json({ success: true, ...result });
  } catch (error) {
    logger.error({ error }, "weekly_summary_cron_failed");
    Sentry.captureException(error);
    return Response.json({ error: "CRON_EXECUTION_FAILED" }, { status: 500 });
  }
}
