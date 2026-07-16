import { z } from "zod";

import { COUNTRY_OPTIONS } from "./country-options";
import type { OnboardingValues } from "./onboarding-types";

const nullableAmount = z.number().finite().min(0).nullable();

export const onboardingDraftSchema = z.object({
  birthDate: z.string(),
  country: z.string(),
  profession: z.string(),
  incomeType: z.string(),
  incomeFrequency: z.string(),
  monthlyIncome: nullableAmount,
  hasAdditionalIncome: z.boolean().nullable(),
  additionalIncome: nullableAmount,
  housingExpense: nullableAmount,
  foodExpense: nullableAmount,
  transportExpense: nullableAmount,
  restaurantExpense: nullableAmount,
  shoppingExpense: nullableAmount,
  hobbyExpense: nullableAmount,
  subscriptionExpense: nullableAmount,
  impulsePurchase: z.string(),
  bankCheckFrequency: z.string(),
  hasBudget: z.boolean().nullable(),
  budgetCompliance: z.string(),
  installmentUsage: z.string(),
  endOfMonthDifficulty: z.string(),
  hasSavings: z.boolean().nullable(),
  currentSavings: nullableAmount,
  monthlySavings: nullableAmount,
  goalReason: z.string(),
  goalTargetAmount: nullableAmount,
  goalTargetDate: z.string(),
  goalPriority: z.number().int().min(1).max(10).nullable(),
});

const schemasByStep: Record<number, z.ZodType> = {
  1: z.object({
    birthDate: z
      .string()
      .refine(isValidBirthDate, "Saisissez une date de naissance valide.")
      .refine(isAdultBirthDate, "Vous devez avoir au moins 18 ans pour utiliser Vintra."),
  }),
  2: z.object({
    country: z.string().refine(isSupportedCountry, "Sélectionnez un pays dans la liste."),
  }),
  3: z.object({
    profession: z.enum(
      ["EMPLOYEE", "FREELANCER", "ENTREPRENEUR", "STUDENT", "UNEMPLOYED", "RETIRED"],
      { error: "Sélectionnez votre situation professionnelle." },
    ),
  }),
  4: z.object({
    incomeType: z.enum(["SALARY", "BUSINESS", "BENEFITS", "PENSION", "MULTIPLE"], {
      error: "Sélectionnez votre principale source de revenus.",
    }),
  }),
  5: z.object({
    incomeFrequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY", "VARIABLE"], {
      error: "Sélectionnez la fréquence de vos revenus.",
    }),
  }),
  6: z.object({ monthlyIncome: requiredAmount(1_000_000, "Indiquez votre revenu mensuel moyen.") }),
  7: z
    .object({
      hasAdditionalIncome: z.boolean({ error: "Choisissez une réponse." }),
      additionalIncome: nullableAmount,
    })
    .superRefine((data, context) => {
      if (data.hasAdditionalIncome && data.additionalIncome === null) {
        context.addIssue({
          code: "custom",
          path: ["additionalIncome"],
          message: "Indiquez le montant mensuel moyen.",
        });
      }
    }),
  8: z.object({
    housingExpense: requiredAmount(100_000, "Indiquez votre coût de logement mensuel."),
  }),
  9: z.object({
    foodExpense: requiredAmount(100_000, "Indiquez vos dépenses alimentaires mensuelles."),
  }),
  10: z.object({
    transportExpense: requiredAmount(100_000, "Indiquez vos dépenses de transport mensuelles."),
  }),
  11: z.object({
    restaurantExpense: requiredAmount(10_000, "Indiquez vos dépenses mensuelles de restaurants."),
  }),
  12: z.object({
    shoppingExpense: requiredAmount(20_000, "Indiquez vos dépenses mensuelles de shopping."),
  }),
  13: z.object({
    hobbyExpense: requiredAmount(100_000, "Indiquez vos dépenses mensuelles de loisirs."),
  }),
  14: z.object({
    subscriptionExpense: requiredAmount(100_000, "Indiquez le total de vos abonnements mensuels."),
  }),
  15: z.object({ impulsePurchase: frequencySchema("Sélectionnez une fréquence.") }),
  16: z.object({
    bankCheckFrequency: z.enum(
      ["DAILY", "SEVERAL_TIMES_A_WEEK", "WEEKLY", "A_FEW_TIMES_A_MONTH", "RARELY"],
      { error: "Sélectionnez une fréquence." },
    ),
  }),
  17: z
    .object({
      hasBudget: z.boolean({ error: "Choisissez une réponse." }),
      budgetCompliance: z.string(),
    })
    .superRefine((data, context) => {
      if (
        data.hasBudget &&
        !["ALWAYS", "OFTEN", "SOMETIMES", "RARELY"].includes(data.budgetCompliance)
      ) {
        context.addIssue({
          code: "custom",
          path: ["budgetCompliance"],
          message: "Indiquez à quelle fréquence vous respectez ce budget.",
        });
      }
    }),
  18: z.object({
    installmentUsage: z.enum(["NEVER", "RARELY", "SOMETIMES", "OFTEN"], {
      error: "Sélectionnez une fréquence.",
    }),
  }),
  19: z.object({
    endOfMonthDifficulty: z.enum(["NEVER", "RARELY", "SOMETIMES", "OFTEN", "EVERY_MONTH"], {
      error: "Sélectionnez une fréquence.",
    }),
  }),
  20: z.object({ hasSavings: z.boolean({ error: "Choisissez une réponse." }) }),
  21: z.object({
    currentSavings: requiredAmount(100_000_000, "Indiquez le montant de votre épargne actuelle."),
  }),
  22: z.object({
    monthlySavings: requiredAmount(
      100_000_000,
      "Indiquez combien vous mettez de côté chaque mois.",
    ),
  }),
  23: z.object({
    goalReason: z.enum(["EMERGENCY_FUND", "CAR", "HOME", "TRAVEL", "PROJECT", "FUTURE", "OTHER"], {
      error: "Sélectionnez votre objectif principal.",
    }),
  }),
  24: z.object({
    goalTargetAmount: z
      .number({ error: "Indiquez le montant de votre objectif." })
      .min(100, "Le montant minimum est de 100 €.")
      .max(100_000_000, "Le montant indiqué est trop élevé."),
  }),
  25: z.object({ goalTargetDate: z.string().refine(isFutureMonth, "Choisissez un mois à venir.") }),
  26: z.object({
    goalPriority: z
      .number({ error: "Indiquez l’importance de cet objectif." })
      .int()
      .min(1)
      .max(10),
  }),
};

