import "dotenv/config";

import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const userId = randomUUID();
type MockSession = {
  id: string;
  token: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
};
const mocks = vi.hoisted(() => ({
  changePassword: vi.fn(async () => ({ token: null })),
  deleteUser: vi.fn(async () => ({ success: true })),
  listSessions: vi.fn(async (): Promise<MockSession[]> => []),
  revokeOtherSessions: vi.fn(async () => ({ status: true })),
  revokeSessions: vi.fn(async () => ({ status: true })),
  cookieSet: vi.fn(),
}));

vi.mock("@/features/auth/server", () => ({
  getSession: vi.fn(async () => ({
    user: { id: userId, emailVerified: true },
    session: { token: "current-token" },
  })),
  auth: {
    api: {
      changePassword: mocks.changePassword,
      deleteUser: mocks.deleteUser,
      listSessions: mocks.listSessions,
      revokeOtherSessions: mocks.revokeOtherSessions,
      revokeSessions: mocks.revokeSessions,
    },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({ set: mocks.cookieSet })),
  headers: vi.fn(async () => new Headers()),
}));

import { prisma } from "@/shared/api/database";
import { deleteAccount } from "./account-actions";
import { createAccountExport } from "./create-account-export";
import { getSecuritySettings, getSettingsOverview } from "./get-settings";
import { removeAvatar, updateAvatar, updatePersonalSettings } from "./personal-settings-actions";
import { updatePreferences } from "./preferences-actions";
import { changePassword, revokeAllSessions, revokeOtherSessions } from "./security-actions";
import { createSupportRequest } from "./support-actions";

