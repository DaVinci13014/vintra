import type { FieldPath, FieldPathValue } from "react-hook-form";

export const TOTAL_QUESTION_STEPS = 26;
export const SUMMARY_STEP = 27;
export const READY_FOR_ANALYSIS_STEP = 28;

export type OnboardingValues = {
  birthDate: string;
  country: string;
  profession: string;
  incomeType: string;
  incomeFrequency: string;
  monthlyIncome: number | null;
  hasAdditionalIncome: boolean | null;
  additionalIncome: number | null;
  housingExpense: number | null;
  foodExpense: number | null;
  transportExpense: number | null;
  restaurantExpense: number | null;
  shoppingExpense: number | null;
  hobbyExpense: number | null;
  subscriptionExpense: number | null;
  impulsePurchase: string;
  bankCheckFrequency: string;
  hasBudget: boolean | null;
  budgetCompliance: string;
  installmentUsage: string;
  endOfMonthDifficulty: string;
  hasSavings: boolean | null;
  currentSavings: number | null;
  monthlySavings: number | null;
  goalReason: string;
  goalTargetAmount: number | null;
  goalTargetDate: string;
  goalPriority: number | null;
};

export type OnboardingState = {
  currentStep: number;
  values: OnboardingValues;
};

export type OnboardingFieldSetter = <Key extends FieldPath<OnboardingValues>>(
  field: Key,
  value: FieldPathValue<OnboardingValues, Key>,
) => void;

export type Choice = {
  value: string;
  label: string;
};

export type OnboardingSection = {
  label: string;
  shortLabel: string;
};

export const EMPTY_ONBOARDING_VALUES: OnboardingValues = {
  birthDate: "",
  country: "",
  profession: "",
  incomeType: "",
  incomeFrequency: "",
  monthlyIncome: null,
  hasAdditionalIncome: null,
  additionalIncome: null,
  housingExpense: null,
  foodExpense: null,
  transportExpense: null,
  restaurantExpense: null,
  shoppingExpense: null,
  hobbyExpense: null,
  subscriptionExpense: null,
  impulsePurchase: "",
  bankCheckFrequency: "",
  hasBudget: null,
  budgetCompliance: "",
  installmentUsage: "",
  endOfMonthDifficulty: "",
  hasSavings: null,
  currentSavings: null,
  monthlySavings: null,
  goalReason: "",
  goalTargetAmount: null,
  goalTargetDate: "",
  goalPriority: 5,
};
