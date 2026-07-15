import { prisma } from "@/shared/api/database";

export async function createAccountExport(userId: string, scope: "profile" | "full") {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          birthDate: true,
          country: true,
          currency: true,
          locale: true,
          theme: true,
          profession: true,
          incomeType: true,
          incomeFrequency: true,
          monthlyIncome: true,
          hasAdditionalIncome: true,
          additionalIncome: true,
          housingExpense: true,
          foodExpense: true,
          transportExpense: true,
          restaurantExpense: true,
          shoppingExpense: true,
          hobbyExpense: true,
          subscriptionExpense: true,
          impulsePurchase: true,
          bankCheckFrequency: true,
          hasBudget: true,
          budgetCompliance: true,
          installmentUsage: true,
          endOfMonthDifficulty: true,
          hasSavings: true,
          currentSavings: true,
          monthlySavings: true,
          goalReason: true,
          goalTargetAmount: true,
          goalTargetDate: true,
          goalPriority: true,
          onboardingCompleted: true,
          createdAt: true,
          updatedAt: true,
          financialProfiles: { orderBy: { createdAt: "asc" } },
          goals: { orderBy: { createdAt: "asc" } },
          savingPlans: { orderBy: { createdAt: "asc" } },
          recommendations: { orderBy: { createdAt: "asc" } },
          savingsSnapshots: { orderBy: { recordedAt: "asc" } },
        },
      },
      supportRequests: {
        orderBy: { createdAt: "asc" },
        select: { type: true, message: true, createdAt: true },
      },
      auditLogs: {
        orderBy: { createdAt: "asc" },
        select: { action: true, createdAt: true },
      },
    },
  });

  if (!user?.profile) return null;

  const account = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
  const profile = {
    birthDate: user.profile.birthDate?.toISOString().slice(0, 10) ?? null,
    country: user.profile.country,
    currency: user.profile.currency,
    locale: user.profile.locale,
    theme: user.profile.theme,
    profession: user.profile.profession,
    incomeType: user.profile.incomeType,
    incomeFrequency: user.profile.incomeFrequency,
    monthlyIncome: number(user.profile.monthlyIncome),
    hasAdditionalIncome: user.profile.hasAdditionalIncome,
    additionalIncome: number(user.profile.additionalIncome),
    housingExpense: number(user.profile.housingExpense),
    foodExpense: number(user.profile.foodExpense),
    transportExpense: number(user.profile.transportExpense),
    restaurantExpense: number(user.profile.restaurantExpense),
    shoppingExpense: number(user.profile.shoppingExpense),
    hobbyExpense: number(user.profile.hobbyExpense),
    subscriptionExpense: number(user.profile.subscriptionExpense),
    impulsePurchase: user.profile.impulsePurchase,
    bankCheckFrequency: user.profile.bankCheckFrequency,
    hasBudget: user.profile.hasBudget,
    budgetCompliance: user.profile.budgetCompliance,
    installmentUsage: user.profile.installmentUsage,
    endOfMonthDifficulty: user.profile.endOfMonthDifficulty,
    hasSavings: user.profile.hasSavings,
    currentSavings: number(user.profile.currentSavings),
    monthlySavings: number(user.profile.monthlySavings),
    goalReason: user.profile.goalReason,
    goalTargetAmount: number(user.profile.goalTargetAmount),
    goalTargetDate: user.profile.goalTargetDate?.toISOString().slice(0, 10) ?? null,
    goalPriority: user.profile.goalPriority,
    onboardingCompleted: user.profile.onboardingCompleted,
    createdAt: user.profile.createdAt.toISOString(),
    updatedAt: user.profile.updatedAt.toISOString(),
  };

  if (scope === "profile") {
    return { exportedAt: new Date().toISOString(), scope, account, profile };
  }

  return {
    exportedAt: new Date().toISOString(),
    scope,
    account,
    profile,
    analyses: user.profile.financialProfiles.map((analysis) => ({
      ...analysis,
      monthlyIncome: analysis.monthlyIncome.toNumber(),
      monthlyExpenses: analysis.monthlyExpenses.toNumber(),
      savingCapacity: analysis.savingCapacity.toNumber(),
      savingRate: analysis.savingRate.toNumber(),
      remainingBudget: analysis.remainingBudget.toNumber(),
      createdAt: analysis.createdAt.toISOString(),
    })),
    goals: user.profile.goals.map((goal) => ({
      ...goal,
      targetAmount: goal.targetAmount.toNumber(),
      currentAmount: goal.currentAmount.toNumber(),
      progress: goal.progress.toNumber(),
      targetDate: goal.targetDate.toISOString().slice(0, 10),
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
    })),
    savingPlans: user.profile.savingPlans.map((plan) => ({
      ...plan,
      recommendedMonthlySaving: plan.recommendedMonthlySaving.toNumber(),
      progress: plan.progress.toNumber(),
      estimatedCompletionDate: plan.estimatedCompletionDate?.toISOString().slice(0, 10) ?? null,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
    })),
    recommendations: user.profile.recommendations.map((recommendation) => ({
      ...recommendation,
      potentialSaving: recommendation.potentialSaving.toNumber(),
      createdAt: recommendation.createdAt.toISOString(),
      updatedAt: recommendation.updatedAt.toISOString(),
    })),
    savingsHistory: user.profile.savingsSnapshots.map((snapshot) => ({
      ...snapshot,
      amount: snapshot.amount.toNumber(),
      recordedAt: snapshot.recordedAt.toISOString(),
    })),
    supportRequests: user.supportRequests.map((request) => ({
      ...request,
      createdAt: request.createdAt.toISOString(),
    })),
    auditTrail: user.auditLogs.map((log) => ({
      ...log,
      createdAt: log.createdAt.toISOString(),
    })),
  };
}

function number(value: { toNumber(): number } | null) {
  return value?.toNumber() ?? null;
}
