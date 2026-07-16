import webPush from "web-push";

import type { NotificationEventInput } from "../model/notification";
import { MAX_ACTIVE_NOTIFICATIONS } from "../model/notification";
import { prisma, type Prisma } from "@/shared/api/database";
import { serverEnv } from "@/shared/config/server";

type NotificationDatabase = Pick<
  Prisma.TransactionClient,
  "notification" | "notificationPreference" | "profile" | "pushSubscription"
>;

type GoalProgressInput = {
  profileId: string;
  goalId: string;
  goalTitle: string;
  previousProgress: number;
  currentProgress: number;
  completed: boolean;
  includeMilestones?: boolean;
};

const MILESTONES = [25, 50, 75] as const;

export function isWebPushConfigured() {
  return Boolean(
    serverEnv.WEB_PUSH_PUBLIC_KEY && serverEnv.WEB_PUSH_PRIVATE_KEY && serverEnv.WEB_PUSH_SUBJECT,
  );
}

export function getWebPushPublicKey() {
  return isWebPushConfigured() ? (serverEnv.WEB_PUSH_PUBLIC_KEY ?? null) : null;
}

export async function createNotification(
  database: NotificationDatabase,
  input: NotificationEventInput,
) {
  const data = {
    profileId: input.profileId,
    title: input.title,
    description: input.description,
    type: input.type,
    priority: input.priority,
    actionUrl: input.actionUrl,
    dedupeKey: input.dedupeKey,
  } as const;

  const notification = input.dedupeKey
    ? await database.notification.upsert({
        where: {
          profileId_dedupeKey: {
            profileId: input.profileId,
            dedupeKey: input.dedupeKey,
          },
        },
        create: data,
        update: {},
        select: { id: true },
      })
    : await database.notification.create({ data, select: { id: true } });

  await archiveOverflow(database, input.profileId);
  return notification.id;
}

export async function createGoalProgressNotifications(
  database: NotificationDatabase,
  input: GoalProgressInput,
) {
  const notificationIds: string[] = [];

  for (const milestone of input.includeMilestones === false ? [] : MILESTONES) {
    if (input.previousProgress < milestone && input.currentProgress >= milestone) {
      notificationIds.push(
        await createNotification(database, {
          profileId: input.profileId,
          title: `Objectif atteint à ${milestone} %`,
          description: `Vous avez franchi une nouvelle étape pour « ${input.goalTitle} ».`,
          type: "GOAL",
          priority: "MEDIUM",
          actionUrl: `/goals/${input.goalId}`,
          dedupeKey: `goal:${input.goalId}:milestone:${milestone}`,
        }),
      );
    }
  }

  if (input.completed && input.previousProgress < 100) {
    notificationIds.push(
      await createNotification(database, {
        profileId: input.profileId,
        title: "Objectif atteint",
        description: `Félicitations, vous avez atteint « ${input.goalTitle} ».`,
        type: "GOAL",
        priority: "HIGH",
        actionUrl: `/goals/${input.goalId}`,
        dedupeKey: `goal:${input.goalId}:completed`,
      }),
    );
  }

  return notificationIds;
}

export async function createRecommendationNotification(
  database: NotificationDatabase,
  input: { profileId: string; sourceId: string; count: number },
) {
  if (input.count === 0) return null;

  return createNotification(database, {
    profileId: input.profileId,
    title: input.count === 1 ? "Nouvelle recommandation" : "Nouvelles recommandations",
    description:
      input.count === 1
        ? "Un nouveau conseil d’épargne est disponible."
        : `${input.count} nouveaux conseils d’épargne sont disponibles.`,
    type: "RECOMMENDATION",
    priority: "MEDIUM",
    actionUrl: "/recommendations",
    dedupeKey: `recommendations:${input.sourceId}`,
  });
}