describe.runIf(process.env.RUN_DATABASE_TESTS === "true")("paramètres avec PostgreSQL", () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: userId,
        name: "Settings Test",
        firstName: "Settings",
        lastName: "Test",
        email: `settings-${userId}@vintra.test`,
        emailVerified: true,
        profile: {
          create: {
            birthDate: new Date("1990-01-01"),
            country: "France",
            profession: "EMPLOYEE",
            onboardingCompleted: true,
          },
        },
        accounts: {
          create: {
            accountId: userId,
            providerId: "credential",
            password: "password-hash-that-must-not-be-exported",
          },
        },
        sessions: {
          create: {
            token: `private-token-${userId}`,
            expiresAt: new Date(Date.now() + 86_400_000),
            ipAddress: "192.168.1.10",
            userAgent: "Settings integration test",
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it("modifie le profil, les préférences et l’avatar avec une trace d’audit", async () => {
    const profileResponse = await updatePersonalSettings({
      firstName: "Camille",
      lastName: "Martin",
      birthDate: "1988-06-15",
      country: "Belgique",
      profession: "FREELANCER",
    });
    expect(profileResponse.success).toBe(true);

    const preferencesResponse = await updatePreferences({
      locale: "FR",
      currency: "CHF",
      theme: "LIGHT",
    });
    expect(preferencesResponse.success).toBe(true);
    expect(mocks.cookieSet).toHaveBeenCalledTimes(2);

    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);
    const avatarResponse = await updateAvatar({
      dataUrl: `data:image/png;base64,${pngSignature.toString("base64")}`,
    });
    expect(avatarResponse.success).toBe(true);
    expect((await removeAvatar()).success).toBe(true);

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { profile: true, auditLogs: true },
    });
    expect(user.firstName).toBe("Camille");
    expect(user.image).toBeNull();
    expect(user.profile?.currency).toBe("CHF");
    expect(user.profile?.theme).toBe("LIGHT");
    expect(user.auditLogs.map((log) => log.action)).toEqual(
      expect.arrayContaining(["PROFILE_UPDATED", "PREFERENCES_UPDATED", "AVATAR_UPDATED"]),
    );
    expect(
      await prisma.notification.count({
        where: { profile: { userId }, title: "Situation professionnelle mise à jour" },
      }),
    ).toBe(1);
  });

  it("enregistre une demande de support validée", async () => {
    const response = await createSupportRequest({
      type: "BUG",
      message: "La courbe ne s’affiche pas après une actualisation complète.",
    });
    expect(response.success).toBe(true);
    expect(await prisma.supportRequest.count({ where: { userId, type: "BUG" } })).toBe(1);
  });

  it("exporte les données sans mot de passe ni jeton de session", async () => {
    const exportProfile = await prisma.profile.findUniqueOrThrow({ where: { userId } });
    await prisma.notificationPreference.upsert({
      where: { profileId: exportProfile.id },
      create: { profileId: exportProfile.id },
      update: {},
    });
    await prisma.pushSubscription.create({
      data: {
        profileId: exportProfile.id,
        endpoint: `https://push.vintra.test/private-${userId}`,
        p256dh: `private-p256dh-${userId}`,
        auth: `private-auth-${userId}`,
        userAgent: "Settings integration test",
      },
    });
    const profileExport = await createAccountExport(userId, "profile");
    const fullExport = await createAccountExport(userId, "full");
    expect(profileExport).not.toBeNull();
    expect(fullExport).not.toBeNull();
    if (!profileExport || !fullExport) return;

    expect("analyses" in profileExport).toBe(false);
    expect("notifications" in fullExport).toBe(true);
    expect(fullExport.sessions).toHaveLength(1);
    expect(fullExport.notifications ?? []).not.toHaveLength(0);
    expect(fullExport.notificationPreferences).not.toBeNull();
    expect(fullExport.pushDevices).toHaveLength(1);
    const serialized = JSON.stringify(fullExport);
    expect(serialized).not.toContain("password-hash-that-must-not-be-exported");
    expect(serialized).not.toContain(`private-token-${userId}`);
    expect(serialized).not.toContain(`https://push.vintra.test/private-${userId}`);
    expect(serialized).not.toContain(`private-p256dh-${userId}`);
    expect(serialized).not.toContain(`private-auth-${userId}`);
  });

  it("branche les opérations Better Auth et refuse une suppression mal confirmée", async () => {
    expect(
      (
        await changePassword({
          currentPassword: "Ancien1!",
          newPassword: "Nouveau1!",
          confirmPassword: "Nouveau1!",
        })
      ).success,
    ).toBe(true);
    expect((await revokeOtherSessions()).success).toBe(true);
    expect((await revokeAllSessions()).success).toBe(true);
    expect(mocks.changePassword).toHaveBeenCalledOnce();
    expect(
      await prisma.notification.count({
        where: { profile: { userId }, type: "SECURITY", title: "Mot de passe modifié" },
      }),
    ).toBe(1);
    expect(mocks.revokeOtherSessions).toHaveBeenCalledOnce();
    expect(mocks.revokeSessions).toHaveBeenCalledOnce();

    const rejected = await deleteAccount({ confirmation: "supprimer", password: "Nouveau1!" });
    expect(rejected.success).toBe(false);
    expect(mocks.deleteUser).not.toHaveBeenCalled();

    const accepted = await deleteAccount({ confirmation: "SUPPRIMER", password: "Nouveau1!" });
    expect(accepted.success).toBe(true);
    expect(mocks.deleteUser).toHaveBeenCalledOnce();
  });

  it("retourne la vue du compte et masque les détails réseau des sessions", async () => {
    mocks.listSessions.mockResolvedValueOnce([
      {
        id: randomUUID(),
        token: "current-token",
        userId,
        ipAddress: "192.168.1.10",
        userAgent: "Mozilla/5.0 (Mac OS) Chrome/140",
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-01"),
        expiresAt: new Date("2026-12-31"),
      },
    ]);

    const overview = await getSettingsOverview(userId);
    const sessions = await getSecuritySettings("current-token");
    expect(overview?.profile.currency).toBe("CHF");
    expect(sessions[0]).toMatchObject({
      current: true,
      device: "Chrome · macOS",
      location: "192.168.…",
    });
  });
});
