import { prisma } from "@/shared/api/database";

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export async function getDashboardData(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      onboardingCompleted: true,
      currency: true,
      currentSavings: true,
      financialProfiles: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          profileType: true,
          monthlyIncome: true,
          monthlyExpenses: true,
          savingCapacity: true,
          savingRate: true,
          financialHealthScore: true,
        },
      },
      goals: {
        where: { status: { in: ["ACTIVE", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          title: true,
          targetAmount: true,
          currentAmount: true,
          targetDate: true,
          progress: true,
          status: true,
        },
      },
      savingPlans: {
        where: { status: { in: ["ACTIVE", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          recommendedMonthlySaving: true,
          estimatedCompletionDate: true,
          difficulty: true,
          progress: true,
        },
      },
      recommendations: {
        where: { status: { not: "ARCHIVED" } },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          priority: true,
          impact: true,
          difficulty: true,
          potentialSaving: true,
        },
      },
    },
  });

  if (!profile) throw new Error("PROFILE_NOT_FOUND");
  if (!profile.onboardingCompleted) return { completed: false as const };

  const financialProfile = profile.financialProfiles[0];
  const goal = profile.goals[0];
  const savingPlan = profile.savingPlans[0];
  if (!financialProfile || !goal || !savingPlan) throw new Error("DASHBOARD_DATA_INCOMPLETE");

  const impactWeight = { VERY_HIGH: 5, HIGH: 4, MEDIUM: 3, LOW: 2, VERY_LOW: 1 } as const;
  const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 } as const;
  const recommendations = [...profile.recommendations]
    .sort(
      (left, right) =>
        impactWeight[right.impact] - impactWeight[left.impact] ||
        priorityWeight[right.priority] - priorityWeight[left.priority],
    )
    .slice(0, 3)
    .map((recommendation) => ({
      ...recommendation,
      potentialSaving: recommendation.potentialSaving.toNumber(),
    }));

  return {
    completed: true as const,
    currency: profile.currency,
    currentSavings: profile.currentSavings?.toNumber() ?? 0,
    financialProfile: {
      ...financialProfile,
      monthlyIncome: financialProfile.monthlyIncome.toNumber(),
      monthlyExpenses: financialProfile.monthlyExpenses.toNumber(),
      savingCapacity: financialProfile.savingCapacity.toNumber(),
      savingRate: financialProfile.savingRate.toNumber(),
    },
    goal: {
      ...goal,
      targetAmount: goal.targetAmount.toNumber(),
      currentAmount: goal.currentAmount.toNumber(),
      progress: goal.progress.toNumber(),
    },
    savingPlan: {
      ...savingPlan,
      recommendedMonthlySaving: savingPlan.recommendedMonthlySaving.toNumber(),
      progress: savingPlan.progress.toNumber(),
    },
    recommendations,
  };
}
