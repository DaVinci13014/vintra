"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import {
  getOnboardingSection,
  getPreviousOnboardingStep,
  READY_FOR_ANALYSIS_STEP,
  SUMMARY_STEP,
  TOTAL_QUESTION_STEPS,
  validateOnboardingStep,
  type OnboardingFieldSetter,
  type OnboardingState,
  type OnboardingValues,
} from "@/features/onboarding/model";
import { Button, FeedbackMessage } from "@/shared/ui";
import {
  completeOnboardingAnalysis,
  markQuestionnaireReady,
  saveOnboardingStep,
  setOnboardingPosition,
} from "../api/onboarding-actions";
import { OnboardingSummary } from "./onboarding-summary";
import { QuestionRenderer } from "./question-renderer";
import { QuestionnaireReady } from "./questionnaire-ready";

type OnboardingFlowProps = {
  initialState: OnboardingState;
  firstName: string;
};

export function OnboardingFlow({ initialState, firstName }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialState.currentStep);
  const [isEditingFromSummary, setIsEditingFromSummary] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { watch, getValues, setValue, handleSubmit } = useForm<OnboardingValues>({
    defaultValues: initialState.values,
    mode: "onChange",
  });
  const values = watch();
  const section = getOnboardingSection(currentStep);
  const progress = Math.min(currentStep, TOTAL_QUESTION_STEPS) / TOTAL_QUESTION_STEPS;

  const setField = useCallback<OnboardingFieldSetter>(
    (field, value) => {
      setValue(field, value, { shouldDirty: true, shouldTouch: true });
      setErrorMessage(null);
    },
    [setValue],
  );

  function moveToStep(nextStep: number, editingFromSummary = false) {
    setErrorMessage(null);
    startTransition(async () => {
      const response = await setOnboardingPosition(nextStep);
      if (!response.success) {
        setErrorMessage(response.error.message);
        return;
      }

      setIsEditingFromSummary(editingFromSummary);
      setCurrentStep(response.data.nextStep);
    });
  }

  function handleBack() {
    if (currentStep === 1) return;

    if (isEditingFromSummary) {
      moveToStep(SUMMARY_STEP);
      return;
    }

    moveToStep(getPreviousOnboardingStep(currentStep, getValues()));
  }

  function handleEdit(step: number) {
    moveToStep(step, true);
  }

  function handleContinue(formValues: OnboardingValues) {
    if (currentStep === SUMMARY_STEP) {
      startTransition(async () => {
        const response = await markQuestionnaireReady(formValues);
        if (!response.success) {
          setErrorMessage(response.error.message);
          return;
        }
        await launchAnalysis();
      });
      return;
    }

    const validation = validateOnboardingStep(currentStep, formValues);
    if (!validation.success) {
      setErrorMessage(validation.message);
      return;
    }

    startTransition(async () => {
      const response = await saveOnboardingStep({
        step: currentStep,
        values: formValues,
        returnToSummary: isEditingFromSummary,
      });

      if (!response.success) {
        setErrorMessage(response.error.message);
        return;
      }

      setIsEditingFromSummary(false);
      setCurrentStep(response.data.nextStep);
    });
  }

  async function launchAnalysis() {
    setErrorMessage(null);
    const response = await completeOnboardingAnalysis();
    if (!response.success) {
      setErrorMessage(response.error.message);
      return;
    }
    router.push(response.data.destination);
    router.refresh();
  }

  function handleLaunchAnalysis() {
    startTransition(launchAnalysis);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <div className="mb-4 flex items-center justify-between gap-4 text-xs text-secondary-text">
          <span>{section.label}</span>
          <span className="font-mono">
            {currentStep >= SUMMARY_STEP
              ? "100 %"
              : `Étape ${currentStep} sur ${TOTAL_QUESTION_STEPS}`}
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-card"
          aria-label="Progression de l’onboarding"
        >
          <motion.div
            className="h-full rounded-full bg-brand"
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </div>

      <form className="flex flex-1 flex-col" onSubmit={handleSubmit(handleContinue)} noValidate>
        <div className="relative flex-1 rounded-3xl border border-border bg-surface p-5 sm:p-8 lg:p-10">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isPending}
              className="mb-8 flex size-11 items-center justify-center rounded-xl border border-border bg-card text-secondary-text outline-none transition hover:bg-elevated hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50"
              aria-label="Revenir à l’étape précédente"
            >
              <ArrowLeft aria-hidden="true" size={19} />
            </button>
          )}

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {currentStep < SUMMARY_STEP && (
              <QuestionRenderer step={currentStep} values={values} setField={setField} />
            )}
            {currentStep === SUMMARY_STEP && (
              <OnboardingSummary values={values} onEdit={handleEdit} />
            )}
            {currentStep === READY_FOR_ANALYSIS_STEP && (
              <QuestionnaireReady
                firstName={firstName}
                onReview={() => moveToStep(SUMMARY_STEP)}
                onAnalyze={handleLaunchAnalysis}
                isPending={isPending}
              />
            )}
          </motion.div>

          <FeedbackMessage className="mt-6" error={errorMessage} />
        </div>

        {currentStep < READY_FOR_ANALYSIS_STEP && (
          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="hidden text-xs text-muted sm:block">
              {isPending
                ? "Enregistrement..."
                : "Votre progression est enregistrée à chaque étape."}
            </p>
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="w-full sm:ml-auto sm:w-auto"
            >
              {isPending
                ? "Enregistrement..."
                : currentStep === SUMMARY_STEP
                  ? "Créer mon analyse"
                  : "Continuer"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
