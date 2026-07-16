import "dotenv/config";

import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { auth } from "@/features/auth/server";
import { prisma } from "@/shared/api/database";
import { serverEnv } from "@/shared/config/server";

const suffix = randomUUID();
const email = `better-auth-settings-${suffix}@vintra.test`;
const initialPassword = "Initial1!";
const newPassword = "Nouveau2!";

describe.runIf(process.env.RUN_DATABASE_TESTS === "true")(
  "paramètres avec Better Auth réel",
  () => {
    beforeAll(async () => {
      await prisma.rateLimit.deleteMany();
    });

    afterAll(async () => {
      await prisma.user.deleteMany({ where: { email } });
      await prisma.rateLimit.deleteMany();
      await prisma.$disconnect();
    });

    it("crée deux sessions, les révoque, change le mot de passe et supprime le compte", async () => {
      const auditStart = new Date();
      const signUpResponse = await callAuth("/sign-up/email", {
        name: "Better Auth Settings",
        firstName: "Better",
        lastName: "Settings",
        email,
        password: initialPassword,
      });
      expect(signUpResponse.status).toBe(200);
      const firstCookie = getSessionCookie(signUpResponse);

      const signInResponse = await callAuth("/sign-in/email", {
        email,
        password: initialPassword,
        rememberMe: true,
      });
      expect(signInResponse.status).toBe(200);
      const secondCookie = getSessionCookie(signInResponse);

      const sessionsBefore = await callAuth("/list-sessions", undefined, secondCookie, "GET");
      expect(sessionsBefore.status).toBe(200);
      expect((await sessionsBefore.json()) as unknown[]).toHaveLength(2);

      const revokeResponse = await callAuth("/revoke-other-sessions", {}, secondCookie);
      expect(revokeResponse.status).toBe(200);
      const sessionsAfter = await callAuth("/list-sessions", undefined, secondCookie, "GET");
      expect((await sessionsAfter.json()) as unknown[]).toHaveLength(1);

      const staleSession = await callAuth("/list-sessions", undefined, firstCookie, "GET");
      expect(staleSession.status).toBe(401);

      const changePasswordResponse = await callAuth(
        "/change-password",
        {
          currentPassword: initialPassword,
          newPassword,
          revokeOtherSessions: true,
        },
        secondCookie,
      );
      expect(changePasswordResponse.status).toBe(200);
      const refreshedCookie = getSessionCookie(changePasswordResponse);

      const user = await prisma.user.findUniqueOrThrow({ where: { email } });
      expect(
        await prisma.notification.count({
          where: {
            profile: { userId: user.id },
            type: "SECURITY",
            title: "Nouvelle connexion",
          },
        }),
      ).toBeGreaterThanOrEqual(2);
      expect(
        await prisma.notification.count({
          where: {
            profile: { userId: user.id },
            type: "SECURITY",
            title: "Mot de passe modifié",
          },
        }),
      ).toBe(1);
      await prisma.supportRequest.create({
        data: {
          userId: user.id,
          type: "CONTACT",
          message: "Cette donnée doit être supprimée avec le compte utilisateur.",
        },
      });

      const deleteResponse = await callAuth(
        "/delete-user",
        { password: newPassword },
        refreshedCookie,
      );
      expect(deleteResponse.status).toBe(200);
      expect(await prisma.user.findUnique({ where: { id: user.id } })).toBeNull();
      expect(await prisma.supportRequest.count({ where: { userId: user.id } })).toBe(0);
      expect(
        await prisma.auditLog.count({
          where: {
            userId: null,
            action: "ACCOUNT_DELETED",
            createdAt: { gte: auditStart },
          },
        }),
      ).toBe(1);
    });

    it("conserve la limitation anti-abus dans PostgreSQL", async () => {
      const clientIp = `2001:db8:${suffix.slice(0, 4)}::1`;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const response = await callAuth(
          "/sign-in/email",
          { email: `unknown-${suffix}@vintra.test`, password: "Invalid1!" },
          undefined,
          "POST",
          clientIp,
        );
        expect(response.status).not.toBe(429);
      }

      const blockedResponse = await callAuth(
        "/sign-in/email",
        { email: `unknown-${suffix}@vintra.test`, password: "Invalid1!" },
        undefined,
        "POST",
        clientIp,
      );
      expect(blockedResponse.status).toBe(429);
      expect(await prisma.rateLimit.count()).toBeGreaterThan(0);
    });
  },
);

async function callAuth(
  path: string,
  body?: Record<string, unknown>,
  cookie?: string,
  method = "POST",
  clientIp?: string,
) {
  const headers = new Headers({ Origin: serverEnv.BETTER_AUTH_URL });
  if (body) headers.set("Content-Type", "application/json");
  if (cookie) headers.set("Cookie", cookie);
  if (clientIp) headers.set("X-Forwarded-For", clientIp);

  return auth.handler(
    new Request(`${serverEnv.BETTER_AUTH_URL}/api/auth${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }),
  );
}

function getSessionCookie(response: Response) {
  const setCookie = response.headers.get("set-cookie") ?? "";
  const match = /(?:__Secure-)?better-auth\.session_token=[^;,\s]+/.exec(setCookie);
  expect(match?.[0]).toBeTruthy();
  return match?.[0] ?? "";
}
