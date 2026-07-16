"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { calculateGoalPlan, calculateGoalProgress } from "@/entities/goal";
import {
  createGoalProgressNotifications,
  safelyDeliverPendingPushNotifications,
} from "@/entities/notification/server";
import { getSession } from "@/features/auth/server";
import type { ApiResponse } from "@/shared/api";
import { prisma, type Prisma } from "@/shared/api/database";
import { goalInputSchema, savingsContributionInputSchema } from "../model/goal-schema";

const idSchema = z.string().uuid();

export async function createGoal(input: unknown): Promise<ApiResponse<{ id: string }>> {
  const context = await getContext();
  if (!context.success) return context;
  const parsed = goalInputSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error.issues[0]?.message);

  try {
    const goal = await prisma.$transaction(
      async (transaction) => {
        const profile = await transaction.profile.findUnique({
          where: { userId: context.data.userId },
          include: {
            financialProfiles: { orderBy: { createdAt: "desc" }, take: 1 },
            goals: { where: { status: "ACTIVE" }, select: { id: true }, take: 1 },
          },
        });
        const financial = profile?.financialProfiles[0];
        if (!profile?.onboardingCompleted || !financial) throw new Error("PROFILE_INCOMPLETE");
        const currentAmount = profile.currentSavings?.toNumber() ?? 0;
        const targetDate = toDate(parsed.data.targetDate);
        const plan = calculateGoalPlan({
          targetAmount: parsed.data.targetAmount,
          currentAmount,
          targetDate,
          savingCapacity: financial.savingCapacity.toNumber(),
          profileType: financial.profileType,
        });
        const isPlanned = profile.goals.length > 0;
        const created = await transaction.goal.create({
          data: {
            profileId: profile.id,
            ...parsed.data,
            targetDate,
            currentAmount,
            progress: plan.progress,
            status: isPlanned ? "PLANNED" : plan.status,
          },
        });
        if (!isPlanned) {
          await transaction.savingPlan.create({
            data: {
              profileId: profile.id,
              goalId: created.id,
              recommendedMonthlySaving: plan.recommendedMonthlySaving,
              estimatedCompletionDate: plan.estimatedCompletionDate,
              difficulty: plan.difficulty,
              progress: plan.progress,
              status: plan.status,
              milestones: plan.milestones,
            },
          });
          if (plan.status === "COMPLETED") {
            await createGoalProgressNotifications(transaction, {
              profileId: profile.id,
              goalId: created.id,
              goalTitle: created.title,
              previousProgress: 0,
              currentProgress: plan.progress,
              completed: true,
              includeMilestones: false,
            });
          }
        }
        return created;
      },
      { isolationLevel: "Serializable" },
    );
    await safelyDeliverPendingPushNotifications(context.data.userId);
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
          profile: {
            include: { financialProfiles: { orderBy: { createdAt: "desc" }, take: 1 } },
          },
        },
      });
      const financial = goal?.profile.financialProfiles[0];
      if (!goal || !financial) throw new Error("GOAL_NOT_FOUND");
      const targetDate = toDate(parsed.data.targetDate);
      const currentAmount =
        goal.status === "PLANNED"
          ? (goal.profile.currentSavings?.toNumber() ?? 0)
          : goal.currentAmount.toNumber();
      const plan = calculateGoalPlan({
        targetAmount: parsed.data.targetAmount,
        currentAmount,
        targetDate,
        savingCapacity: financial.savingCapacity.toNumber(),
        profileType: financial.profileType,
      });
      if (goal.status === "PLANNED") {
        await transaction.goal.update({
          where: { id: goal.id },
          data: {
            title: parsed.data.title,
            description: parsed.data.description,
            targetAmount: parsed.data.targetAmount,
            targetDate,
            currentAmount,
            progress: plan.progress,
          },
        });
        return;
      }
      if (plan.status === "ACTIVE" && goal.status !== "ACTIVE") {
        const otherActiveGoal = await transaction.goal.findFirst({
          where: { profileId: goal.profileId, status: "ACTIVE", id: { not: goal.id } },
          select: { id: true },
        });
        if (otherActiveGoal) throw new Error("ACTIVE_GOAL_EXISTS");
        await transaction.savingPlan.updateMany({
          where: { profileId: goal.profileId, status: "ACTIVE" },
          data: { status: "CANCELLED" },
        });
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
        where: { goalId: goal.id, status: { in: ["ACTIVE", "COMPLETED"] } },
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
        await transaction.savingPlan.create({
          data: { profileId: goal.profileId, goalId: goal.id, ...planData },
        });
      await createGoalProgressNotifications(transaction, {
        profileId: goal.profileId,
        goalId: goal.id,
        goalTitle: parsed.data.title,
        previousProgress: goal.progress.toNumber(),
        currentProgress: plan.progress,
        completed: plan.status === "COMPLETED",
      });
    });
    await safelyDeliverPendingPushNotifications(context.data.userId);
    refresh(parsed.data.id);
    return { success: true, data: { id: parsed.data.id } };
  } catch {
    return {
      success: false,
      error: { code: "GOAL_UPDATE_FAILED", message: "L’objectif n’a pas pu être modifié." },
    };
  }
}

