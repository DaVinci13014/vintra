import { prisma } from "@/shared/api/database";

export async function getEditableFinancialProfile(userId: string) {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile?.onboardingCompleted || !profile.incomeFrequency) return null;
  return {
    currency: profile.currency,
    values: {
      incomeFrequency: profile.incomeFrequency,
      monthlyIncome: profile.monthlyIncome?.toNumber() ?? 0,
      additionalIncome: profile.additionalIncome?.toNumber() ?? 0,
      housingExpense: profile.housingExpense?.toNumber() ?? 0,
      foodExpense: profile.foodExpense?.toNumber() ?? 0,
      transportExpense: profile.transportExpense?.toNumber() ?? 0,
      restaurantExpense: profile.restaurantExpense?.toNumber() ?? 0,
      shoppingExpense: profile.shoppingExpense?.toNumber() ?? 0,
      hobbyExpense: profile.hobbyExpense?.toNumber() ?? 0,
      subscriptionExpense: profile.subscriptionExpense?.toNumber() ?? 0,
      currentSavings: profile.currentSavings?.toNumber() ?? 0,
      monthlySavings: profile.monthlySavings?.toNumber() ?? 0,
    },
  };
}
