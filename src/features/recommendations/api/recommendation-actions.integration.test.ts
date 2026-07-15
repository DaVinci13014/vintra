import "dotenv/config";

import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const userId = randomUUID();
const otherUserId = randomUUID();
let foreignRecommendationId: string;

vi.mock("@/features/auth/server", () => ({
  getSession: vi.fn(async () => ({ user: { id: userId, emailVerified: true } })),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { getDashboardData } from "@/features/dashboard";
import { runInitialAnalysis } from "@/features/financial-analysis";
import { prisma } from "@/shared/api/database";
import { getRecommendation, getRecommendations } from "./get-recommendations";
import {
  applyRecommendation,
  archiveRecommendation,
  markRecommendationOpened,
} from "./recommendation-actions";

describe.runIf(process.env.RUN_DATABASE_TESTS === "true")(
  "cycle de vie des recommandations avec PostgreSQL",
  () => {
    beforeAll(async () => {
      await prisma.user.create({
        data: {
          id: userId,
          name: "Recommendations Test",
          firstName: "Recommendations",
          lastName: "Test",
          email: `recommendations-${userId}@vintra.test`,
          emailVerified: true,
          profile: {
            create: {
              birthDate: new Date("1990-01-01"),
              country: "France",
              profession: "EMPLOYEE",
              incomeType: "SALARY",
              incomeFrequency: "MONTHLY",
              monthlyIncome: 3_000,
              hasAdditionalIncome: false,
              additionalIncome: 0,
              housingExpense: 900,
              foodExpense: 450,
              transportExpense: 250,
              restaurantExpense: 400,
              shoppingExpense: 350,
              hobbyExpense: 250,
              subscriptionExpense: 100,
              impulsePurchase: "OFTEN",
              bankCheckFrequency: "RARELY",
              hasBudget: false,
              budgetCompliance: null,
              installmentUsage: "OFTEN",
              endOfMonthDifficulty: "OFTEN",
              hasSavings: true,
              currentSavings: 200,
              monthlySavings: 50,
              goalReason: "PROJECT",
              goalTargetAmount: 15_000,
              goalTargetDate: new Date("2028-01-01"),
              goalPriority: 9,
              currentOnboardingStep: 28,
            },
          },
        },
      });
      await runInitialAnalysis(userId);

      const otherUser = await prisma.user.create({
        data: {
          id: otherUserId,
          name: "Other User",
          firstName: "Other",
          lastName: "User",
          email: `recommendations-other-${otherUserId}@vintra.test`,
          emailVerified: true,
          profile: { create: {} },
        },
        select: { profile: { select: { id: true } } },
      });
      const foreignRecommendation = await prisma.recommendation.create({
        data: {
          profileId: otherUser.profile!.id,
          title: "Conseil privé",
          description: "Cette recommandation appartient à un autre compte.",
          category: "PROFILE",
          priority: "LOW",
          impact: "VERY_LOW",
          difficulty: "VERY_EASY",
        },
      });
      foreignRecommendationId = foreignRecommendation.id;
    });

    afterAll(async () => {
      await prisma.user.deleteMany({ where: { id: { in: [userId, otherUserId] } } });
      await prisma.$disconnect();
    });

    it("limite le tableau de bord à trois conseils et les marque comme affichés", async () => {
      const dashboard = await getDashboardData(userId);
      expect(dashboard.completed).toBe(true);
      if (!dashboard.completed) return;

      expect(dashboard.recommendations.length).toBeGreaterThan(0);
      expect(dashboard.recommendations.length).toBeLessThanOrEqual(3);
      const displayed = await prisma.recommendation.count({
        where: {
          id: { in: dashboard.recommendations.map((recommendation) => recommendation.id) },
          status: "DISPLAYED",
        },
      });
      expect(displayed).toBe(dashboard.recommendations.length);
    });

    it("suit le cycle affichée, ouverte, appliquée puis archivée", async () => {
      const data = await getRecommendations(userId);
      expect(data).not.toBeNull();
      if (!data) return;

      expect(data.recommendations.length).toBeGreaterThan(0);
      expect(
        data.recommendations.every((recommendation) => recommendation.status === "DISPLAYED"),
      ).toBe(true);
      const recommendation = data.recommendations[0]!;

      expect((await markRecommendationOpened(recommendation.id)).success).toBe(true);
      expect(
        (await prisma.recommendation.findUniqueOrThrow({ where: { id: recommendation.id } }))
          .status,
      ).toBe("OPENED");

      expect((await applyRecommendation(recommendation.id)).success).toBe(true);
      expect(
        (await prisma.recommendation.findUniqueOrThrow({ where: { id: recommendation.id } }))
          .status,
      ).toBe("APPLIED");
      const dashboardAfterApplication = await getDashboardData(userId);
      expect(dashboardAfterApplication.completed).toBe(true);
      if (dashboardAfterApplication.completed) {
        expect(
          dashboardAfterApplication.recommendations.some(
            (dashboardRecommendation) => dashboardRecommendation.id === recommendation.id,
          ),
        ).toBe(false);
      }

      expect((await archiveRecommendation(recommendation.id)).success).toBe(true);
      expect(await getRecommendation(userId, recommendation.id)).toBeNull();
    });

    it("refuse la lecture et les actions sur le conseil d’un autre compte", async () => {
      expect(await getRecommendation(userId, foreignRecommendationId)).toBeNull();
      const response = await applyRecommendation(foreignRecommendationId);
      expect(response).toEqual({
        success: false,
        error: {
          code: "RECOMMENDATION_NOT_FOUND",
          message: "Cette recommandation n’existe pas.",
        },
      });
    });
  },
);
