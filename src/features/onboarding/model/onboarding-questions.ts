import {
  BANK_CHECK_CHOICES,
  END_OF_MONTH_CHOICES,
  FREQUENCY_CHOICES,
  GOAL_CHOICES,
  INCOME_FREQUENCY_CHOICES,
  INCOME_TYPE_CHOICES,
  INSTALLMENT_CHOICES,
  PROFESSION_CHOICES,
} from "./onboarding-options";
import type { Choice, OnboardingValues } from "./onboarding-types";

type StringField = {
  [Key in keyof OnboardingValues]: OnboardingValues[Key] extends string ? Key : never;
}[keyof OnboardingValues];

type AmountField = {
  [Key in keyof OnboardingValues]: OnboardingValues[Key] extends number | null ? Key : never;
}[keyof OnboardingValues];

export type ChoiceQuestion = {
  kind: "choice";
  eyebrow: string;
  question: string;
  description?: string;
  field: StringField;
  choices: Choice[];
};

export type CurrencyQuestion = {
  kind: "currency";
  eyebrow: string;
  question: string;
  description: string;
  field: AmountField;
  placeholder: string;
};

export type OnboardingQuestion = ChoiceQuestion | CurrencyQuestion;

export const ONBOARDING_QUESTIONS: Partial<Record<number, OnboardingQuestion>> = {
  3: {
    kind: "choice",
    eyebrow: "Votre activité",
    question: "Quelle est votre situation professionnelle actuelle ?",
    field: "profession",
    choices: PROFESSION_CHOICES,
  },
  4: {
    kind: "choice",
    eyebrow: "Vos revenus",
    question: "Quelle est votre principale source de revenus ?",
    field: "incomeType",
    choices: INCOME_TYPE_CHOICES,
  },
  5: {
    kind: "choice",
    eyebrow: "Vos revenus",
    question: "À quelle fréquence recevez-vous vos revenus ?",
    field: "incomeFrequency",
    choices: INCOME_FREQUENCY_CHOICES,
  },
  6: {
    kind: "currency",
    eyebrow: "Vos revenus",
    question: "Quel est votre revenu mensuel net moyen ?",
    description: "Indiquez le montant moyen reçu après impôts.",
    field: "monthlyIncome",
    placeholder: "2 000",
  },
  8: {
    kind: "currency",
    eyebrow: "Vos dépenses",
    question: "Combien coûte votre logement chaque mois ?",
    description: "Loyer, crédit ou participation au logement.",
    field: "housingExpense",
    placeholder: "750",
  },
  9: {
    kind: "currency",
    eyebrow: "Vos dépenses",
    question: "Combien dépensez-vous en alimentation chaque mois ?",
    description: "Courses et achats alimentaires du quotidien.",
    field: "foodExpense",
    placeholder: "300",
  },
  10: {
    kind: "currency",
    eyebrow: "Vos dépenses",
    question: "Combien consacrez-vous aux transports chaque mois ?",
    description: "Carburant, transports en commun, entretien ou stationnement.",
    field: "transportExpense",
    placeholder: "150",
  },
  11: {
    kind: "currency",
    eyebrow: "Vos dépenses",
    question: "Combien dépensez-vous en restaurants chaque mois ?",
    description: "Restaurants, repas à l’extérieur et livraisons. Une estimation suffit.",
    field: "restaurantExpense",
    placeholder: "150",
  },
  12: {
    kind: "currency",
    eyebrow: "Vos dépenses",
    question: "Combien dépensez-vous en shopping chaque mois ?",
    description: "Vêtements, décoration et achats personnels.",
    field: "shoppingExpense",
    placeholder: "100",
  },
  13: {
    kind: "currency",
    eyebrow: "Vos dépenses",
    question: "Combien consacrez-vous à vos loisirs chaque mois ?",
    description: "Cinéma, sorties, sport et jeux.",
    field: "hobbyExpense",
    placeholder: "100",
  },
  14: {
    kind: "currency",
    eyebrow: "Vos dépenses",
    question: "Quel est le total de vos abonnements mensuels ?",
    description: "Téléphone, streaming, musique ou salle de sport.",
    field: "subscriptionExpense",
    placeholder: "50",
  },
  15: {
    kind: "choice",
    eyebrow: "Vos habitudes",
    question: "À quelle fréquence effectuez-vous des achats impulsifs ?",
    field: "impulsePurchase",
    choices: FREQUENCY_CHOICES,
  },
  16: {
    kind: "choice",
    eyebrow: "Vos habitudes",
    question: "À quelle fréquence consultez-vous votre compte bancaire ?",
    field: "bankCheckFrequency",
    choices: BANK_CHECK_CHOICES,
  },
  18: {
    kind: "choice",
    eyebrow: "Vos habitudes",
    question: "Utilisez-vous le paiement en plusieurs fois ?",
    field: "installmentUsage",
    choices: INSTALLMENT_CHOICES,
  },
  19: {
    kind: "choice",
    eyebrow: "Votre équilibre",
    question: "Vous arrive-t-il de manquer d’argent avant la fin du mois ?",
    field: "endOfMonthDifficulty",
    choices: END_OF_MONTH_CHOICES,
  },
  21: {
    kind: "currency",
    eyebrow: "Votre épargne",
    question: "Quel est le montant total de votre épargne actuelle ?",
    description: "Une estimation suffit.",
    field: "currentSavings",
    placeholder: "5 000",
  },
  22: {
    kind: "currency",
    eyebrow: "Votre épargne",
    question: "Combien mettez-vous de côté chaque mois ?",
    description: "Indiquez votre moyenne actuelle, même si elle varie.",
    field: "monthlySavings",
    placeholder: "150",
  },
  23: {
    kind: "choice",
    eyebrow: "Votre objectif",
    question: "Pourquoi souhaitez-vous économiser ?",
    field: "goalReason",
    choices: GOAL_CHOICES,
  },
  24: {
    kind: "currency",
    eyebrow: "Votre objectif",
    question: "Combien souhaitez-vous économiser ?",
    description: "Le montant minimum est de 100 €.",
    field: "goalTargetAmount",
    placeholder: "10 000",
  },
};

const FIELD_BY_STEP: Partial<Record<number, keyof OnboardingValues>> = {
  3: "profession",
  4: "incomeType",
  5: "incomeFrequency",
  6: "monthlyIncome",
  8: "housingExpense",
  9: "foodExpense",
  10: "transportExpense",
  11: "restaurantExpense",
  12: "shoppingExpense",
  13: "hobbyExpense",
  14: "subscriptionExpense",
  15: "impulsePurchase",
  16: "bankCheckFrequency",
  18: "installmentUsage",
  19: "endOfMonthDifficulty",
  21: "currentSavings",
  22: "monthlySavings",
  23: "goalReason",
  24: "goalTargetAmount",
};

export function getQuestionField(step: number) {
  return FIELD_BY_STEP[step];
}
