"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { deliverPendingPushNotifications } from "@/entities/notification/server";
import { getSession } from "@/features/auth/server";
import type { ApiResponse } from "@/shared/api";
import { prisma } from "@/shared/api/database";
import {
  notificationIdSchema,
  notificationPreferencesSchema,
  pushSubscriptionSchema,
  type NotificationPreferencesInput,
} from "../model/notification-schemas";

const requestUserAgentSchema = z.string().trim().min(1).max(500).nullable();

export async function getUnreadNotificationCount(): Promise<ApiResponse<{ count: number }>> {
  const context = await getContext();
  if (!context.success) return context;

  const count = await prisma.notification.count({
    where: { profile: { userId: context.data.userId }, status: "UNREAD" },
  });
  return { success: true, data: { count } };
}

export async function openNotification(
  input: unknown,
): Promise<ApiResponse<{ destination: string }>> {
  const context = await getContext();
  if (!context.success) return context;
  const id = notificationIdSchema.safeParse(input);
  if (!id.success) return failure("VALIDATION_ERROR", "Cette notification n’est pas valide.");

  try {
    const destination = await prisma.$transaction(async (transaction) => {
      const notification = await transaction.notification.findFirst({
        where: {
          id: id.data,
          profile: { userId: context.data.userId },
          status: { not: "ARCHIVED" },
        },
        select: { status: true, actionUrl: true },
      });
      if (!notification) throw new Error("NOTIFICATION_NOT_FOUND");

      if (notification.status === "UNREAD") {
        await transaction.notification.update({
          where: { id: id.data },
          data: { status: "READ", readAt: new Date() },
        });
        await transaction.auditLog.create({
          data: { userId: context.data.userId, action: "NOTIFICATION_READ" },
        });
      }
      await transaction.auditLog.createMany({
        data: [
          { userId: context.data.userId, action: "NOTIFICATION_OPENED" },
          { userId: context.data.userId, action: "NOTIFICATION_CLICKED" },
        ],
      });
      return notification.actionUrl?.startsWith("/") ? notification.actionUrl : "/notifications";
    });
    refresh();
    return { success: true, data: { destination } };
  } catch {
    return failure("NOTIFICATION_NOT_FOUND", "Cette notification n’existe pas.");
  }
}

export async function markNotificationRead(input: unknown): Promise<ApiResponse<{ read: true }>> {
  const context = await getContext();
  if (!context.success) return context;
  const id = notificationIdSchema.safeParse(input);
  if (!id.success) return failure("VALIDATION_ERROR", "Cette notification n’est pas valide.");

  const result = await prisma.notification.updateMany({
    where: {
      id: id.data,
      profile: { userId: context.data.userId },
      status: "UNREAD",
    },
    data: { status: "READ", readAt: new Date() },
  });
  if (result.count === 0) {
    const owned = await prisma.notification.findFirst({
      where: { id: id.data, profile: { userId: context.data.userId }, status: "READ" },
      select: { id: true },
    });
    if (!owned) return failure("NOTIFICATION_NOT_FOUND", "Cette notification n’existe pas.");
  } else {
    await prisma.auditLog.create({
      data: { userId: context.data.userId, action: "NOTIFICATION_READ" },
    });
  }
  refresh();
  return { success: true, data: { read: true } };
}

export async function markAllNotificationsRead(): Promise<ApiResponse<{ count: number }>> {
  const context = await getContext();
  if (!context.success) return context;

  const result = await prisma.notification.updateMany({
    where: { profile: { userId: context.data.userId }, status: "UNREAD" },
    data: { status: "READ", readAt: new Date() },
  });
  if (result.count > 0) {
    await prisma.auditLog.create({
      data: { userId: context.data.userId, action: "NOTIFICATION_READ" },
    });
  }
  refresh();
  return { success: true, data: { count: result.count } };
}

export async function deleteNotification(input: unknown): Promise<ApiResponse<{ deleted: true }>> {
  const context = await getContext();
  if (!context.success) return context;
  const id = notificationIdSchema.safeParse(input);
  if (!id.success) return failure("VALIDATION_ERROR", "Cette notification n’est pas valide.");

  const result = await prisma.notification.deleteMany({
    where: { id: id.data, profile: { userId: context.data.userId } },
  });
  if (result.count === 0) {
    return failure("NOTIFICATION_NOT_FOUND", "Cette notification n’existe pas.");
  }
  await prisma.auditLog.create({
    data: { userId: context.data.userId, action: "NOTIFICATION_DELETED" },
  });
  refresh();
  return { success: true, data: { deleted: true } };
}

export async function deleteAllNotifications(): Promise<ApiResponse<{ count: number }>> {
  const context = await getContext();
  if (!context.success) return context;

  const result = await prisma.notification.deleteMany({
    where: { profile: { userId: context.data.userId } },
  });
  if (result.count > 0) {
    await prisma.auditLog.create({
      data: { userId: context.data.userId, action: "NOTIFICATION_DELETED" },
    });
  }
  refresh();
  return { success: true, data: { count: result.count } };
}

