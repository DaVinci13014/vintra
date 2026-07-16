import { calculateGoalPlan } from "@/entities/goal";
import { prisma } from "@/shared/api/database";

export async function getGoals(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      onboardingCompleted: true,
      currency: true,
      goals: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!profile?.onboardingCompleted) return null;
  return {
    currency: profile.currency,
    goals: profile.goals.map((goal) => ({
      ...goal,
      targetAmount: goal.targetAmount.toNumber(),
      currentAmount: goal.currentAmount.toNumber(),
      progress: goal.progress.toNumber(),
    })),
  };
}

export async function getGoal(userId: string, id: string) {
  const goal = await prisma.goal.findFirst({
    where: { id, profile: { userId } },
    include: {
      savingPlans: {
        where: { status: { in: ["ACTIVE", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      profile: {
        select: {
          currency: true,
          currentSavings: true,
          financialProfiles: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });
  if (!goal) return null;
  const financial = goal.profile.financialProfiles[0];
  const simulatedPlan =
    goal.status === "PLANNED" && financial
      ? calculateGoalPlan({
          targetAmount: goal.targetAmount.toNumber(),
          currentAmount: goal.profile.currentSavings?.toNumber() ?? 0,
          targetDate: goal.targetDate,
          savingCapacity: financial.savingCapacity.toNumber(),
          profileType: financial.profileType,
        })
      : null;
  const storedPlan = goal.savingPlans[0];
  return {
    ...goal,
    targetAmount: goal.targetAmount.toNumber(),
    currentAmount: goal.currentAmount.toNumber(),
    progress: goal.progress.toNumber(),
    currency: goal.profile.currency,
    estimatedCompletionDate:
      goal.status === "COMPLETED"
        ? goal.updatedAt
        : (simulatedPlan?.estimatedCompletionDate ?? storedPlan?.estimatedCompletionDate ?? null),
    recommendedMonthlySaving:
      simulatedPlan?.recommendedMonthlySaving ??
      storedPlan?.recommendedMonthlySaving.toNumber() ??
      0,
    isSimulation: goal.status === "PLANNED",
  };
}

export async function getGoalSavings(userId: string, id: string) {
  const goal = await prisma.goal.findFirst({
    where: { id, profile: { userId } },
    select: {
      id: true,
      title: true,
      targetAmount: true,
      currentAmount: true,
      progress: true,
      status: true,
      profile: { select: { currency: true } },
      contributions: {
        orderBy: { createdAt: "desc" },
        select: { id: true, amount: true, createdAt: true },
      },
    },
  });
  if (!goal) return null;

  return {
    id: goal.id,
    title: goal.title,
    targetAmount: goal.targetAmount.toNumber(),
    currentAmount: goal.currentAmount.toNumber(),
    progress: goal.progress.toNumber(),
    status: goal.status,
    currency: goal.profile.currency,
    contributions: goal.contributions.map((contribution) => ({
      ...contribution,
      amount: contribution.amount.toNumber(),
      createdAt: contribution.createdAt.toISOString(),
    })),
  };
}
