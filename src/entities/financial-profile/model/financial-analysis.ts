export type Frequency = "NEVER" | "RARELY" | "SOMETIMES" | "OFTEN" | "VERY_OFTEN" | "ALWAYS";

export type AnalysisInput = {
  incomeFrequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "VARIABLE";
  monthlyIncome: number;
  additionalIncome: number;
  housingExpense: number;
  foodExpense: number;
  transportExpense: number;
  restaurantExpense: number;
  shoppingExpense: number;
  hobbyExpense: number;
  subscriptionExpense: number;
  impulsePurchase: Frequency;
  bankCheckFrequency:
    "DAILY" | "SEVERAL_TIMES_A_WEEK" | "WEEKLY" | "A_FEW_TIMES_A_MONTH" | "RARELY";
  hasBudget: boolean;
  budgetCompliance: Frequency | null;
  installmentUsage: "NEVER" | "RARELY" | "SOMETIMES" | "OFTEN";
  endOfMonthDifficulty: "NEVER" | "RARELY" | "SOMETIMES" | "OFTEN" | "EVERY_MONTH";
  currentSavings: number;
  monthlySavings: number;
  goalTargetAmount: number;
  goalTargetDate: Date;
};

export type FinancialProfileType = "SAVER" | "BALANCED" | "SPENDER" | "FRAGILE";
export type SavingPlanDifficulty = "EASY" | "NORMAL" | "CHALLENGING" | "UNREALISTIC";

export type FinancialAnalysis = {
  monthlyIncome: number;
  monthlyExpenses: number;
  savingCapacity: number;
  savingRate: number;
  remainingBudget: number;
  expenseRatio: number;
  goalRemainingAmount: number;
  goalProgress: number;
  budgetScore: number;
  savingScore: number;
  disciplineScore: number;
  financialHealthScore: number;
  profileType: FinancialProfileType;
  recommendedMonthlySaving: number;
  estimatedCompletionDate: Date | null;
  difficulty: SavingPlanDifficulty;
};
