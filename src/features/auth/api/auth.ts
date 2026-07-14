import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/shared/api/database";
import { sendAuthEmail } from "@/shared/api/email";
import { serverEnv } from "@/shared/config";
import { hashPassword, verifyPassword } from "../lib/password";

const hasEmailProvider = Boolean(serverEnv.RESEND_API_KEY);

export const auth = betterAuth({
  appName: "Vintra",
  baseURL: serverEnv.BETTER_AUTH_URL,
  secret: serverEnv.BETTER_AUTH_SECRET,
  trustedOrigins: [serverEnv.BETTER_AUTH_URL],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  user: {
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
    requireEmailVerification: hasEmailProvider,
    revokeSessionsOnPasswordReset: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    sendResetPassword: async ({ user, url }) => {
      void sendAuthEmail({
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
    sendVerificationEmail: async ({ user, url }) => {
      void sendAuthEmail({
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