export async function setPrimaryGoal(input: unknown): Promise<ApiResponse<{ id: string }>> {
  const context = await getContext();
  if (!context.success) return context;
  const parsedId = idSchema.safeParse(input);
  if (!parsedId.success) return validationError();

  try {
    const goal = await prisma.$transaction(
      async (transaction) => {
        const plannedGoal = await transaction.goal.findFirst({
          where: {
            id: parsedId.data,
            status: "PLANNED",
            profile: { userId: context.data.userId },
          },
          include: {
            profile: {
              include: { financialProfiles: { orderBy: { createdAt: "desc" }, take: 1 } },
            },
          },
        });
        const financial = plannedGoal?.profile.financialProfiles[0];
        if (!plannedGoal || !financial) throw new Error("GOAL_NOT_PLANNED");

        const currentAmount = plannedGoal.profile.currentSavings?.toNumber() ?? 0;
        const plan = calculateGoalPlan({
          targetAmount: plannedGoal.targetAmount.toNumber(),
          currentAmount,
          targetDate: plannedGoal.targetDate,
          savingCapacity: financial.savingCapacity.toNumber(),
          profileType: financial.profileType,
        });

        await transaction.goal.updateMany({
          where: { profileId: plannedGoal.profileId, status: "ACTIVE" },
          data: { status: "PLANNED" },
        });
        await transaction.savingPlan.updateMany({
          where: { profileId: plannedGoal.profileId, status: "ACTIVE" },
          data: { status: "CANCELLED" },
        });
        const promoted = await transaction.goal.update({
          where: { id: plannedGoal.id },
          data: { currentAmount, progress: plan.progress, status: plan.status },
        });
        await transaction.savingPlan.create({
          data: {
            profileId: plannedGoal.profileId,
            goalId: plannedGoal.id,
            recommendedMonthlySaving: plan.recommendedMonthlySaving,
            estimatedCompletionDate: plan.estimatedCompletionDate,
            difficulty: plan.difficulty,
            progress: plan.progress,
            status: plan.status,
            milestones: plan.milestones,
          },
        });
        if (plan.status === "COMPLETED") {
          await createGoalProgressNotifications(transaction, {
            profileId: plannedGoal.profileId,
            goalId: plannedGoal.id,
            goalTitle: plannedGoal.title,
            previousProgress: 0,
            currentProgress: plan.progress,
            completed: true,
            includeMilestones: false,
          });
        }
        return promoted;
      },
      { isolationLevel: "Serializable" },
    );
    await safelyDeliverPendingPushNotifications(context.data.userId);
    refresh(goal.id);
    return { success: true, data: { id: goal.id } };
  } catch {
    return {
      success: false,
      error: {
        code: "GOAL_PROMOTION_FAILED",
        message: "Cet objectif n’a pas pu devenir votre objectif principal.",
      },
    };
  }
}

export async function addSavingsContribution(input: unknown): Promise<
  ApiResponse<{
    completed: boolean;
    currentAmount: number;
    progress: number;
    targetAmount: number;
    title: string;
  }>
