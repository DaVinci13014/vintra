import * as Sentry from "@sentry/nextjs";

import { publicEnv } from "@/shared/config/public";
import { sanitizeSentryEvent } from "@/shared/lib/monitoring";

if (publicEnv.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    beforeSend: sanitizeSentryEvent,
    dsn: publicEnv.NEXT_PUBLIC_SENTRY_DSN,
    enableLogs: false,
    replaysOnErrorSampleRate: 0,
    replaysSessionSampleRate: 0,
    sendDefaultPii: false,
    tracesSampleRate: 0.05,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
