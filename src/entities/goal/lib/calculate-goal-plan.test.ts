import { describe, expect, it } from "vitest";

import { calculateGoalPlan } from "./calculate-goal-plan";

describe("calculateGoalPlan", () => {
  it("calcule un plan réaliste et sa progression", () => {
    const result = calculateGoalPlan(
      {
        targetAmount: 10_000,
        currentAmount: 2_500,
        targetDate: new Date("2028-07-01"),
        savingCapacity: 500,
        profileType: "BALANCED",
      },
      new Date("2026-07-01"),
    );
    expect(result.progress).toBe(25);
    expect(result.recommendedMonthlySaving).toBe(400);
    expect(result.difficulty).toBe("NORMAL");
  });

  it("termine automatiquement un objectif atteint", () => {
    const result = calculateGoalPlan({
      targetAmount: 1_000,
      currentAmount: 1_200,
      targetDate: new Date("2027-01-01"),
      savingCapacity: 0,
      profileType: "FRAGILE",
    });
    expect(result.status).toBe("COMPLETED");
    expect(result.progress).toBe(100);
  });
});
