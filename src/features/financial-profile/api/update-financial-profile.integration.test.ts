import "dotenv/config";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const userId = randomUUID();
vi.mock("@/features/auth/server", () => ({
  getSession: vi.fn(async () => ({ user: { id: userId, emailVerified: true } })),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { runInitialAnalysis } from "@/features/financial-analysis";
import { prisma } from "@/shared/api/database";
import { updateFinancialProfile } from "./update-financial-profile";

describe.runIf(process.env.RUN_DATABASE_TESTS === "true")(
  "mise à jour du profil financier avec PostgreSQL",
  () => {
    beforeAll(async () => {
      await prisma.user.create({
        data: {
          id: userId,
          name: "Profile Test",
          firstName: "Profile",
          lastName: "Test",
          email: `profile-${userId}@vintra.test`,
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
              housingExpense: 800,
              foodExpense: 350,
              transportExpense: 100,
              restaurantExpense: 100,
              shoppingExpense: 100,
              hobbyExpense: 100,
              subscriptionExpense: 50,
              impulsePurchase: "RARELY",
              bankCheckFrequency: "WEEKLY",
              hasBudget: true,
              budgetCompliance: "OFTEN",
              installmentUsage: "NEVER",
              endOfMonthDifficulty: "NEVER",
              hasSavings: true,
              currentSavings: 2_000,
              monthlySavings: 500,
              goalReason: "PROJECT",
              goalTargetAmount: 8_000,
              goalTargetDate: new Date("2029-01-01"),
              goalPriority: 7,
              currentOnboardingStep: 28,
            },
          },
        },
      });
      await runInitialAnalysis(userId);
    });
    afterAll(async () => {
      await prisma.user.deleteMany({ where: { id: userId } });
      await prisma.$disconnect();
    });
    it("recalcule toute la chaîne une seule fois et historise l’épargne", async () => {
      const input = {
        incomeFrequency: "MONTHLY" as const,
        monthlyIncome: 3_400,
        additionalIncome: 100,
        housingExpense: 800,
        foodExpense: 360,
        transportExpense: 100,
        restaurantExpense: 90,
        shoppingExpense: 80,
        hobbyExpense: 100,
        subscriptionExpense: 50,
        currentSavings: 0,
        monthlySavings: 600,
      };
      expect((await updateFinancialProfile(input)).success).toBe(true);
      expect((await updateFinancialProfile(input)).success).toBe(true);
      const profile = await prisma.profile.findUniqueOrThrow({
        where: { userId },
        include: {
          financialProfiles: true,
          savingsSnapshots: true,
          goals: { where: { status: { in: ["ACTIVE", "COMPLETED"] } } },
          savingPlans: { where: { status: { in: ["ACTIVE", "COMPLETED"] } } },
          recommendations: { where: { status: { not: "ARCHIVED" } } },
        },
      });
      expect(profile.financialProfiles).toHaveLength(2);
      expect(profile.savingsSnapshots).toHaveLength(2);
      expect(profile.hasSavings).toBe(false);
      expect(profile.goals[0]?.currentAmount.toNumber()).toBe(0);
      expect(profile.savingPlans).toHaveLength(1);
    });
  },
);
