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
import { archiveGoal, createGoal, deleteGoal, updateGoal } from "./goal-actions";

describe.runIf(process.env.RUN_DATABASE_TESTS === "true")("actions objectifs avec PostgreSQL", () => {
  beforeAll(async () => {
    await prisma.user.create({ data: { id: userId, name: "Goals Test", firstName: "Goals", lastName: "Test", email: `goals-${userId}@vintra.test`, emailVerified: true, profile: { create: { birthDate: new Date("1990-01-01"), country: "France", profession: "EMPLOYEE", incomeType: "SALARY", incomeFrequency: "MONTHLY", monthlyIncome: 3_000, hasAdditionalIncome: false, additionalIncome: 0, housingExpense: 800, foodExpense: 350, transportExpense: 100, restaurantExpense: 100, shoppingExpense: 100, hobbyExpense: 100, subscriptionExpense: 50, impulsePurchase: "RARELY", bankCheckFrequency: "WEEKLY", hasBudget: true, budgetCompliance: "OFTEN", installmentUsage: "NEVER", endOfMonthDifficulty: "NEVER", hasSavings: true, currentSavings: 2_000, monthlySavings: 500, goalReason: "PROJECT", goalTargetAmount: 8_000, goalTargetDate: new Date("2029-01-01"), goalPriority: 7, currentOnboardingStep: 28 } } } });
    await runInitialAnalysis(userId);
  });

  afterAll(async () => { await prisma.user.deleteMany({ where: { id: userId } }); await prisma.$disconnect(); });

  it("crée, modifie, archive et supprime sans laisser plusieurs objectifs actifs", async () => {
    const created = await createGoal({ title: "Voyage", description: "Projet test", targetAmount: 12_000, targetDate: "2030-06" });
    expect(created.success).toBe(true);
    if (!created.success) return;
    expect(await prisma.goal.count({ where: { profile: { userId }, status: "ACTIVE" } })).toBe(1);

    const updated = await updateGoal({ id: created.data.id, title: "Grand voyage", description: "", targetAmount: 14_000, targetDate: "2031-01" });
    expect(updated.success).toBe(true);
    expect((await prisma.goal.findUniqueOrThrow({ where: { id: created.data.id } })).title).toBe("Grand voyage");

    expect((await archiveGoal(created.data.id)).success).toBe(true);
    expect(await prisma.goal.count({ where: { profile: { userId }, status: "ACTIVE" } })).toBe(0);

    const replacement = await createGoal({ title: "Voiture", description: "", targetAmount: 9_000, targetDate: "2030-01" });
    expect(replacement.success).toBe(true);
    if (!replacement.success) return;
    expect((await deleteGoal(replacement.data.id)).success).toBe(true);
    expect(await prisma.goal.findUnique({ where: { id: replacement.data.id } })).toBeNull();
  });
});
