import { prisma } from "@/shared/api/database";
import {
  clampOnboardingStep,
  EMPTY_ONBOARDING_VALUES,
  type OnboardingState,
} from "@/features/onboarding/model";

export async function getOnboardingState(userId: string): Promise<OnboardingState> {
  const profile = await prisma.profile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  return {
    currentStep: clampOnboardingStep(profile.currentOnboardingStep),
    completed: profile.onboardingCompleted,
    values: {
      ...EMPTY_ONBOARDING_VALUES,
      birthDate: formatDate(profile.birthDate),
      country: profile.country ?? "",
      profession: profile.profession ?? "",
      incomeType: profile.incomeType ?? "",
      incomeFrequency: profile.incomeFrequency ?? "",
      monthlyIncome: toNumber(profile.monthlyIncome),
      hasAdditionalIncome: profile.hasAdditionalIncome,
      additionalIncome: toNumber(profile.additionalIncome),
      housingExpense: toNumber(profile.housingExpense),
      foodExpense: toNumber(profile.foodExpense),
      transportExpense: toNumber(profile.transportExpense),
      restaurantExpense: toNumber(profile.restaurantExpense),
      shoppingExpense: toNumber(profile.shoppingExpense),
      hobbyExpense: toNumber(profile.hobbyExpense),
      subscriptionExpense: toNumber(profile.subscriptionExpense),
      impulsePurchase: profile.impulsePurchase ?? "",
      bankCheckFrequency: profile.bankCheckFrequency ?? "",
      hasBudget: profile.hasBudget,
      budgetCompliance: profile.budgetCompliance ?? "",
      installmentUsage: profile.installmentUsage ?? "",
      endOfMonthDifficulty: profile.endOfMonthDifficulty ?? "",
      hasSavings: profile.hasSavings,
      currentSavings: toNumber(profile.currentSavings),
      monthlySavings: toNumber(profile.monthlySavings),
      goalReason: profile.goalReason ?? "",
      goalTargetAmount: toNumber(profile.goalTargetAmount),
      goalTargetDate: formatMonth(profile.goalTargetDate),
      goalPriority: profile.goalPriority ?? 5,
    },
  };
}

function toNumber(value: { toNumber(): number } | null) {
  return value?.toNumber() ?? null;
}

function formatDate(value: Date | null) {
  return value?.toISOString().slice(0, 10) ?? "";
}

function formatMonth(value: Date | null) {
  return value?.toISOString().slice(0, 7) ?? "";
}
