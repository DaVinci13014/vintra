import { ensureWeeklySummary } from "@/entities/notification/server";
import { prisma } from "@/shared/api/database";

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export async function getDashboardData(userId: string) {
  await ensureWeeklySummary(userId);
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
        where: { status: { in: ["PLANNED", "ACTIVE", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          targetAmount: true,
          currentAmount: true,
          targetDate: true,
          progress: true,
          status: true,
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
        },
      },
      recommendations: {
        where: { status: { in: ["GENERATED", "DISPLAYED", "OPENED"] } },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          priority: true,
          impact: true,
          difficulty: true,
          potentialSaving: true,
          status: true,
        },
      },
      savingsSnapshots: {
        orderBy: { recordedAt: "desc" },
        take: 120,
        select: { amount: true, recordedAt: true },
      },
      _count: { select: { notifications: { where: { status: "UNREAD" } } } },
    },
  });

  if (!profile) throw new Error("PROFILE_NOT_FOUND");
  if (!profile.onboardingCompleted) return { completed: false as const };

  const financialProfile = profile.financialProfiles[0];
  const goal =
    profile.goals.find((candidate) => candidate.status === "ACTIVE") ??
    profile.goals.find((candidate) => candidate.status === "COMPLETED");
  const savingPlan = goal?.savingPlans[0];
  const plannedGoals = profile.goals
    .filter((candidate) => candidate.status === "PLANNED")
    .slice(0, 3);
  if (!financialProfile) throw new Error("DASHBOARD_DATA_INCOMPLETE");

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
      status:
        recommendation.status === "GENERATED" ? ("DISPLAYED" as const) : recommendation.status,
      potentialSaving: recommendation.potentialSaving.toNumber(),
    }));

  const displayedRecommendationIds = recommendations
    .filter((recommendation) => recommendation.status === "DISPLAYED")
    .map((recommendation) => recommendation.id);

  if (displayedRecommendationIds.length > 0) {
    await prisma.recommendation.updateMany({
      where: {
        id: { in: displayedRecommendationIds },
        profile: { userId },
        status: "GENERATED",
      },
      data: { status: "DISPLAYED" },
    });
  }

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
    goal: goal
      ? {
          id: goal.id,
          title: goal.title,
          targetAmount: goal.targetAmount.toNumber(),
          currentAmount: goal.currentAmount.toNumber(),
          targetDate: goal.targetDate,
          progress: goal.progress.toNumber(),
          status: goal.status,
        }
      : null,
    savingPlan: savingPlan
      ? {
          ...savingPlan,
          recommendedMonthlySaving: savingPlan.recommendedMonthlySaving.toNumber(),
          progress: savingPlan.progress.toNumber(),
        }
      : null,
    plannedGoals: plannedGoals.map((plannedGoal) => ({
      id: plannedGoal.id,
      title: plannedGoal.title,
      targetAmount: plannedGoal.targetAmount.toNumber(),
      currentAmount: plannedGoal.currentAmount.toNumber(),
      targetDate: plannedGoal.targetDate,
      progress: plannedGoal.progress.toNumber(),
      status: plannedGoal.status,
    })),
    recommendations,
    unreadNotificationCount: profile._count.notifications,
    savingsHistory: profile.savingsSnapshots
      .map((snapshot) => ({
        amount: snapshot.amount.toNumber(),
        recordedAt: snapshot.recordedAt.toISOString(),
      }))
      .reverse(),
  };
}
