import { describe, expect, it } from "vitest";

import { savingsContributionInputSchema } from "./goal-schema";

describe("savingsContributionInputSchema", () => {
  it("accepte un versement positif avec deux décimales", () => {
    expect(
      savingsContributionInputSchema.safeParse({
        goalId: "d0c9b2f0-5062-4adc-b494-291efe08c772",
        amount: 125.5,
      }).success,
    ).toBe(true);
  });

  it.each([0, -10, Number.NaN, Number.POSITIVE_INFINITY, 10.001])(
    "refuse le montant invalide %s",
    (amount) => {
      expect(
        savingsContributionInputSchema.safeParse({
          goalId: "d0c9b2f0-5062-4adc-b494-291efe08c772",
          amount,
        }).success,
      ).toBe(false);
    },
  );

  it("refuse un identifiant d’objectif non valide", () => {
    expect(savingsContributionInputSchema.safeParse({ goalId: "goal", amount: 100 }).success).toBe(
      false,
    );
  });
});
