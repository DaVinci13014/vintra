import { describe, expect, it } from "vitest";

import { calculateFinancialAnalysis, type AnalysisInput } from "@/entities/financial-profile";
import { generateRecommendations } from "./generate-recommendations";

const now = new Date("2026-07-15T00:00:00.000Z");

const input: AnalysisInput = {
  incomeFrequency: "VARIABLE",
  monthlyIncome: 2_000,
  additionalIncome: 0,
  housingExpense: 900,
  foodExpense: 400,
  transportExpense: 200,
  restaurantExpense: 300,
  shoppingExpense: 250,
  hobbyExpense: 150,
  subscriptionExpense: 80,
  impulsePurchase: "OFTEN",
  bankCheckFrequency: "RARELY",
  hasBudget: false,
  budgetCompliance: null,
  installmentUsage: "OFTEN",
  endOfMonthDifficulty: "EVERY_MONTH",
  currentSavings: 100,
  monthlySavings: 0,
  goalTargetAmount: 10_000,
  goalTargetDate: new Date("2027-01-01T00:00:00.000Z"),
};

describe("generateRecommendations", () => {
  it("ne génère que des conseils justifiés et sans doublon", () => {
    const analysis = calculateFinancialAnalysis(input, now);
    const recommendations = generateRecommendations({ input, analysis });
    const titles = recommendations.map((recommendation) => recommendation.title);

    expect(titles).toContain("Stabiliser votre budget mensuel");
    expect(titles).toContain("Ajuster la date de votre objectif");
    expect(new Set(titles).size).toBe(titles.length);
    expect(recommendations[0]?.impact).toBe("VERY_HIGH");
  });

  it("n’invente pas de problème d’habitude quand les réponses sont saines", () => {
    const healthyInput: AnalysisInput = {
      ...input,
      monthlyIncome: 4_000,
      housingExpense: 800,
      foodExpense: 350,
      transportExpense: 100,
      restaurantExpense: 50,
      shoppingExpense: 50,
      hobbyExpense: 50,
      subscriptionExpense: 20,
      impulsePurchase: "NEVER",
      bankCheckFrequency: "WEEKLY",
      hasBudget: true,
      budgetCompliance: "ALWAYS",
      installmentUsage: "NEVER",
      endOfMonthDifficulty: "NEVER",
      currentSavings: 20_000,
      monthlySavings: 1_000,
      goalTargetDate: new Date("2028-01-01T00:00:00.000Z"),
    };
    const analysis = calculateFinancialAnalysis(healthyInput, now);
    const recommendations = generateRecommendations({ input: healthyInput, analysis });

    expect(recommendations).toEqual([]);
  });
});
