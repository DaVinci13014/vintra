import { describe, expect, it } from "vitest";

import type { AnalysisInput } from "../model/financial-analysis";
import { calculateFinancialAnalysis } from "./calculate-financial-analysis";

const now = new Date("2026-07-15T00:00:00.000Z");

function input(overrides: Partial<AnalysisInput> = {}): AnalysisInput {
  return {
    incomeFrequency: "MONTHLY",
    monthlyIncome: 3_000,
    additionalIncome: 0,
    housingExpense: 800,
    foodExpense: 350,
    transportExpense: 150,
    restaurantExpense: 100,
    shoppingExpense: 80,
    hobbyExpense: 100,
    subscriptionExpense: 50,
    impulsePurchase: "RARELY",
    bankCheckFrequency: "WEEKLY",
    hasBudget: true,
    budgetCompliance: "OFTEN",
    installmentUsage: "NEVER",
    endOfMonthDifficulty: "NEVER",
    currentSavings: 8_000,
    monthlySavings: 700,
    goalTargetAmount: 20_000,
    goalTargetDate: new Date("2028-07-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("calculateFinancialAnalysis", () => {
  it("calcule les indicateurs et attribue un profil épargnant", () => {
    const result = calculateFinancialAnalysis(input(), now);

    expect(result.monthlyIncome).toBe(3_000);
    expect(result.monthlyExpenses).toBe(1_630);
    expect(result.savingCapacity).toBe(1_370);
    expect(result.remainingBudget).toBe(1_370);
    expect(result.savingRate).toBe(45.67);
    expect(result.goalProgress).toBe(40);
    expect(result.profileType).toBe("SAVER");
    expect(result.recommendedMonthlySaving).toBe(1_233);
  });

  it("conserve un reste à vivre négatif mais borne la capacité à zéro", () => {
    const result = calculateFinancialAnalysis(
      input({ monthlyIncome: 1_000, housingExpense: 900, foodExpense: 500 }),
      now,
    );

    expect(result.remainingBudget).toBeLessThan(0);
    expect(result.savingCapacity).toBe(0);
    expect(result.profileType).toBe("FRAGILE");
    expect(result.difficulty).toBe("UNREALISTIC");
    expect(result.estimatedCompletionDate).toBeNull();
  });

  it("protège toutes les divisions par zéro", () => {
    const result = calculateFinancialAnalysis(
      input({
        monthlyIncome: 0,
        housingExpense: 0,
        foodExpense: 0,
        transportExpense: 0,
        restaurantExpense: 0,
        shoppingExpense: 0,
        hobbyExpense: 0,
        subscriptionExpense: 0,
      }),
      now,
    );

    expect(result.savingRate).toBe(0);
    expect(result.expenseRatio).toBe(0);
    expect(result.recommendedMonthlySaving).toBe(0);
  });

  it("plafonne la progression et reconnaît un objectif déjà atteint", () => {
    const result = calculateFinancialAnalysis(
      input({ currentSavings: 25_000, goalTargetAmount: 20_000 }),
      now,
    );

    expect(result.goalProgress).toBe(100);
    expect(result.goalRemainingAmount).toBe(0);
    expect(result.difficulty).toBe("EASY");
    expect(result.estimatedCompletionDate).toEqual(now);
  });

  it("rejette une donnée financière négative", () => {
    expect(() => calculateFinancialAnalysis(input({ foodExpense: -1 }), now)).toThrow(
      "Les montants financiers",
    );
  });
});
