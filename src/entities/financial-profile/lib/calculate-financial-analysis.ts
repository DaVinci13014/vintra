import type {
  AnalysisInput,
  FinancialAnalysis,
  FinancialProfileType,
  Frequency,
  SavingPlanDifficulty,
} from "../model/financial-analysis";

const MONTH_IN_MILLISECONDS = 30.4375 * 24 * 60 * 60 * 1_000;

export function calculateFinancialAnalysis(
  input: AnalysisInput,
  now = new Date(),
): FinancialAnalysis {
  validateInput(input);

  const monthlyIncome = money(input.monthlyIncome + input.additionalIncome);
  const monthlyExpenses = money(
    input.housingExpense +
      input.foodExpense +
      input.transportExpense +
      input.restaurantExpense +
      input.shoppingExpense +
      input.hobbyExpense +
      input.subscriptionExpense,
  );
  const remainingBudget = money(monthlyIncome - monthlyExpenses);
  const savingCapacity = money(Math.max(0, remainingBudget));
  const savingRate = percentage(savingCapacity, monthlyIncome);
  const expenseRatio = percentage(monthlyExpenses, monthlyIncome);
  const goalRemainingAmount = money(Math.max(0, input.goalTargetAmount - input.currentSavings));
  const goalProgress = Math.min(100, percentage(input.currentSavings, input.goalTargetAmount));
  const budgetScore = calculateBudgetScore(expenseRatio, input.incomeFrequency);
  const savingScore = calculateSavingScore(input, savingRate, savingCapacity, monthlyExpenses);
  const disciplineScore = calculateDisciplineScore(input);
  const financialHealthScore = score(
    savingScore * 0.4 + budgetScore * 0.3 + disciplineScore * 0.3,
  );
  const profileType = determineProfile(input, {
    expenseRatio,
    savingRate,
    remainingBudget,
    financialHealthScore,
    disciplineScore,
  });
  const recommendedMonthlySaving = calculateRecommendedSaving(savingCapacity, profileType);
  const monthsToTarget = monthsBetween(now, input.goalTargetDate);
  const requiredMonthlySaving =
    goalRemainingAmount === 0 ? 0 : money(goalRemainingAmount / Math.max(1, monthsToTarget));
  const difficulty = determineDifficulty(
    goalRemainingAmount,
    requiredMonthlySaving,
    savingCapacity,
  );
  const estimatedMonths =
    goalRemainingAmount > 0 && recommendedMonthlySaving > 0
      ? Math.ceil(goalRemainingAmount / recommendedMonthlySaving)
      : 0;

  return {
    monthlyIncome,
    monthlyExpenses,
    savingCapacity,
    savingRate,
    remainingBudget,
    expenseRatio,
    goalRemainingAmount,
    goalProgress,
    budgetScore,
    savingScore,
    disciplineScore,
    financialHealthScore,
    profileType,
    recommendedMonthlySaving,
    estimatedCompletionDate:
      goalRemainingAmount === 0
        ? now
        : recommendedMonthlySaving > 0
          ? addMonths(now, estimatedMonths)
          : null,
    difficulty,
  };
}

function calculateBudgetScore(expenseRatio: number, frequency: AnalysisInput["incomeFrequency"]) {
  const expenseScore = band(expenseRatio, [
    [50, 100],
    [65, 85],
    [80, 65],
    [95, 40],
    [Number.POSITIVE_INFINITY, 10],
  ]);
  const stabilityScore = { MONTHLY: 100, BIWEEKLY: 90, WEEKLY: 85, VARIABLE: 55 }[frequency];
  return score(expenseScore * 0.75 + stabilityScore * 0.25);
}

function calculateSavingScore(
  input: AnalysisInput,
  savingRate: number,
  savingCapacity: number,
  monthlyExpenses: number,
) {
  const capacityScore = band(savingRate, [
    [0, 10],
    [5, 40],
    [10, 60],
    [20, 80],
    [Number.POSITIVE_INFINITY, 100],
  ]);
  const reserveMonths = monthlyExpenses > 0 ? input.currentSavings / monthlyExpenses : 6;
  const reserveScore = band(reserveMonths, [
    [0, 0],
    [1, 35],
    [3, 55],
    [6, 80],
    [Number.POSITIVE_INFINITY, 100],
  ]);
  const consistencyRatio = savingCapacity > 0 ? input.monthlySavings / savingCapacity : 0;
  const consistencyScore = band(consistencyRatio, [
    [0, 0],
    [0.25, 35],
    [0.5, 60],
    [0.75, 80],
    [Number.POSITIVE_INFINITY, 100],
  ]);
  return score(capacityScore * 0.5 + reserveScore * 0.25 + consistencyScore * 0.25);
}