export function validateOnboardingStep(step: number, values: OnboardingValues) {
  const schema = schemasByStep[step];

  if (!schema) {
    return { success: false as const, message: "Cette étape n’est pas disponible." };
  }

  const result = schema.safeParse(values);

  if (!result.success) {
    return {
      success: false as const,
      message: result.error.issues[0]?.message ?? "Certaines informations doivent être corrigées.",
    };
  }

  return { success: true as const };
}

function requiredAmount(maximum: number, message: string) {
  return z
    .number({ error: message })
    .finite()
    .min(0)
    .max(maximum, "Le montant indiqué est trop élevé.");
}

function frequencySchema(message: string) {
  return z.enum(["NEVER", "RARELY", "SOMETIMES", "OFTEN", "VERY_OFTEN"], { error: message });
}

function isSupportedCountry(value: string) {
  return COUNTRY_OPTIONS.some((country) => country === value);
}

function parseBirthDate(value: string) {
  const parts = value.split("-").map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  if (!year || !month || !day) {
    return null;
  }

  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  return birthDate;
}

function isValidBirthDate(value: string) {
  return parseBirthDate(value) !== null;
}

function isAdultBirthDate(value: string) {
  const birthDate = parseBirthDate(value);
  if (!birthDate) return false;

  const today = new Date();
  const adultLimit = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return birthDate <= adultLimit;
}

function isFutureMonth(value: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month] = value.split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) {
    return false;
  }

  const today = new Date();
  return (
    year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth() + 1)
  );
}
