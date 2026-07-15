import type { AnalysisInput, FinancialAnalysis } from "@/entities/financial-profile";

export type GeneratedRecommendation = {
  title: string;
  description: string;
  category: "INCOME" | "EXPENSES" | "SAVINGS" | "HABITS" | "GOAL" | "PROFILE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  impact: "VERY_LOW" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  difficulty: "VERY_EASY" | "EASY" | "MEDIUM" | "HARD";
  potentialSaving: number;
};

export type RecommendationContext = {
  input: AnalysisInput;
  analysis: FinancialAnalysis;
};