function calculateDisciplineScore(input: AnalysisInput) {
  const budget = input.hasBudget ? frequencyValue(input.budgetCompliance) : 20;
  const impulse = inverseFrequencyValue(input.impulsePurchase);
  const bank = {
    DAILY: 100,
    SEVERAL_TIMES_A_WEEK: 90,
    WEEKLY: 80,
    A_FEW_TIMES_A_MONTH: 55,
    RARELY: 25,
  }[input.bankCheckFrequency];
  const installment = { NEVER: 100, RARELY: 75, SOMETIMES: 45, OFTEN: 15 }[
    input.installmentUsage
  ];
  const endOfMonth = { NEVER: 100, RARELY: 75, SOMETIMES: 50, OFTEN: 20, EVERY_MONTH: 0 }[
    input.endOfMonthDifficulty
  ];
  return score((budget + impulse + bank + installment + endOfMonth) / 5);
}

function determineProfile(
  input: AnalysisInput,
  indicators: Pick<
    FinancialAnalysis,
    | "expenseRatio"
    | "savingRate"
    | "remainingBudget"
    | "financialHealthScore"
    | "disciplineScore"
  >,
): FinancialProfileType {
  if (
    indicators.remainingBudget < 0 ||
    indicators.financialHealthScore < 25 ||
    (["OFTEN", "EVERY_MONTH"].includes(input.endOfMonthDifficulty) && indicators.savingRate < 5)
  ) {
    return "FRAGILE";
  }
  if (
    indicators.expenseRatio >= 80 ||
    (["OFTEN", "VERY_OFTEN"].includes(input.impulsePurchase) && indicators.savingRate < 10)
  ) {
    return "SPENDER";
  }
  if (
    indicators.financialHealthScore >= 75 &&
    indicators.savingRate >= 20 &&
    indicators.disciplineScore >= 70
  ) {
    return "SAVER";
  }
  return "BALANCED";
}

function calculateRecommendedSaving(capacity: number, profile: FinancialProfileType) {
  const ratio = { SAVER: 0.9, BALANCED: 0.8, SPENDER: 0.6, FRAGILE: 0.3 }[profile];
  return money(Math.min(capacity, capacity * ratio));
}

function determineDifficulty(
  remainingAmount: number,
  requiredMonthlySaving: number,
  savingCapacity: number,
): SavingPlanDifficulty {
  if (remainingAmount === 0) return "EASY";
  if (savingCapacity === 0 || requiredMonthlySaving > savingCapacity) return "UNREALISTIC";
  const effortRatio = requiredMonthlySaving / savingCapacity;
  if (effortRatio <= 0.6) return "EASY";
  if (effortRatio <= 0.85) return "NORMAL";
  return "CHALLENGING";
}

function frequencyValue(value: Frequency | null) {
  if (!value) return 20;
  return { NEVER: 0, RARELY: 25, SOMETIMES: 50, OFTEN: 75, VERY_OFTEN: 90, ALWAYS: 100 }[
    value
  ];
}

function inverseFrequencyValue(value: Exclude<Frequency, "ALWAYS">) {
  return { NEVER: 100, RARELY: 80, SOMETIMES: 55, OFTEN: 25, VERY_OFTEN: 5 }[value];
}

function band(value: number, bands: ReadonlyArray<readonly [number, number]>) {
  return bands.find(([limit]) => value <= limit)?.[1] ?? 0;
}

function percentage(numerator: number, denominator: number) {
  return denominator <= 0 ? 0 : decimals((numerator / denominator) * 100);
}

function money(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function decimals(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function score(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function monthsBetween(from: Date, to: Date) {
  return Math.max(1, Math.ceil((to.getTime() - from.getTime()) / MONTH_IN_MILLISECONDS));
}

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
}

function validateInput(input: AnalysisInput) {
  const amounts = [
    input.monthlyIncome,
    input.additionalIncome,
    input.housingExpense,
    input.foodExpense,
    input.transportExpense,
    input.restaurantExpense,
    input.shoppingExpense,
    input.hobbyExpense,
    input.subscriptionExpense,
    input.currentSavings,
    input.monthlySavings,
    input.goalTargetAmount,
  ];
  if (amounts.some((amount) => !Number.isFinite(amount) || amount < 0)) {
    throw new Error("Les montants financiers doivent être positifs et valides.");
  }
  if (input.goalTargetAmount < 100) {
    throw new Error("Le montant de l’objectif doit être supérieur ou égal à 100.");
  }
  if (!(input.goalTargetDate instanceof Date) || Number.isNaN(input.goalTargetDate.getTime())) {
    throw new Error("La date cible doit être valide.");
  }
}
