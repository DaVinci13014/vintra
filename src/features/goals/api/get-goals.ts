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
      profile: {
        select: {
          currency: true,
          savingPlans: {
            where: { status: { in: ["ACTIVE", "COMPLETED"] } },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });
  if (!goal) return null;
  const plan = goal.status === "ACTIVE" ? goal.profile.savingPlans[0] : null;
  return {
    ...goal,
    targetAmount: goal.targetAmount.toNumber(),
    currentAmount: goal.currentAmount.toNumber(),
    progress: goal.progress.toNumber(),
    currency: goal.profile.currency,
    estimatedCompletionDate:
      goal.status === "COMPLETED" ? goal.updatedAt : (plan?.estimatedCompletionDate ?? null),
    recommendedMonthlySaving: plan?.recommendedMonthlySaving.toNumber() ?? 0,
  };
}
