"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { calculateGoalPlan } from "@/entities/goal";
import { getSession } from "@/features/auth/server";
import type { ApiResponse } from "@/shared/api";
import { prisma } from "@/shared/api/database";
import { goalInputSchema } from "../model/goal-schema";

const idSchema = z.string().uuid();

export async function createGoal(input: unknown): Promise<ApiResponse<{ id: string }>> {
  const context = await getContext();
  if (!context.success) return context;
  const parsed = goalInputSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error.issues[0]?.message);

  try {
    const goal = await prisma.$transaction(async (transaction) => {
      const profile = await transaction.profile.findUnique({
        where: { userId: context.data.userId },
        include: { financialProfiles: { orderBy: { createdAt: "desc" }, take: 1 } },
      });
      const financial = profile?.financialProfiles[0];
      if (!profile?.onboardingCompleted || !financial) throw new Error("PROFILE_INCOMPLETE");
      const targetDate = toDate(parsed.data.targetDate);
      const plan = calculateGoalPlan({
        targetAmount: parsed.data.targetAmount,
        currentAmount: profile.currentSavings?.toNumber() ?? 0,
        targetDate,
        savingCapacity: financial.savingCapacity.toNumber(),
        profileType: financial.profileType,
      });
      await transaction.goal.updateMany({
        where: { profileId: profile.id, status: "ACTIVE" },
        data: { status: "ARCHIVED" },
      });
      await transaction.savingPlan.updateMany({
        where: { profileId: profile.id, status: "ACTIVE" },
        data: { status: "CANCELLED" },
      });
      const created = await transaction.goal.create({
        data: {
          profileId: profile.id,
          ...parsed.data,
          targetDate,
          currentAmount: profile.currentSavings ?? 0,
          progress: plan.progress,
          status: plan.status,
        },
      });
      await transaction.savingPlan.create({
        data: {
          profileId: profile.id,
          recommendedMonthlySaving: plan.recommendedMonthlySaving,
          estimatedCompletionDate: plan.estimatedCompletionDate,
          difficulty: plan.difficulty,
          progress: plan.progress,
          status: plan.status,
          milestones: plan.milestones,
        },
      });
      return created;
    });
    refresh();
    return { success: true, data: { id: goal.id } };
  } catch {
    return {
      success: false,
      error: { code: "GOAL_CREATE_FAILED", message: "L’objectif n’a pas pu être créé." },
    };
  }
}

export async function updateGoal(input: unknown): Promise<ApiResponse<{ id: string }>> {
  const context = await getContext();
  if (!context.success) return context;
  const parsed = goalInputSchema.extend({ id: idSchema }).safeParse(input);
  if (!parsed.success) return validationError(parsed.error.issues[0]?.message);

  try {
    await prisma.$transaction(async (transaction) => {
      const goal = await transaction.goal.findFirst({
        where: {
          id: parsed.data.id,
          status: { not: "ARCHIVED" },
          profile: { userId: context.data.userId },
        },
        include: {
          profile: { include: { financialProfiles: { orderBy: { createdAt: "desc" }, take: 1 } } },
        },
      });
      const financial = goal?.profile.financialProfiles[0];
      if (!goal || !financial) throw new Error("GOAL_NOT_FOUND");
      const targetDate = toDate(parsed.data.targetDate);
      const plan = calculateGoalPlan({
        targetAmount: parsed.data.targetAmount,
        currentAmount: goal.currentAmount.toNumber(),
        targetDate,
        savingCapacity: financial.savingCapacity.toNumber(),
        profileType: financial.profileType,
      });
      if (plan.status === "ACTIVE" && goal.status !== "ACTIVE") {
        const otherActiveGoal = await transaction.goal.findFirst({
          where: { profileId: goal.profileId, status: "ACTIVE", id: { not: goal.id } },
          select: { id: true },
        });
        if (otherActiveGoal) throw new Error("ACTIVE_GOAL_EXISTS");
      }
      await transaction.goal.update({
        where: { id: goal.id },
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          targetAmount: parsed.data.targetAmount,
          targetDate,
          progress: plan.progress,
          status: plan.status,
        },
      });
      const activePlan = await transaction.savingPlan.findFirst({
        where: { profileId: goal.profileId, status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
      });
      const planData = {
        recommendedMonthlySaving: plan.recommendedMonthlySaving,
        estimatedCompletionDate: plan.estimatedCompletionDate,
        difficulty: plan.difficulty,
        progress: plan.progress,
        status: plan.status,
        milestones: plan.milestones,
      };
      if (activePlan)
        await transaction.savingPlan.update({ where: { id: activePlan.id }, data: planData });
      else
        await transaction.savingPlan.create({ data: { profileId: goal.profileId, ...planData } });
    });
    refresh(parsed.data.id);
    return { success: true, data: { id: parsed.data.id } };
  } catch {
    return {
      success: false,
      error: { code: "GOAL_UPDATE_FAILED", message: "L’objectif n’a pas pu être modifié." },
    };
  }
}

export async function archiveGoal(input: unknown): Promise<ApiResponse<{ destination: string }>> {
  return removeGoal(input, "archive");
}

export async function deleteGoal(input: unknown): Promise<ApiResponse<{ destination: string }>> {
  return removeGoal(input, "delete");
}

async function removeGoal(
  input: unknown,
  mode: "archive" | "delete",
): Promise<ApiResponse<{ destination: string }>> {
  const context = await getContext();
  if (!context.success) return context;
  const parsedId = idSchema.safeParse(input);
  if (!parsedId.success) return validationError();
  const goal = await prisma.goal.findFirst({
    where: { id: parsedId.data, profile: { userId: context.data.userId } },
  });
  if (!goal)
    return {
      success: false,
      error: { code: "GOAL_NOT_FOUND", message: "Cet objectif n’existe pas." },
    };
  await prisma.$transaction(async (transaction) => {
    if (mode === "archive")
      await transaction.goal.update({ where: { id: goal.id }, data: { status: "ARCHIVED" } });
    else await transaction.goal.delete({ where: { id: goal.id } });
    if (goal.status === "ACTIVE" || goal.status === "COMPLETED")
      await transaction.savingPlan.updateMany({
        where: { profileId: goal.profileId, status: { in: ["ACTIVE", "COMPLETED"] } },
        data: { status: "CANCELLED" },
      });
  });
  refresh();
  return { success: true, data: { destination: "/goals" } };
}

async function getContext(): Promise<ApiResponse<{ userId: string }>> {
  const session = await getSession();
  if (!session)
    return {
      success: false,
      error: { code: "AUTH_UNAUTHORIZED", message: "Votre session a expiré." },
    };
  if (!session.user.emailVerified)
    return {
      success: false,
      error: { code: "AUTH_EMAIL_NOT_VERIFIED", message: "Vérifiez votre adresse email." },
    };
  return { success: true, data: { userId: session.user.id } };
}

function toDate(value: string) {
  return new Date(`${value}-01T00:00:00.000Z`);
}
function validationError(
  message = "Certaines informations doivent être corrigées.",
): ApiResponse<never> {
  return { success: false, error: { code: "VALIDATION_ERROR", message } };
}
function refresh(id?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/goals");
  if (id) revalidatePath(`/goals/${id}`);
}
