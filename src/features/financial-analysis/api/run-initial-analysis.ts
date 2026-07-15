import { z } from "zod";

import { calculateFinancialAnalysis, type AnalysisInput } from "@/entities/financial-profile";
import { generateRecommendations } from "@/entities/recommendation";
import { prisma } from "@/shared/api/database";

const analysisProfileSchema = z.object({
  incomeFrequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY", "VARIABLE"]),
  monthlyIncome: z.number().finite().min(0),
  additionalIncome: z.number().finite().min(0),
  housingExpense: z.number().finite().min(0),
  foodExpense: z.number().finite().min(0),
  transportExpense: z.number().finite().min(0),
  restaurantExpense: z.number().finite().min(0),
  shoppingExpense: z.number().finite().min(0),
  hobbyExpense: z.number().finite().min(0),
  subscriptionExpense: z.number().finite().min(0),
  impulsePurchase: z.enum(["NEVER", "RARELY", "SOMETIMES", "OFTEN", "VERY_OFTEN", "ALWAYS"]),
  bankCheckFrequency: z.enum([
    "DAILY",
    "SEVERAL_TIMES_A_WEEK",
    "WEEKLY",
    "A_FEW_TIMES_A_MONTH",
    "RARELY",
  ]),
  hasBudget: z.boolean(),
  budgetCompliance: z
    .enum(["NEVER", "RARELY", "SOMETIMES", "OFTEN", "VERY_OFTEN", "ALWAYS"])
    .nullable(),
  installmentUsage: z.enum(["NEVER", "RARELY", "SOMETIMES", "OFTEN"]),
  endOfMonthDifficulty: z.enum(["NEVER", "RARELY", "SOMETIMES", "OFTEN", "EVERY_MONTH"]),
  currentSavings: z.number().finite().min(0),
  monthlySavings: z.number().finite().min(0),
  goalReason: z.enum(["EMERGENCY_FUND", "CAR", "HOME", "TRAVEL", "PROJECT", "FUTURE", "OTHER"]),
  goalTargetAmount: z.number().finite().min(100),
  goalTargetDate: z.date(),
});

const GOAL_TITLES = {
  EMERGENCY_FUND: "Construire mon fonds de sécurité",
  CAR: "Financer mon véhicule",
  HOME: "Préparer mon projet immobilier",
  TRAVEL: "Financer mon voyage",
  PROJECT: "Réaliser mon projet",
  FUTURE: "Préparer mon avenir",
  OTHER: "Atteindre mon objectif d’épargne",
} as const;

export async function runInitialAnalysis(userId: string) {
  return prisma.$transaction(async (transaction) => {
    const profile = await transaction.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error("PROFILE_NOT_FOUND");

    if (profile.onboardingCompleted) {
      const existingAnalysis = await transaction.financialProfile.findFirst({
        where: { profileId: profile.id },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      const existingGoal = await transaction.goal.findFirst({
        where: { profileId: profile.id, status: { in: ["ACTIVE", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      const existingPlan = await transaction.savingPlan.findFirst({
        where: { profileId: profile.id, status: { in: ["ACTIVE", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      if (existingAnalysis && existingGoal && existingPlan) {
        return { analysisId: existingAnalysis.id, goalId: existingGoal.id, alreadyCompleted: true };
      }
    }

    const parsedProfile = analysisProfileSchema.safeParse({
      incomeFrequency: profile.incomeFrequency,
      monthlyIncome: profile.monthlyIncome?.toNumber(),
      additionalIncome: profile.additionalIncome?.toNumber() ?? 0,
      housingExpense: profile.housingExpense?.toNumber(),
      foodExpense: profile.foodExpense?.toNumber(),
      transportExpense: profile.transportExpense?.toNumber(),
      restaurantExpense: profile.restaurantExpense?.toNumber(),
      shoppingExpense: profile.shoppingExpense?.toNumber(),
      hobbyExpense: profile.hobbyExpense?.toNumber(),
      subscriptionExpense: profile.subscriptionExpense?.toNumber(),
      impulsePurchase: profile.impulsePurchase,
      bankCheckFrequency: profile.bankCheckFrequency,
      hasBudget: profile.hasBudget,
      budgetCompliance: profile.budgetCompliance,
      installmentUsage: profile.installmentUsage,
      endOfMonthDifficulty: profile.endOfMonthDifficulty,
      currentSavings: profile.currentSavings?.toNumber() ?? 0,
      monthlySavings: profile.monthlySavings?.toNumber(),
      goalReason: profile.goalReason,
      goalTargetAmount: profile.goalTargetAmount?.toNumber(),
      goalTargetDate: profile.goalTargetDate,
    });
    if (!parsedProfile.success) throw new Error("ONBOARDING_INCOMPLETE");

    const { goalReason, ...input } = parsedProfile.data;
    const analysisInput: AnalysisInput = input;
    const now = new Date();
    const analysis = calculateFinancialAnalysis(analysisInput, now);
    const recommendations = generateRecommendations({ input: analysisInput, analysis });

    await transaction.goal.updateMany({
      where: { profileId: profile.id, status: "ACTIVE" },
      data: { status: "ARCHIVED" },
    });
    await transaction.savingPlan.updateMany({
      where: { profileId: profile.id, status: "ACTIVE" },
      data: { status: "CANCELLED" },
    });
    await transaction.recommendation.updateMany({
      where: { profileId: profile.id, status: { not: "ARCHIVED" } },
      data: { status: "ARCHIVED" },
    });

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

    const goalStatus = analysis.goalProgress >= 100 ? "COMPLETED" : "ACTIVE";
    const goal = await transaction.goal.create({
      data: {
        profileId: profile.id,
        title: GOAL_TITLES[goalReason],
        targetAmount: input.goalTargetAmount,
        currentAmount: input.currentSavings,
        targetDate: input.goalTargetDate,
        progress: analysis.goalProgress,
        status: goalStatus,
      },
    });

    await transaction.savingsSnapshot.create({
      data: {
        profileId: profile.id,
        amount: input.currentSavings,
        recordedAt: now,
      },
    });

    await transaction.savingPlan.create({
      data: {
        profileId: profile.id,
        recommendedMonthlySaving: analysis.recommendedMonthlySaving,
        estimatedCompletionDate: analysis.estimatedCompletionDate,
        difficulty: analysis.difficulty,
        progress: analysis.goalProgress,
        status: goalStatus === "COMPLETED" ? "COMPLETED" : "ACTIVE",
        milestones: [25, 50, 75, 100].map((threshold) => ({
          threshold,
          reached: analysis.goalProgress >= threshold,
        })),
      },
    });

    if (recommendations.length > 0) {
      await transaction.recommendation.createMany({
        data: recommendations.map((recommendation) => ({
          profileId: profile.id,
          ...recommendation,
        })),
      });
    }

    await transaction.profile.update({
      where: { id: profile.id },
      data: { onboardingCompleted: true },
    });

    return { analysisId: financialProfile.id, goalId: goal.id, alreadyCompleted: false };
  });
}
