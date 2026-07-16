import * as Sentry from "@sentry/nextjs";

import { publicEnv } from "@/shared/config/public";
import { sanitizeSentryEvent } from "@/shared/lib/monitoring";

if (publicEnv.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    beforeSend: sanitizeSentryEvent,
    dsn: publicEnv.NEXT_PUBLIC_SENTRY_DSN,
    enableLogs: false,
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
  });
}
