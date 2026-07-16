"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/features/auth/server";
import { createSecurityNotificationForUser } from "@/entities/notification/server";
import type { ApiResponse } from "@/shared/api";
import { prisma } from "@/shared/api/database";
import { changePasswordSchema } from "../model/settings-schemas";
import { failure, getSettingsContext } from "./settings-context";

export async function changePassword(input: unknown): Promise<ApiResponse<{ changed: true }>> {
  const context = await getSettingsContext();
  if (!context.success) return context;

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return failure(
      "VALIDATION_ERROR",
      parsed.error.issues[0]?.message ?? "Vérifiez les mots de passe.",
    );
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      },
    });
  } catch (error) {
    if (getErrorCode(error) === "INVALID_PASSWORD") {
      return failure("INVALID_PASSWORD", "Le mot de passe actuel est incorrect.");
    }
    return failure("PASSWORD_UPDATE_FAILED", "Le mot de passe n’a pas pu être modifié.");
  }
  await recordAudit(context.data.userId, "PASSWORD_CHANGED");
  await recordPasswordNotification(context.data.userId);

  revalidatePath("/settings/security");
  return { success: true, data: { changed: true } };
}

export async function revokeOtherSessions(): Promise<ApiResponse<{ revoked: true }>> {
  const context = await getSettingsContext();
  if (!context.success) return context;

  try {
    await auth.api.revokeOtherSessions({ headers: await headers() });
  } catch {
    return failure("SESSION_REVOCATION_FAILED", "Les autres sessions n’ont pas pu être fermées.");
  }
  await recordAudit(context.data.userId, "SESSIONS_REVOKED");

  revalidatePath("/settings/security");
  return { success: true, data: { revoked: true } };
}

export async function revokeAllSessions(): Promise<ApiResponse<{ revoked: true }>> {
  const context = await getSettingsContext();
  if (!context.success) return context;

  try {
    await auth.api.revokeSessions({ headers: await headers() });
  } catch {
    return failure("SESSION_REVOCATION_FAILED", "Les sessions n’ont pas pu être fermées.");
  }
  await recordAudit(context.data.userId, "SESSIONS_REVOKED");

  return { success: true, data: { revoked: true } };
}

function getErrorCode(error: unknown) {
  if (!isRecord(error)) return null;
  if (typeof error.code === "string") return error.code;
  if (!isRecord(error.body)) return null;
  return typeof error.body.code === "string" ? error.body.code : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function recordAudit(userId: string, action: "PASSWORD_CHANGED" | "SESSIONS_REVOKED") {
  try {
    await prisma.auditLog.create({ data: { userId, action } });
  } catch {
    return false;
  }
  return true;
}

async function recordPasswordNotification(userId: string) {
  try {
    await createSecurityNotificationForUser({
      userId,
      title: "Mot de passe modifié",
      description: "Votre mot de passe Vintra vient d’être modifié.",
    });
  } catch {
    return false;
  }
  return true;
}
