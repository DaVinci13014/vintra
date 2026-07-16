"use server";

import { headers } from "next/headers";

import { auth } from "@/features/auth/server";
import type { ApiResponse } from "@/shared/api";
import { sendAccountDeletionFeedback } from "@/shared/api/email";
import { logger } from "@/shared/lib/logger";
import { ACCOUNT_DELETION_REASON_LABELS } from "../model/account-deletion";
import { deleteAccountSchema } from "../model/settings-schemas";
import { failure, getSettingsContext } from "./settings-context";

export async function deleteAccount(input: unknown): Promise<ApiResponse<{ destination: string }>> {
  const context = await getSettingsContext();
  if (!context.success) return context;

  const parsed = deleteAccountSchema.safeParse(input);
  if (!parsed.success) {
    return failure(
      "VALIDATION_ERROR",
      parsed.error.issues[0]?.message ?? "La confirmation est invalide.",
    );
  }

  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: { password: parsed.data.password },
    });
  } catch (error) {
    if (getErrorCode(error) === "INVALID_PASSWORD") {
      return failure("INVALID_PASSWORD", "Le mot de passe actuel est incorrect.");
    }
    return failure("ACCOUNT_DELETE_FAILED", "Le compte n’a pas pu être supprimé.");
  }

  try {
    await sendAccountDeletionFeedback({
      userEmail: context.data.email,
      reason: ACCOUNT_DELETION_REASON_LABELS[parsed.data.reason],
      feedback: parsed.data.feedback,
    });
  } catch (error) {
    logger.error({ error, userId: context.data.userId }, "account_deletion_feedback_email_failed");
  }

  return { success: true, data: { destination: "/" } };
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
