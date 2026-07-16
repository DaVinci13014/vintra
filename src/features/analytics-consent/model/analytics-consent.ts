import { z } from "zod";

export const ANALYTICS_CONSENT_STORAGE_KEY = "vintra.analytics-consent";
export const ANALYTICS_CONSENT_EVENT = "vintra:analytics-consent-changed";

export const analyticsConsentSchema = z.enum(["accepted", "declined"]);

export type AnalyticsConsent = z.infer<typeof analyticsConsentSchema>;

export function parseAnalyticsConsent(value: unknown) {
  const parsed = analyticsConsentSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
