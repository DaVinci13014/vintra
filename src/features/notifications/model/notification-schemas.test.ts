import { describe, expect, it } from "vitest";

import {
  notificationListInputSchema,
  notificationPreferencesSchema,
  pushSubscriptionSchema,
} from "./notification-schemas";

describe("schémas des notifications", () => {
  it("normalise la pagination et accepte les filtres documentés", () => {
    expect(notificationListInputSchema.parse({ page: "2", filter: "SECURITY" })).toEqual({
      page: 2,
      filter: "SECURITY",
    });
    expect(notificationListInputSchema.safeParse({ page: 0, filter: "UNKNOWN" }).success).toBe(
      false,
    );
  });

  it("valide uniquement les préférences facultatives", () => {
    expect(
      notificationPreferencesSchema.parse({
        goalProgressPush: true,
        recommendationsPush: false,
        weeklySummaryPush: true,
      }),
    ).toEqual({
      goalProgressPush: true,
      recommendationsPush: false,
      weeklySummaryPush: true,
    });
    expect(
      notificationPreferencesSchema.safeParse({
        goalProgressPush: true,
        recommendationsPush: true,
        weeklySummaryPush: true,
        securityPush: false,
      }).success,
    ).toBe(false);
  });

  it("refuse un abonnement Push incomplet", () => {
    expect(
      pushSubscriptionSchema.safeParse({
        endpoint: "not-an-url",
        expirationTime: null,
        keys: { p256dh: "short", auth: "short" },
      }).success,
    ).toBe(false);
  });
});
