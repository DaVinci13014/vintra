import { z } from "zod";

import { NOTIFICATION_FILTERS } from "@/entities/notification";

const WEB_PUSH_HOSTS = new Set([
  "fcm.googleapis.com",
  "updates.push.services.mozilla.com",
  "push.services.mozilla.com",
  "web.push.apple.com",
]);
const BASE64_URL_PATTERN = /^[A-Za-z0-9_-]+$/;

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
    endpoint: z
      .url()
      .max(2_048)
      .refine((value) => {
        if (!URL.canParse(value)) return false;
        const endpoint = new URL(value);
        return (
          endpoint.protocol === "https:" &&
          !endpoint.username &&
          !endpoint.password &&
          (!endpoint.port || endpoint.port === "443") &&
          WEB_PUSH_HOSTS.has(endpoint.hostname)
        );
      }, "Ce fournisseur Push n’est pas autorisé."),
    expirationTime: z.number().int().positive().nullable(),
    keys: z
      .object({
        p256dh: z.string().min(43).max(255).regex(BASE64_URL_PATTERN),
        auth: z.string().min(16).max(255).regex(BASE64_URL_PATTERN),
      })
      .strict(),
  })
  .strict();

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;
export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>;