> {
  const context = await getContext();
  if (!context.success) return context;
  const parsed = savingsContributionInputSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error.issues[0]?.message);

  try {
    const result = await prisma.$transaction(
      async (transaction) => {
        const goal = await transaction.goal.findFirst({
          where: {
            id: parsed.data.goalId,
            status: "ACTIVE",
            profile: { userId: context.data.userId },
          },
          include: {
            profile: {
              include: { financialProfiles: { orderBy: { createdAt: "desc" }, take: 1 } },
            },
          },
        });
        const financial = goal?.profile.financialProfiles[0];
        if (!goal || !financial) throw new Error("GOAL_NOT_ACTIVE");

        const now = new Date();
        const currentAmount = money(goal.currentAmount.toNumber() + parsed.data.amount);
        const currentSavings = money(
          (goal.profile.currentSavings?.toNumber() ?? 0) + parsed.data.amount,
        );
        const plan = calculateGoalPlan(
          {
            targetAmount: goal.targetAmount.toNumber(),
            currentAmount,
            targetDate: goal.targetDate,
            savingCapacity: financial.savingCapacity.toNumber(),
            profileType: financial.profileType,
          },
          now,
        );

        await transaction.profile.update({
          where: { id: goal.profileId },
          data: { currentSavings, hasSavings: true },
        });
        await transaction.goal.update({
          where: { id: goal.id },
          data: { currentAmount, progress: plan.progress, status: plan.status },
        });
        await syncPlannedGoalProgress(transaction, goal.profileId, currentSavings);
        await transaction.savingsContribution.create({
          data: { profileId: goal.profileId, goalId: goal.id, amount: parsed.data.amount },
        });
        await transaction.savingsSnapshot.create({
          data: { profileId: goal.profileId, amount: currentSavings, recordedAt: now },
        });

        const activePlan = await transaction.savingPlan.findFirst({
          where: { goalId: goal.id, status: "ACTIVE" },
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
        if (activePlan) {
          await transaction.savingPlan.update({ where: { id: activePlan.id }, data: planData });
        } else {
          await transaction.savingPlan.create({
            data: { profileId: goal.profileId, goalId: goal.id, ...planData },
          });
        }

        await createGoalProgressNotifications(transaction, {
          profileId: goal.profileId,
          goalId: goal.id,
          goalTitle: goal.title,
          previousProgress: goal.progress.toNumber(),
          currentProgress: plan.progress,
          completed: plan.status === "COMPLETED",
        });
        await transaction.auditLog.create({
          data: { userId: context.data.userId, action: "SAVINGS_CONTRIBUTION_ADDED" },
        });

        return {
          completed: plan.status === "COMPLETED",
          currentAmount,
          progress: plan.progress,
          targetAmount: goal.targetAmount.toNumber(),
          title: goal.title,
        };
      },
      { isolationLevel: "Serializable" },
    );
    await safelyDeliverPendingPushNotifications(context.data.userId);
    refresh(parsed.data.goalId);
    revalidatePath(`/goals/${parsed.data.goalId}/epargne`);
    return { success: true, data: result };
  } catch {
    return {
      success: false,
      error: {
        code: "SAVINGS_CONTRIBUTION_FAILED",
        message: "Le versement n’a pas pu être ajouté. Réessayez dans un instant.",
      },
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
        where: { goalId: goal.id, status: { in: ["ACTIVE", "COMPLETED"] } },
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

function money(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function syncPlannedGoalProgress(
  database: Pick<Prisma.TransactionClient, "goal">,
  profileId: string,
  currentAmount: number,
) {
  const plannedGoals = await database.goal.findMany({
    where: { profileId, status: "PLANNED" },
    select: { id: true, targetAmount: true },
  });
  await Promise.all(
    plannedGoals.map((goal) =>
      database.goal.update({
        where: { id: goal.id },
        data: {
          currentAmount,
          progress: calculateGoalProgress(currentAmount, goal.targetAmount.toNumber()),
        },
      }),
    ),
  );
}
