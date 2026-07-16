import { READY_FOR_ANALYSIS_STEP, SUMMARY_STEP, type OnboardingValues } from "./onboarding-types";

export function getNextOnboardingStep(step: number, values: OnboardingValues) {
  if (step === 20 && values.hasSavings === false) {
    return 22;
  }

  if (step >= 26) {
    return SUMMARY_STEP;
  }

  return step + 1;
}

export function getPreviousOnboardingStep(step: number, values: OnboardingValues) {
  if (step === READY_FOR_ANALYSIS_STEP) {
    return SUMMARY_STEP;
  }

  if (step === 22 && values.hasSavings === false) {
    return 20;
  }

  return Math.max(1, step - 1);
}

export function clampOnboardingStep(step: number) {
  if (step < 1) return 1;
  if (step > READY_FOR_ANALYSIS_STEP) return READY_FOR_ANALYSIS_STEP;
  return step;
}
