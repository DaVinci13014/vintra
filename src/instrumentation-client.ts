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

const posthogKey = publicEnv.NEXT_PUBLIC_POSTHOG_KEY;

if (posthogKey) {
  void import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(posthogKey, {
        api_host: publicEnv.NEXT_PUBLIC_POSTHOG_HOST,
        autocapture: false,
        capture_dead_clicks: false,
        capture_pageleave: true,
        capture_pageview: "history_change",
        disable_session_recording: true,
        mask_all_text: true,
        persistence: "memory",
        person_profiles: "identified_only",
      });
    })
    .catch((error: unknown) => Sentry.captureException(error));
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
