"use server";

import type { ApiResponse } from "@/shared/api";
import { prisma } from "@/shared/api/database";
import { supportRequestSchema } from "../model/settings-schemas";
import { failure, getSettingsContext } from "./settings-context";

const REQUEST_WINDOW_MS = 10 * 60 * 1_000;
const MAX_REQUESTS_PER_WINDOW = 5;

export async function createSupportRequest(
  input: unknown,
): Promise<ApiResponse<{ created: true }>> {
  const context = await getSettingsContext();
  if (!context.success) return context;

  const parsed = supportRequestSchema.safeParse(input);
  if (!parsed.success) {
    return failure(
      "VALIDATION_ERROR",
      parsed.error.issues[0]?.message ?? "Vérifiez votre message.",
    );
  }

  try {
    const recentRequestCount = await prisma.supportRequest.count({
      where: {
        userId: context.data.userId,
        createdAt: { gte: new Date(Date.now() - REQUEST_WINDOW_MS) },
      },
    });
    if (recentRequestCount >= MAX_REQUESTS_PER_WINDOW) {
      return failure("RATE_LIMITED", "Trop de demandes ont été envoyées. Réessayez plus tard.");
    }

    await prisma.$transaction([
      prisma.supportRequest.create({
        data: {
          userId: context.data.userId,
          type: parsed.data.type,
          message: parsed.data.message,
        },
      }),
      prisma.auditLog.create({
        data: { userId: context.data.userId, action: "SUPPORT_REQUESTED" },
      }),
    ]);
  } catch {
    return failure("SUPPORT_REQUEST_FAILED", "Votre demande n’a pas pu être envoyée.");
  }

  return { success: true, data: { created: true } };
}