export async function updateNotificationPreferences(
  input: unknown,
): Promise<ApiResponse<NotificationPreferencesInput>> {
  const context = await getContext();
  if (!context.success) return context;
  const parsed = notificationPreferencesSchema.safeParse(input);
  if (!parsed.success) return failure("VALIDATION_ERROR", "Vérifiez vos préférences.");

  try {
    const profile = await prisma.profile.findUniqueOrThrow({
      where: { userId: context.data.userId },
      select: { id: true },
    });
    await prisma.$transaction([
      prisma.notificationPreference.upsert({
        where: { profileId: profile.id },
        create: { profileId: profile.id, ...parsed.data },
        update: parsed.data,
      }),
      prisma.auditLog.create({
        data: { userId: context.data.userId, action: "NOTIFICATION_SETTINGS_UPDATED" },
      }),
    ]);
  } catch {
    return failure(
      "NOTIFICATION_SETTINGS_FAILED",
      "Les préférences n’ont pas pu être enregistrées.",
    );
  }
  refresh();
  return { success: true, data: parsed.data };
}

export async function enablePushNotifications(
  input: unknown,
): Promise<ApiResponse<{ enabled: true }>> {
  const context = await getContext();
  if (!context.success) return context;
  const parsed = pushSubscriptionSchema.safeParse(input);
  if (!parsed.success) return failure("VALIDATION_ERROR", "L’abonnement Push n’est pas valide.");
  const parsedUserAgent = requestUserAgentSchema.safeParse((await headers()).get("user-agent"));
  const userAgent = parsedUserAgent.success ? parsedUserAgent.data : null;

  try {
    await prisma.$transaction(async (transaction) => {
      const profile = await transaction.profile.findUniqueOrThrow({
        where: { userId: context.data.userId },
        select: { id: true },
      });
      const existing = await transaction.pushSubscription.findUnique({
        where: { endpoint: parsed.data.endpoint },
        select: { profileId: true },
      });
      if (existing && existing.profileId !== profile.id) throw new Error("SUBSCRIPTION_CONFLICT");

      await transaction.pushSubscription.upsert({
        where: { endpoint: parsed.data.endpoint },
        create: {
          profileId: profile.id,
          endpoint: parsed.data.endpoint,
          p256dh: parsed.data.keys.p256dh,
          auth: parsed.data.keys.auth,
          expirationTime: parsed.data.expirationTime ? new Date(parsed.data.expirationTime) : null,
          userAgent,
        },
        update: {
          p256dh: parsed.data.keys.p256dh,
          auth: parsed.data.keys.auth,
          expirationTime: parsed.data.expirationTime ? new Date(parsed.data.expirationTime) : null,
          userAgent,
        },
      });
      await transaction.notificationPreference.upsert({
        where: { profileId: profile.id },
        create: { profileId: profile.id, pushEnabled: true },
        update: { pushEnabled: true },
      });
      await transaction.auditLog.create({
        data: { userId: context.data.userId, action: "NOTIFICATION_SETTINGS_UPDATED" },
      });
    });
  } catch {
    return failure("PUSH_ENABLE_FAILED", "Les notifications Push n’ont pas pu être activées.");
  }

  await deliverPendingPushNotifications(context.data.userId);
  refresh();
  return { success: true, data: { enabled: true } };
}

export async function disablePushNotifications(): Promise<ApiResponse<{ disabled: true }>> {
  const context = await getContext();
  if (!context.success) return context;

  try {
    const profile = await prisma.profile.findUniqueOrThrow({
      where: { userId: context.data.userId },
      select: { id: true },
    });
    await prisma.$transaction([
      prisma.pushSubscription.deleteMany({ where: { profileId: profile.id } }),
      prisma.notificationPreference.upsert({
        where: { profileId: profile.id },
        create: { profileId: profile.id, pushEnabled: false },
        update: { pushEnabled: false },
      }),
      prisma.auditLog.create({
        data: { userId: context.data.userId, action: "NOTIFICATION_SETTINGS_UPDATED" },
      }),
    ]);
  } catch {
    return failure("PUSH_DISABLE_FAILED", "Les notifications Push n’ont pas pu être désactivées.");
  }
  refresh();
  return { success: true, data: { disabled: true } };
}

async function getContext(): Promise<ApiResponse<{ userId: string }>> {
  const session = await getSession();
  if (!session) return failure("AUTH_UNAUTHORIZED", "Votre session a expiré.");
  if (!session.user.emailVerified) {
    return failure("AUTH_EMAIL_NOT_VERIFIED", "Vérifiez votre adresse email.");
  }
  return { success: true, data: { userId: session.user.id } };
}

function failure(code: string, message: string): ApiResponse<never> {
  return { success: false, error: { code, message } };
}

function refresh() {
  revalidatePath("/dashboard");
  revalidatePath("/notifications");
  revalidatePath("/settings/notifications");
}
