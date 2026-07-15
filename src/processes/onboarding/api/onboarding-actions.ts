"use server";

import { z } from "zod";

import { getSession } from "@/features/auth/server";
import { runInitialAnalysis } from "@/features/financial-analysis";
import type { ApiResponse } from "@/shared/api";
import { prisma } from "@/shared/api/database";
import {
  getNextOnboardingStep,
  onboardingDraftSchema,
  READY_FOR_ANALYSIS_STEP,
  SUMMARY_STEP,
  validateOnboardingStep,
  type OnboardingValues,
} from "@/processes/onboarding/model";

const saveStepInputSchema = z.object({
  step: z.number().int().min(1).max(26),
  values: onboardingDraftSchema,
  returnToSummary: z.boolean().default(false),
});

const positionSchema = z.number().int().min(1).max(READY_FOR_ANALYSIS_STEP);

type StepResult = { nextStep: number };

export async function saveOnboardingStep(input: unknown): Promise<ApiResponse<StepResult>> {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!session.user.emailVerified) return emailVerificationRequiredResponse();

  const parsedInput = saveStepInputSchema.safeParse(input);
  if (!parsedInput.success) return validationResponse();

  const { step, values, returnToSummary } = parsedInput.data;
  const validation = validateOnboardingStep(step, values);
  if (!validation.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: validation.message } };
  }

  const nextStep = returnToSummary ? SUMMARY_STEP : getNextOnboardingStep(step, values);

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: {
      ...getProfileUpdate(step, values),
      currentOnboardingStep: nextStep,
    },
  });

  return { success: true, data: { nextStep } };
}

export async function setOnboardingPosition(input: unknown): Promise<ApiResponse<StepResult>> {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!session.user.emailVerified) return emailVerificationRequiredResponse();

  const parsedStep = positionSchema.safeParse(input);
  if (!parsedStep.success) return validationResponse();

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: { currentOnboardingStep: parsedStep.data },
  });

  return { success: true, data: { nextStep: parsedStep.data } };
}

export async function markQuestionnaireReady(input: unknown): Promise<ApiResponse<StepResult>> {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!session.user.emailVerified) return emailVerificationRequiredResponse();

  const parsedValues = onboardingDraftSchema.safeParse(input);
  if (!parsedValues.success) return validationResponse();

  const incompleteStep = findFirstIncompleteStep(parsedValues.data);
  if (incompleteStep !== null) {
    return {
      success: false,
      error: {
        code: "ONBOARDING_INCOMPLETE",
        message: "Certaines réponses doivent être complétées.",
      },
    };
  }

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: { currentOnboardingStep: READY_FOR_ANALYSIS_STEP },
  });

  return { success: true, data: { nextStep: READY_FOR_ANALYSIS_STEP } };
}

export async function completeOnboardingAnalysis(): Promise<ApiResponse<{ destination: string }>> {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!session.user.emailVerified) return emailVerificationRequiredResponse();

  try {
    await runInitialAnalysis(session.user.id);
    return { success: true, data: { destination: "/dashboard" } };
  } catch (error) {
    if (error instanceof Error && error.message === "ONBOARDING_INCOMPLETE") {
      return {
        success: false,
        error: {
          code: "ONBOARDING_INCOMPLETE",
          message: "Certaines réponses doivent être complétées avant l’analyse.",
        },
      };
    }
    return {
      success: false,
      error: {
        code: "ANALYSIS_FAILED",
        message: "L’analyse n’a pas pu être créée. Réessayez dans quelques instants.",
      },
    };
  }
}

function findFirstIncompleteStep(values: OnboardingValues) {
  for (let step = 1; step <= 26; step += 1) {
    if (step === 21 && values.hasSavings === false) continue;
    if (!validateOnboardingStep(step, values).success) return step;
  }

  return null;
}

