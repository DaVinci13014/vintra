import "dotenv/config";

import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const userId = randomUUID();
const otherUserId = randomUUID();

vi.mock("@/features/auth/server", () => ({
  getSession: vi.fn(async () => ({ user: { id: userId, emailVerified: true } })),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers({ "user-agent": "Vintra integration test" })),
}));

import { createNotification, ensureWeeklySummary } from "@/entities/notification/server";
import { prisma } from "@/shared/api/database";
import { getNotifications } from "./get-notifications";
import {
  deleteAllNotifications,
  deleteNotification,
  disablePushNotifications,
  enablePushNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  openNotification,
  updateNotificationPreferences,
} from "./notification-actions";

describe.runIf(process.env.RUN_DATABASE_TESTS === "true")("notifications avec PostgreSQL", () => {
  let profileId: string;
  let otherProfileId: string;

  beforeAll(async () => {
    const [user, otherUser] = await Promise.all([
      prisma.user.create({
        data: {
          id: userId,
          name: "Notifications Test",
          firstName: "Notifications",
          lastName: "Test",
          email: `notifications-${userId}@vintra.test`,
          emailVerified: true,
          profile: { create: { onboardingCompleted: true, currentSavings: 1_500 } },
        },
        select: { profile: { select: { id: true } } },
      }),
      prisma.user.create({
        data: {
          id: otherUserId,
          name: "Notifications Other",
          firstName: "Notifications",
          lastName: "Other",
          email: `notifications-other-${otherUserId}@vintra.test`,
          emailVerified: true,
          profile: { create: { onboardingCompleted: true } },
        },
        select: { profile: { select: { id: true } } },
      }),
    ]);
    profileId = user.profile!.id;
    otherProfileId = otherUser.profile!.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: [userId, otherUserId] } } });
    await prisma.$disconnect();
  });

  it("déduplique les événements et archive automatiquement au-delà de 100", async () => {
    const dedupeInput = {
      profileId,
      title: "Événement unique",
      description: "Cette notification ne doit apparaître qu’une fois.",
      type: "SYSTEM" as const,
      priority: "LOW" as const,
      dedupeKey: "integration:unique",
    };
    await createNotification(prisma, dedupeInput);
    await createNotification(prisma, dedupeInput);
    expect(
      await prisma.notification.count({ where: { profileId, dedupeKey: "integration:unique" } }),
    ).toBe(1);

    await prisma.notification.createMany({
      data: Array.from({ length: 105 }, (_, index) => ({
        profileId,
        title: `Notification ${index}`,
        description: "Notification utilisée pour vérifier la rétention.",
        type: "SYSTEM" as const,
        priority: "LOW" as const,
        createdAt: new Date(Date.UTC(2026, 0, 1, 0, index)),
      })),
    });
    await createNotification(prisma, {
      profileId,
      title: "Déclencheur de rétention",
      description: "Archive les notifications les plus anciennes.",
      type: "SYSTEM",
      priority: "LOW",
    });
    expect(
      await prisma.notification.count({ where: { profileId, status: { not: "ARCHIVED" } } }),
    ).toBe(100);
    expect(
      await prisma.notification.count({ where: { profileId, status: "ARCHIVED" } }),
    ).toBeGreaterThan(0);
  });

  it("pagine par 20 et trie de la plus récente à la plus ancienne", async () => {
    const data = await getNotifications(userId, { page: "1", filter: "ALL" });
    expect(data).not.toBeNull();
    if (!data) return;
    expect(data.notifications).toHaveLength(20);
    expect(data.pageCount).toBeGreaterThan(1);
    const timestamps = data.notifications.map((notification) =>
      new Date(notification.createdAt).getTime(),
    );
    expect(timestamps).toEqual([...timestamps].sort((left, right) => right - left));
  });

  it("gère lecture, ouverture et suppression sans accès inter-utilisateur", async () => {
    const own = await prisma.notification.create({
      data: {
        profileId,
        title: "Notification privée",
        description: "Appartient au compte courant.",
        type: "GOAL",
        priority: "MEDIUM",
        actionUrl: "/goals",
      },
    });
    const foreign = await prisma.notification.create({
      data: {
        profileId: otherProfileId,
        title: "Notification étrangère",
        description: "Ne doit jamais être modifiée par le compte courant.",
        type: "SECURITY",
        priority: "HIGH",
      },
    });

    expect((await markNotificationRead(foreign.id)).success).toBe(false);
    expect((await deleteNotification(foreign.id)).success).toBe(false);
    expect((await markNotificationRead(own.id)).success).toBe(true);
    expect((await markNotificationRead(own.id)).success).toBe(true);
    expect((await prisma.notification.findUniqueOrThrow({ where: { id: own.id } })).status).toBe(
      "READ",
    );
    const opened = await openNotification(own.id);
    expect(opened).toEqual({ success: true, data: { destination: "/goals" } });
    expect((await deleteNotification(own.id)).success).toBe(true);
    expect(await prisma.notification.findUnique({ where: { id: own.id } })).toBeNull();
    expect((await markAllNotificationsRead()).success).toBe(true);
  });

  it("enregistre les préférences Push et conserve la sécurité obligatoire", async () => {
    const preferences = await updateNotificationPreferences({
      goalProgressPush: false,
      recommendationsPush: true,
      weeklySummaryPush: false,
    });
    expect(preferences.success).toBe(true);

    const enabled = await enablePushNotifications({
      endpoint: `https://fcm.googleapis.com/fcm/send/${randomUUID()}`,
      expirationTime: null,
      keys: {
        p256dh: "A".repeat(88),
        auth: "B".repeat(24),
      },
    });
    expect(enabled.success).toBe(true);
    const saved = await prisma.notificationPreference.findUniqueOrThrow({
      where: { profileId },
    });
    expect(saved).toMatchObject({
      goalProgressPush: false,
      recommendationsPush: true,
      weeklySummaryPush: false,
      pushEnabled: true,
    });
    expect(await prisma.pushSubscription.count({ where: { profileId } })).toBe(1);

    expect((await disablePushNotifications()).success).toBe(true);
    expect(await prisma.pushSubscription.count({ where: { profileId } })).toBe(0);
    expect(
      (await prisma.notificationPreference.findUniqueOrThrow({ where: { profileId } })).pushEnabled,
    ).toBe(false);
  });

  it("génère un seul résumé par semaine avec la devise du profil", async () => {
    const now = new Date("2026-08-12T12:00:00.000Z");
    const firstId = await ensureWeeklySummary(userId, now);
    const secondId = await ensureWeeklySummary(userId, now);
    expect(firstId).not.toBeNull();
    if (!firstId) return;
    expect(secondId).toBe(firstId);
    const summary = await prisma.notification.findUniqueOrThrow({ where: { id: firstId } });
    expect(summary.description).toContain("€");
    expect(
      await prisma.notification.count({
        where: { profileId, dedupeKey: summary.dedupeKey },
      }),
    ).toBe(1);
  });

  it("supprime définitivement toutes les notifications du compte uniquement", async () => {
    const response = await deleteAllNotifications();
    expect(response.success).toBe(true);
    expect(await prisma.notification.count({ where: { profileId } })).toBe(0);
    expect(await prisma.notification.count({ where: { profileId: otherProfileId } })).toBe(1);
  });
});
