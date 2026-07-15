"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getSession } from "@/features/auth/server";
import type { ApiResponse } from "@/shared/api";
import { prisma } from "@/shared/api/database";

const idSchema = z.string().uuid();

export async function markRecommendationOpened(input: unknown) {
  return changeStatus(input, "OPENED", ["GENERATED", "DISPLAYED"]);
}

export async function applyRecommendation(input: unknown) {
  return changeStatus(input, "APPLIED", ["GENERATED", "DISPLAYED", "OPENED"]);
}

export async function archiveRecommendation(input: unknown) {
  return changeStatus(input, "ARCHIVED", ["GENERATED", "DISPLAYED", "OPENED", "APPLIED"]);
}

async function changeStatus<Status extends "OPENED" | "APPLIED" | "ARCHIVED">(
  input: unknown,
  status: Status,
  allowed: Array<"GENERATED" | "DISPLAYED" | "OPENED" | "APPLIED">,
): Promise<ApiResponse<{ status: Status }>> {
  const session = await getSession();
  if (!session) return failure("AUTH_UNAUTHORIZED", "Votre session a expiré.");
  if (!session.user.emailVerified) {
    return failure("AUTH_EMAIL_NOT_VERIFIED", "Vérifiez votre adresse email.");
  }

  const id = idSchema.safeParse(input);
  if (!id.success) return failure("VALIDATION_ERROR", "Cette recommandation n’est pas valide.");

  const result = await prisma.recommendation.updateMany({
    where: {
      id: id.data,
      status: { in: allowed },
      profile: { userId: session.user.id },
    },
    data: { status },
  });

  if (result.count === 0) {
    const owned = await prisma.recommendation.findFirst({
      where: { id: id.data, profile: { userId: session.user.id } },
      select: { status: true },
    });

    if (!owned) return failure("RECOMMENDATION_NOT_FOUND", "Cette recommandation n’existe pas.");
    if (owned.status === status) return { success: true, data: { status } };
    return failure("INVALID_STATUS", "Cette action n’est plus disponible.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/recommendations");
  revalidatePath(`/recommendations/${id.data}`);

  return { success: true, data: { status } };
}

function failure(code: string, message: string): ApiResponse<never> {
  return { success: false, error: { code, message } };
}
