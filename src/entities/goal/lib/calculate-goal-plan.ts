import type { FinancialProfileType, SavingPlanDifficulty } from "@/entities/financial-profile";

export type GoalPlanInput = {
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  savingCapacity: number;
  profileType: FinancialProfileType;
};

export function calculateGoalPlan(input: GoalPlanInput, now = new Date()) {
  const progress = calculateGoalProgress(input.currentAmount, input.targetAmount);
  const remainingAmount = money(Math.max(0, input.targetAmount - input.currentAmount));
  const ratio = { SAVER: 0.9, BALANCED: 0.8, SPENDER: 0.6, FRAGILE: 0.3 }[input.profileType];
  const recommendedMonthlySaving = money(Math.max(0, input.savingCapacity * ratio));
  const availableMonths = Math.max(1, monthsBetween(now, input.targetDate));
  const requiredMonthlySaving = money(remainingAmount / availableMonths);
  const difficulty = getDifficulty(remainingAmount, requiredMonthlySaving, input.savingCapacity);
  const estimatedMonths =
    recommendedMonthlySaving > 0 ? Math.ceil(remainingAmount / recommendedMonthlySaving) : 0;

  return {
    progress,
    remainingAmount,
    recommendedMonthlySaving,
    estimatedCompletionDate:
      remainingAmount === 0
        ? now
        : recommendedMonthlySaving > 0
          ? addMonths(now, estimatedMonths)
          : null,
    difficulty,
    status: progress >= 100 ? ("COMPLETED" as const) : ("ACTIVE" as const),
    milestones: [25, 50, 75, 100].map((threshold) => ({
      threshold,
      reached: progress >= threshold,
    })),
  };
}

export function calculateGoalProgress(currentAmount: number, targetAmount: number) {
  return Math.min(100, percentage(currentAmount, targetAmount));
}

function getDifficulty(
  remaining: number,
  required: number,
  capacity: number,
): SavingPlanDifficulty {
  if (remaining === 0) return "EASY";
  if (capacity === 0 || required > capacity) return "UNREALISTIC";
  const effort = required / capacity;
  if (effort <= 0.6) return "EASY";
  if (effort <= 0.85) return "NORMAL";
  return "CHALLENGING";
}

function percentage(value: number, total: number) {
  return total <= 0 ? 0 : Math.round(Math.min(100, (value / total) * 100) * 100) / 100;
}

function money(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function monthsBetween(from: Date, to: Date) {
  return (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + to.getUTCMonth() - from.getUTCMonth();
}

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
}
