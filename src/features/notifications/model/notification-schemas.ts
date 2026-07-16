import { z } from "zod";

import { NOTIFICATION_FILTERS } from "@/entities/notification";

export const notificationIdSchema = z.uuid();

export const notificationListInputSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  filter: z.enum(NOTIFICATION_FILTERS).default("ALL"),
});

export const notificationPreferencesSchema = z
  .object({
    goalProgressPush: z.boolean(),
    recommendationsPush: z.boolean(),
    weeklySummaryPush: z.boolean(),
  })
  .strict();

export const pushSubscriptionSchema = z
  .object({
    endpoint: z.url().max(2_048),
    expirationTime: z.number().int().positive().nullable(),
    keys: z
      .object({
        p256dh: z.string().min(20).max(255),
        auth: z.string().min(10).max(255),
      })
      .strict(),
  })
  .strict();

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;
export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>;