export async function createProfileUpdatedNotification(
  database: NotificationDatabase,
  input: { profileId: string; sourceId: string },
) {
  return createNotification(database, {
    profileId: input.profileId,
    title: "Profil financier mis à jour",
    description: "Votre analyse et votre capacité d’épargne ont été recalculées.",
    type: "SYSTEM",
    priority: "LOW",
    actionUrl: "/profile",
    dedupeKey: `profile-updated:${input.sourceId}`,
  });
}

export async function createSecurityNotificationForUser(input: {
  userId: string;
  title: string;
  description: string;
  dedupeKey?: string;
}) {
  const profile = await prisma.profile.findUnique({
    where: { userId: input.userId },
    select: { id: true },
  });
  if (!profile) return null;

  const notificationId = await createNotification(prisma, {
    profileId: profile.id,
    title: input.title,
    description: input.description,
    type: "SECURITY",
    priority: "HIGH",
    actionUrl: "/settings/security",
    dedupeKey: input.dedupeKey,
  });
  await safelyDeliverPendingPushNotifications(input.userId);
  return notificationId;
}

export async function ensureWeeklySummary(userId: string, now = new Date()) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      id: true,
      onboardingCompleted: true,
      currency: true,
      currentSavings: true,
      goals: {
        where: { status: { in: ["ACTIVE", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { title: true, progress: true },
      },
      recommendations: {
        where: { status: { in: ["GENERATED", "DISPLAYED", "OPENED"] } },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        take: 1,
        select: { title: true },
      },
    },
  });
  if (!profile?.onboardingCompleted) return null;

  const goal = profile.goals[0];
  const recommendation = profile.recommendations[0];

  const notificationId = await createNotification(prisma, {
    profileId: profile.id,
    title: "Votre résumé de la semaine",
    description: buildWeeklySummaryDescription({
      currency: profile.currency,
      currentSavings: profile.currentSavings?.toNumber() ?? 0,
      goal: goal ? { progress: goal.progress.toNumber(), title: goal.title } : undefined,
      recommendationTitle: recommendation?.title,
    }),
    type: "SYSTEM",
    priority: "LOW",
    actionUrl: "/dashboard",
    dedupeKey: `weekly-summary:${getIsoWeekKey(now)}`,
  });
  await safelyDeliverPendingPushNotifications(userId);
  return notificationId;
}

export async function generateWeeklySummaries(now = new Date()) {
  const profiles = await prisma.profile.findMany({
    where: { onboardingCompleted: true },
    orderBy: { id: "asc" },
    select: {
      id: true,
      userId: true,
      currency: true,
      currentSavings: true,
      goals: {
        where: { status: { in: ["ACTIVE", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { title: true, progress: true },
      },
      recommendations: {
        where: { status: { in: ["GENERATED", "DISPLAYED", "OPENED"] } },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        take: 1,
        select: { title: true },
      },
    },
  });

  const dedupeKey = `weekly-summary:${getIsoWeekKey(now)}`;
  if (profiles.length === 0) {
    return { created: 0, profiles: 0, pushDelivered: 0 };
  }

  const created = await prisma.notification.createMany({
    data: profiles.map((profile) => {
      const goal = profile.goals[0];
      return {
        actionUrl: "/dashboard",
        dedupeKey,
        description: buildWeeklySummaryDescription({
          currency: profile.currency,
          currentSavings: profile.currentSavings?.toNumber() ?? 0,
          goal: goal ? { progress: goal.progress.toNumber(), title: goal.title } : undefined,
          recommendationTitle: profile.recommendations[0]?.title,
        }),
        priority: "LOW" as const,
        profileId: profile.id,
        title: "Votre résumé de la semaine",
        type: "SYSTEM" as const,
      };
    }),
    skipDuplicates: true,
  });

  let pushDelivered = 0;
  for (const profile of profiles) {
    await archiveOverflow(prisma, profile.id);
    const delivery = await safelyDeliverPendingPushNotifications(profile.userId);
    pushDelivered += delivery.delivered;
  }

  return { created: created.count, profiles: profiles.length, pushDelivered };
}

export async function deliverPendingPushNotifications(userId: string) {
  if (!isWebPushConfigured()) return { delivered: 0 };

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      notificationPreference: true,
      pushSubscriptions: true,
      notifications: {
        where: { pushSentAt: null, status: { not: "ARCHIVED" } },
        orderBy: { createdAt: "asc" },
        take: 50,
      },
    },
  });
  const preference = profile?.notificationPreference;
  if (!profile || !preference?.pushEnabled || profile.pushSubscriptions.length === 0) {
    return { delivered: 0 };
  }

  webPush.setVapidDetails(
    serverEnv.WEB_PUSH_SUBJECT!,
    serverEnv.WEB_PUSH_PUBLIC_KEY!,
    serverEnv.WEB_PUSH_PRIVATE_KEY!,
  );

  let delivered = 0;
  for (const notification of profile.notifications.filter((item) =>
    shouldSendPush(item, preference),
  )) {
    let sent = false;
    for (const subscription of profile.pushSubscriptions) {
      try {
        await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth },
          },
          JSON.stringify({
            title: notification.title,
            body: notification.description,
            url: notification.actionUrl ?? "/notifications",
            tag: notification.dedupeKey ?? notification.id,
          }),
        );
        sent = true;
      } catch (error) {
        const statusCode = getPushStatusCode(error);
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.deleteMany({ where: { id: subscription.id } });
        }
      }
    }
    if (sent) {
      await prisma.notification.update({
        where: { id: notification.id },
        data: { pushSentAt: new Date() },
      });
      delivered += 1;
    }
  }

  return { delivered };
}

