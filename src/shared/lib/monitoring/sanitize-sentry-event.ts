import type { ErrorEvent } from "@sentry/nextjs";

export function sanitizeSentryEvent(event: ErrorEvent): ErrorEvent {
  return {
    ...event,
    request: event.request
      ? {
          ...event.request,
          cookies: undefined,
          data: undefined,
          headers: undefined,
          query_string: undefined,
        }
      : undefined,
    user: undefined,
  };
}
