import { z } from "zod";

import { prisma } from "@/shared/api/database";

const IMPACT_WEIGHT = { VERY_HIGH: 5, HIGH: 4, MEDIUM: 3, LOW: 2, VERY_LOW: 1 } as const;
const DIFFICULTY_WEIGHT = { VERY_EASY: 4, EASY: 3, MEDIUM: 2, HARD: 1 } as const;
const PRIORITY_WEIGHT = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 } as const;
const recommendationIdSchema = z.string().uuid();

export async function getRecommendations(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      onboardingCompleted: true,
      currency: true,
      recommendations: { where: { status: { not: "ARCHIVED" } }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!profile?.onboardingCompleted) return null;

  const generatedIds = profile.recommendations
    .filter((recommendation) => recommendation.status === "GENERATED")
    .map((recommendation) => recommendation.id);

  if (generatedIds.length > 0) {
    await prisma.recommendation.updateMany({
      where: { id: { in: generatedIds }, profile: { userId }, status: "GENERATED" },
      data: { status: "DISPLAYED" },
    });
  }

  return {
    currency: profile.currency,
    recommendations: [...profile.recommendations].sort(compare).map((item) => ({
      ...item,
      status: item.status === "GENERATED" ? ("DISPLAYED" as const) : item.status,
      potentialSaving: item.potentialSaving.toNumber(),
    })),
  };
}

export async function getRecommendation(userId: string, input: unknown) {
  const id = recommendationIdSchema.safeParse(input);
  if (!id.success) return null;

  const item = await prisma.recommendation.findFirst({
    where: { id: id.data, status: { not: "ARCHIVED" }, profile: { userId } },
    include: { profile: { select: { currency: true } } },
  });

  if (!item || item.status === "ARCHIVED") return null;

  return {
    ...item,
    status: item.status,
    currency: item.profile.currency,
    potentialSaving: item.potentialSaving.toNumber(),
  };
}

function compare(
  left: {
    impact: keyof typeof IMPACT_WEIGHT;
    difficulty: keyof typeof DIFFICULTY_WEIGHT;
    priority: keyof typeof PRIORITY_WEIGHT;
    title: string;
  },
  right: {
    impact: keyof typeof IMPACT_WEIGHT;
    difficulty: keyof typeof DIFFICULTY_WEIGHT;
    priority: keyof typeof PRIORITY_WEIGHT;
    title: string;
  },
) {
  return (
    IMPACT_WEIGHT[right.impact] - IMPACT_WEIGHT[left.impact] ||
    DIFFICULTY_WEIGHT[right.difficulty] - DIFFICULTY_WEIGHT[left.difficulty] ||
    PRIORITY_WEIGHT[right.priority] - PRIORITY_WEIGHT[left.priority] ||
    left.title.localeCompare(right.title, "fr")
  );
}
