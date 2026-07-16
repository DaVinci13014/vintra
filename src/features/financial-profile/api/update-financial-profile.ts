"use server";

import { revalidatePath } from "next/cache";

import { calculateFinancialAnalysis, type AnalysisInput } from "@/entities/financial-profile";
import { calculateGoalPlan, calculateGoalProgress } from "@/entities/goal";
import { generateRecommendations } from "@/entities/recommendation";
import {
  createGoalProgressNotifications,
  createProfileUpdatedNotification,
  createRecommendationNotification,
  safelyDeliverPendingPushNotifications,
} from "@/entities/notification/server";
import { getSession } from "@/features/auth/server";
import type { ApiResponse } from "@/shared/api";
import { prisma } from "@/shared/api/database";
import { financialProfileInputSchema } from "../model/financial-profile-schema";

export async function updateFinancialProfile(
  input: unknown,
): Promise<ApiResponse<{ destination: string }>> {
  const session = await getSession();
  if (!session) return failure("AUTH_UNAUTHORIZED", "Votre session a expiré.");
  if (!session.user.emailVerified)
    return failure("AUTH_EMAIL_NOT_VERIFIED", "Vérifiez votre adresse email.");
  const parsed = financialProfileInputSchema.safeParse(input);
  if (!parsed.success)
    return failure("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Vérifiez les montants.");

  try {
    const updated = await prisma.$transaction(async (transaction) => {
      const previous = await transaction.profile.findUnique({ where: { userId: session.user.id } });
      if (!previous?.onboardingCompleted) throw new Error("PROFILE_INCOMPLETE");
      if (!hasFinancialChanges(previous, parsed.data)) return false;
      const profile = await transaction.profile.update({
        where: { id: previous.id },
        data: {
          ...parsed.data,
          hasAdditionalIncome: parsed.data.additionalIncome > 0,
          hasSavings: parsed.data.currentSavings > 0,
        },
      });
      const goal = await transaction.goal.findFirst({
        where: { profileId: profile.id, status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
      });
      const fallbackDate = new Date();
      fallbackDate.setUTCFullYear(fallbackDate.getUTCFullYear() + 1);
      const goalTargetAmount =
        goal?.targetAmount.toNumber() ?? Math.max(100, profile.goalTargetAmount?.toNumber() ?? 100);
      const goalTargetDate = goal?.targetDate ?? profile.goalTargetDate ?? fallbackDate;
      const analysisInput: AnalysisInput = {
        ...parsed.data,
        impulsePurchase: requireValue(profile.impulsePurchase),
        bankCheckFrequency: requireValue(profile.bankCheckFrequency),
        hasBudget: profile.hasBudget ?? false,
        budgetCompliance: profile.budgetCompliance,
        installmentUsage: requireValue(profile.installmentUsage),
        endOfMonthDifficulty: requireValue(profile.endOfMonthDifficulty),
        goalTargetAmount,
        goalTargetDate,
      };
      const now = new Date();
      const analysis = calculateFinancialAnalysis(analysisInput, now);
      const recommendations = generateRecommendations({ input: analysisInput, analysis });
      const financialProfile = await transaction.financialProfile.create({
        data: {
          profileId: profile.id,
          profileType: analysis.profileType,
          budgetScore: analysis.budgetScore,
          savingScore: analysis.savingScore,
          disciplineScore: analysis.disciplineScore,
          financialHealthScore: analysis.financialHealthScore,
          monthlyIncome: analysis.monthlyIncome,
          monthlyExpenses: analysis.monthlyExpenses,
          savingCapacity: analysis.savingCapacity,
          savingRate: analysis.savingRate,
          remainingBudget: analysis.remainingBudget,
        },
      });
      if (previous.currentSavings?.toNumber() !== parsed.data.currentSavings)
        await transaction.savingsSnapshot.create({
          data: { profileId: profile.id, amount: parsed.data.currentSavings, recordedAt: now },
        });
      await transaction.recommendation.updateMany({
        where: { profileId: profile.id, status: { not: "ARCHIVED" } },
        data: { status: "ARCHIVED" },
      });
      if (recommendations.length)
        await transaction.recommendation.createMany({
          data: recommendations.map((recommendation) => ({
            profileId: profile.id,
            ...recommendation,
          })),
        });
      await createProfileUpdatedNotification(transaction, {
        profileId: profile.id,
        sourceId: financialProfile.id,
      });
      await createRecommendationNotification(transaction, {
        profileId: profile.id,
        sourceId: financialProfile.id,
        count: recommendations.length,
      });
      if (goal) {
        const plan = calculateGoalPlan(
          {
            targetAmount: goal.targetAmount.toNumber(),
            currentAmount: parsed.data.currentSavings,
            targetDate: goal.targetDate,
            savingCapacity: analysis.savingCapacity,
            profileType: analysis.profileType,
          },
          now,
        );
        await transaction.goal.update({
          where: { id: goal.id },
          data: {
            currentAmount: parsed.data.currentSavings,
            progress: plan.progress,
            status: plan.status,
          },
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
        if (activePlan)
          await transaction.savingPlan.update({ where: { id: activePlan.id }, data: planData });
        else
          await transaction.savingPlan.create({
            data: { profileId: profile.id, goalId: goal.id, ...planData },
          });
        await createGoalProgressNotifications(transaction, {
          profileId: profile.id,
          goalId: goal.id,
          goalTitle: goal.title,
          previousProgress: goal.progress.toNumber(),
          currentProgress: plan.progress,
          completed: plan.status === "COMPLETED",
        });
      }
      const plannedGoals = await transaction.goal.findMany({
        where: { profileId: profile.id, status: "PLANNED" },
        select: { id: true, targetAmount: true },
      });
      await Promise.all(
        plannedGoals.map((plannedGoal) =>
          transaction.goal.update({
            where: { id: plannedGoal.id },
            data: {
              currentAmount: parsed.data.currentSavings,
              progress: calculateGoalProgress(
                parsed.data.currentSavings,
                plannedGoal.targetAmount.toNumber(),
              ),
            },
          }),
        ),
      );
      await transaction.auditLog.create({
        data: { userId: session.user.id, action: "PROFILE_UPDATED" },
      });
      return true;
    });
    if (updated) await safelyDeliverPendingPushNotifications(session.user.id);
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    revalidatePath("/settings/profile/finances");
    revalidatePath("/goals");
    return { success: true, data: { destination: "/dashboard" } };
  } catch {
    return failure("PROFILE_UPDATE_FAILED", "Le profil financier n’a pas pu être mis à jour.");
  }
}

function requireValue<Value>(value: Value | null): Value {
  if (value === null) throw new Error("PROFILE_INCOMPLETE");
  return value;
}
function failure(code: string, message: string): ApiResponse<never> {
  return { success: false, error: { code, message } };
}
function hasFinancialChanges(
  profile: {
    incomeFrequency: string | null;
    monthlyIncome: { toNumber(): number } | null;
    additionalIncome: { toNumber(): number } | null;
    housingExpense: { toNumber(): number } | null;
    foodExpense: { toNumber(): number } | null;
    transportExpense: { toNumber(): number } | null;
    restaurantExpense: { toNumber(): number } | null;
    shoppingExpense: { toNumber(): number } | null;
    hobbyExpense: { toNumber(): number } | null;
    subscriptionExpense: { toNumber(): number } | null;
    currentSavings: { toNumber(): number } | null;
    monthlySavings: { toNumber(): number } | null;
  },
  input: ReturnType<typeof financialProfileInputSchema.parse>,
) {
  return (
    profile.incomeFrequency !== input.incomeFrequency ||
    (
      [
        "monthlyIncome",
        "additionalIncome",
        "housingExpense",
        "foodExpense",
        "transportExpense",
        "restaurantExpense",
        "shoppingExpense",
        "hobbyExpense",
        "subscriptionExpense",
        "currentSavings",
        "monthlySavings",
      ] as const
    ).some((key) => (profile[key]?.toNumber() ?? 0) !== input[key])
  );
}
