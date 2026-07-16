import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/shared/api/database";
import { createSecurityNotificationForUser } from "@/entities/notification/server";
import { sendAuthEmail } from "@/shared/api/email";
import { getApplicationUrl, getTrustedApplicationOrigins, serverEnv } from "@/shared/config/server";
import { hashPassword, verifyPassword } from "../lib/password";

const hasEmailProvider = Boolean(serverEnv.RESEND_API_KEY && serverEnv.EMAIL_FROM);
const applicationUrl = getApplicationUrl();

export const auth = betterAuth({
  appName: "Vintra",
  baseURL: applicationUrl,
  secret: serverEnv.BETTER_AUTH_SECRET,
  trustedOrigins: getTrustedApplicationOrigins(),
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  hooks: {
    before: createAuthMiddleware(async (context) => {
      if (context.path !== "/sign-up/email") {
        return;
      }

      const email =
        typeof context.body?.email === "string" ? context.body.email.trim().toLowerCase() : null;

      if (!email) {
        return;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingUser) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
          message: "Cette adresse email est déjà utilisée.",
        });
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.profile.upsert({
            where: { userId: user.id },
            update: {},
            create: { userId: user.id },
          });
        },
      },
    },
    account: {
      update: {
        after: async (account) => {
          if (account.providerId !== "credential") return;
          try {
            await createSecurityNotificationForUser({
              userId: account.userId,
              title: "Mot de passe modifié",
              description: "Votre mot de passe Vintra vient d’être modifié.",
            });
          } catch {
            return;
          }
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          try {
            await createSecurityNotificationForUser({
              userId: session.userId,
              title: "Nouvelle connexion",
              description: "Une nouvelle session a été ouverte sur votre compte Vintra.",
              dedupeKey: `security:session:${session.id}`,
            });
          } catch {
            return;
          }
        },
      },
    },
  },
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        await prisma.auditLog.create({
          data: { userId: user.id, action: "ACCOUNT_DELETED" },
        });
      },
    },
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // La session est créée avant la vérification. Les fonctionnalités privées
    // restent verrouillées côté serveur jusqu'à ce que l'email soit confirmé.
    requireEmailVerification: false,
    revokeSessionsOnPasswordReset: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail({
        to: user.email,
        subject: "Réinitialiser votre mot de passe Vintra",
        heading: "Réinitialisez votre mot de passe",
        message: "Ce lien est personnel et expire automatiquement.",
        actionLabel: "Choisir un mot de passe",
        actionUrl: url,
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: hasEmailProvider && serverEnv.REQUIRE_EMAIL_VERIFICATION,
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthEmail({
        to: user.email,
        subject: "Vérifiez votre adresse email Vintra",
        heading: "Vérifiez votre adresse email",
        message: "Confirmez votre adresse pour sécuriser votre espace Vintra.",
        actionLabel: "Vérifier mon adresse",
        actionUrl: url,
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 3_600, max: 3 },
      "/request-password-reset": { window: 3_600, max: 5 },
    },
  },
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
