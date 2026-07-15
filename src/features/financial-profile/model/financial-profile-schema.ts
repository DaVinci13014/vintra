import { z } from "zod";

const amount = z.number().finite().min(0).max(100_000_000);

export const financialProfileInputSchema = z.object({
  incomeFrequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY", "VARIABLE"]),
  monthlyIncome: amount,
  additionalIncome: amount,
  housingExpense: amount,
  foodExpense: amount,
  transportExpense: amount,
  restaurantExpense: amount,
  shoppingExpense: amount,
  hobbyExpense: amount,
  subscriptionExpense: amount,
  currentSavings: amount,
  monthlySavings: amount,
});

export type FinancialProfileInput = z.infer<typeof financialProfileInputSchema>;