function getProfileUpdate(step: number, values: OnboardingValues) {
  switch (step) {
    case 1:
      return { birthDate: new Date(`${values.birthDate}T00:00:00.000Z`) };
    case 2:
      return { country: values.country, currency: "EUR" };
    case 3:
      return { profession: toProfession(values.profession) };
    case 4:
      return { incomeType: toIncomeType(values.incomeType) };
    case 5:
      return { incomeFrequency: toIncomeFrequency(values.incomeFrequency) };
    case 6:
      return { monthlyIncome: values.monthlyIncome };
    case 7:
      return {
        hasAdditionalIncome: values.hasAdditionalIncome,
        additionalIncome: values.hasAdditionalIncome ? values.additionalIncome : 0,
      };
    case 8:
      return { housingExpense: values.housingExpense };
    case 9:
      return { foodExpense: values.foodExpense };
    case 10:
      return { transportExpense: values.transportExpense };
    case 11:
      return { restaurantExpense: values.restaurantExpense };
    case 12:
      return { shoppingExpense: values.shoppingExpense };
    case 13:
      return { hobbyExpense: values.hobbyExpense };
    case 14:
      return { subscriptionExpense: values.subscriptionExpense };
    case 15:
      return { impulsePurchase: toFrequency(values.impulsePurchase) };
    case 16:
      return { bankCheckFrequency: toBankCheckFrequency(values.bankCheckFrequency) };
    case 17:
      return {
        hasBudget: values.hasBudget,
        budgetCompliance: values.hasBudget ? toFrequency(values.budgetCompliance) : null,
      };
    case 18:
      return { installmentUsage: toInstallmentFrequency(values.installmentUsage) };
    case 19:
      return { endOfMonthDifficulty: toEndOfMonthFrequency(values.endOfMonthDifficulty) };
    case 20:
      return {
        hasSavings: values.hasSavings,
        currentSavings: values.hasSavings ? values.currentSavings : 0,
      };
    case 21:
      return { currentSavings: values.currentSavings };
    case 22:
      return { monthlySavings: values.monthlySavings };
    case 23:
      return { goalReason: values.goalReason };
    case 24:
      return { goalTargetAmount: values.goalTargetAmount };
    case 25:
      return { goalTargetDate: new Date(`${values.goalTargetDate}-01T00:00:00.000Z`) };
    case 26:
      return { goalPriority: values.goalPriority };
    default:
      return {};
  }
}

function toProfession(value: string) {
  return z
    .enum(["EMPLOYEE", "FREELANCER", "ENTREPRENEUR", "STUDENT", "UNEMPLOYED", "RETIRED"])
    .parse(value);
}

function toIncomeType(value: string) {
  return z.enum(["SALARY", "BUSINESS", "BENEFITS", "PENSION", "MULTIPLE"]).parse(value);
}

function toIncomeFrequency(value: string) {
  return z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY", "VARIABLE"]).parse(value);
}

function toFrequency(value: string) {
  return z.enum(["NEVER", "RARELY", "SOMETIMES", "OFTEN", "VERY_OFTEN", "ALWAYS"]).parse(value);
}

function toBankCheckFrequency(value: string) {
  return z
    .enum(["DAILY", "SEVERAL_TIMES_A_WEEK", "WEEKLY", "A_FEW_TIMES_A_MONTH", "RARELY"])
    .parse(value);
}

function toInstallmentFrequency(value: string) {
  return z.enum(["NEVER", "RARELY", "SOMETIMES", "OFTEN"]).parse(value);
}

function toEndOfMonthFrequency(value: string) {
  return z.enum(["NEVER", "RARELY", "SOMETIMES", "OFTEN", "EVERY_MONTH"]).parse(value);
}

function unauthorizedResponse(): ApiResponse<never> {
  return {
    success: false,
    error: { code: "AUTH_UNAUTHORIZED", message: "Votre session a expiré." },
  };
}

function emailVerificationRequiredResponse(): ApiResponse<never> {
  return {
    success: false,
    error: {
      code: "AUTH_EMAIL_NOT_VERIFIED",
      message: "Vérifiez votre adresse email pour continuer.",
    },
  };
}

function validationResponse(): ApiResponse<never> {
  return {
    success: false,
    error: { code: "VALIDATION_ERROR", message: "Certaines informations doivent être corrigées." },
  };
}