export async function safelyDeliverPendingPushNotifications(userId: string) {
  try {
    return await deliverPendingPushNotifications(userId);
  } catch {
    return { delivered: 0 };
  }
}

async function archiveOverflow(database: NotificationDatabase, profileId: string) {
  const overflow = await database.notification.findMany({
    where: { profileId, status: { not: "ARCHIVED" } },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: MAX_ACTIVE_NOTIFICATIONS,
    select: { id: true },
  });
  if (overflow.length === 0) return;

  await database.notification.updateMany({
    where: { id: { in: overflow.map((notification) => notification.id) } },
    data: { status: "ARCHIVED", archivedAt: new Date() },
  });
}

function shouldSendPush(
  notification: {
    type: "GOAL" | "SAVINGS" | "RECOMMENDATION" | "SYSTEM" | "SECURITY";
    dedupeKey: string | null;
  },
  preference: {
    goalProgressPush: boolean;
    recommendationsPush: boolean;
    weeklySummaryPush: boolean;
  },
) {
  if (notification.type === "SECURITY") return true;
  if (notification.type === "GOAL" || notification.type === "SAVINGS") {
    return preference.goalProgressPush;
  }
  if (notification.type === "RECOMMENDATION") return preference.recommendationsPush;
  return notification.dedupeKey?.startsWith("weekly-summary:")
    ? preference.weeklySummaryPush
    : false;
}

function getPushStatusCode(error: unknown) {
  if (typeof error !== "object" || error === null || !("statusCode" in error)) return null;
  return typeof error.statusCode === "number" ? error.statusCode : null;
}

function getIsoWeekKey(date: Date) {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${utcDate.getUTCFullYear()}-${String(week).padStart(2, "0")}`;
}

function buildWeeklySummaryDescription(input: {
  currency: string;
  currentSavings: number;
  goal?: { progress: number; title: string };
  recommendationTitle?: string;
}) {
  const details = [
    input.goal ? `« ${input.goal.title} » est à ${Math.round(input.goal.progress)} %.` : null,
    `Épargne actuelle : ${new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: input.currency,
      maximumFractionDigits: 0,
    }).format(input.currentSavings)}.`,
    input.recommendationTitle ? `Priorité : ${input.recommendationTitle}.` : null,
  ].filter((detail): detail is string => Boolean(detail));

  return details.join(" ");
}
