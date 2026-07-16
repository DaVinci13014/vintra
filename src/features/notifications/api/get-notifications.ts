import { NOTIFICATION_PAGE_SIZE, type NotificationCenterData } from "@/entities/notification";
import { ensureWeeklySummary, getWebPushPublicKey } from "@/entities/notification/server";
import { prisma } from "@/shared/api/database";
import { notificationListInputSchema } from "../model/notification-schemas";

export async function getNotifications(
  userId: string,
  input: unknown,
): Promise<NotificationCenterData | null> {
  const parsed = notificationListInputSchema.safeParse(input);
  if (!parsed.success) return null;

  await ensureWeeklySummary(userId);
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true, onboardingCompleted: true },
  });
  if (!profile?.onboardingCompleted) return null;

  const where = {
    profileId: profile.id,
    status: parsed.data.filter === "UNREAD" ? ("UNREAD" as const) : { not: "ARCHIVED" as const },
    ...(isTypeFilter(parsed.data.filter) ? { type: parsed.data.filter } : {}),
  };
  const [notifications, total, unreadCount] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (parsed.data.page - 1) * NOTIFICATION_PAGE_SIZE,
      take: NOTIFICATION_PAGE_SIZE,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        priority: true,
        status: true,
        actionUrl: true,
        readAt: true,
        createdAt: true,
      },
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { profileId: profile.id, status: "UNREAD" } }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / NOTIFICATION_PAGE_SIZE));
  return {
    filter: parsed.data.filter,
    page: Math.min(parsed.data.page, pageCount),
    pageCount,
    total,
    unreadCount,
    notifications: notifications
      .filter((notification) => notification.status !== "ARCHIVED")
      .map((notification) => ({
        ...notification,
        status: notification.status === "UNREAD" ? ("UNREAD" as const) : ("READ" as const),
        createdAt: notification.createdAt.toISOString(),
        readAt: notification.readAt?.toISOString() ?? null,
      })),
  };
}

export async function getNotificationPreferences(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      onboardingCompleted: true,
      notificationPreference: true,
      _count: { select: { pushSubscriptions: true } },
    },
  });
  if (!profile?.onboardingCompleted) return null;

  return {
    goalProgressPush: profile.notificationPreference?.goalProgressPush ?? true,
    recommendationsPush: profile.notificationPreference?.recommendationsPush ?? true,
    weeklySummaryPush: profile.notificationPreference?.weeklySummaryPush ?? true,
    pushEnabled:
      Boolean(profile.notificationPreference?.pushEnabled) && profile._count.pushSubscriptions > 0,
    pushAvailable: getWebPushPublicKey() !== null,
    publicKey: getWebPushPublicKey(),
  };
}

function isTypeFilter(
  filter: string,
): filter is "GOAL" | "SAVINGS" | "RECOMMENDATION" | "SYSTEM" | "SECURITY" {
  return ["GOAL", "SAVINGS", "RECOMMENDATION", "SYSTEM", "SECURITY"].includes(filter);
}
