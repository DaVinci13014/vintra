import "dotenv/config";

import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/shared/api/database";
import { runInitialAnalysis } from "./run-initial-analysis";

const runDatabaseTests = process.env.RUN_DATABASE_TESTS === "true";
const userId = randomUUID();

describe.runIf(runDatabaseTests)("runInitialAnalysis avec PostgreSQL", () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: userId,
        name: "Test Vintra",
        firstName: "Test",
        lastName: "Vintra",
        email: `integration-${userId}@vintra.test`,
        emailVerified: true,
        profile: {
          create: {
            birthDate: new Date("1990-01-01T00:00:00.000Z"),
            country: "France",
            profession: "EMPLOYEE",
            incomeType: "SALARY",
            incomeFrequency: "MONTHLY",
            monthlyIncome: 3_000,
            hasAdditionalIncome: false,
            additionalIncome: 0,
            housingExpense: 850,
            foodExpense: 350,
            transportExpense: 120,
            restaurantExpense: 120,
            shoppingExpense: 100,
            hobbyExpense: 100,
            subscriptionExpense: 60,
            impulsePurchase: "RARELY",
            bankCheckFrequency: "WEEKLY",
            hasBudget: true,
            budgetCompliance: "OFTEN",
            installmentUsage: "NEVER",
            endOfMonthDifficulty: "NEVER",
            hasSavings: true,
            currentSavings: 5_000,
            monthlySavings: 500,
            goalReason: "HOME",
            goalTargetAmount: 20_000,
            goalTargetDate: new Date("2029-07-01T00:00:00.000Z"),
            goalPriority: 8,
            currentOnboardingStep: 28,
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it("crée un ensemble complet et reste idempotent", async () => {
    const firstResult = await runInitialAnalysis(userId);
    const secondResult = await runInitialAnalysis(userId);
    const profile = await prisma.profile.findUniqueOrThrow({
      where: { userId },
      include: {
        financialProfiles: true,
        goals: true,
        savingPlans: true,
        recommendations: true,
      },
    });

    expect(firstResult.alreadyCompleted).toBe(false);
    expect(secondResult.alreadyCompleted).toBe(true);
    expect(profile.onboardingCompleted).toBe(true);
    expect(profile.financialProfiles).toHaveLength(1);
    expect(profile.goals).toHaveLength(1);
    expect(profile.savingPlans).toHaveLength(1);
    expect(profile.recommendations.length).toBeGreaterThan(0);
  });
});
