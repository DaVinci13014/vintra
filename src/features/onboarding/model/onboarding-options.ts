import type { Choice, OnboardingSection } from "./onboarding-types";

export const PROFESSION_CHOICES: Choice[] = [
  { value: "EMPLOYEE", label: "Salarié" },
  { value: "FREELANCER", label: "Indépendant" },
  { value: "ENTREPRENEUR", label: "Entrepreneur" },
  { value: "STUDENT", label: "Étudiant" },
  { value: "UNEMPLOYED", label: "Sans emploi" },
  { value: "RETIRED", label: "Retraité" },
];

export const INCOME_TYPE_CHOICES: Choice[] = [
  { value: "SALARY", label: "Salaire" },
  { value: "BUSINESS", label: "Revenus d’activité" },
  { value: "BENEFITS", label: "Aides" },
  { value: "PENSION", label: "Pension" },
  { value: "MULTIPLE", label: "Plusieurs revenus" },
];

export const INCOME_FREQUENCY_CHOICES: Choice[] = [
  { value: "WEEKLY", label: "Chaque semaine" },
  { value: "BIWEEKLY", label: "Toutes les deux semaines" },
  { value: "MONTHLY", label: "Chaque mois" },
  { value: "VARIABLE", label: "Variable" },
];

export const FREQUENCY_CHOICES: Choice[] = [
  { value: "NEVER", label: "Jamais" },
  { value: "RARELY", label: "Rarement" },
  { value: "SOMETIMES", label: "Parfois" },
  { value: "OFTEN", label: "Souvent" },
  { value: "VERY_OFTEN", label: "Très souvent" },
];

export const BANK_CHECK_CHOICES: Choice[] = [
  { value: "DAILY", label: "Tous les jours" },
  { value: "SEVERAL_TIMES_A_WEEK", label: "Plusieurs fois par semaine" },
  { value: "WEEKLY", label: "Une fois par semaine" },
  { value: "A_FEW_TIMES_A_MONTH", label: "Quelques fois par mois" },
  { value: "RARELY", label: "Rarement" },
];

export const BUDGET_COMPLIANCE_CHOICES: Choice[] = [
  { value: "ALWAYS", label: "Toujours" },
  { value: "OFTEN", label: "Souvent" },
  { value: "SOMETIMES", label: "Parfois" },
  { value: "RARELY", label: "Rarement" },
];

export const INSTALLMENT_CHOICES: Choice[] = [
  { value: "NEVER", label: "Jamais" },
  { value: "RARELY", label: "Rarement" },
  { value: "SOMETIMES", label: "Parfois" },
  { value: "OFTEN", label: "Souvent" },
];

export const END_OF_MONTH_CHOICES: Choice[] = [
  { value: "NEVER", label: "Jamais" },
  { value: "RARELY", label: "Rarement" },
  { value: "SOMETIMES", label: "Parfois" },
  { value: "OFTEN", label: "Souvent" },
  { value: "EVERY_MONTH", label: "Tous les mois" },
];

export const GOAL_CHOICES: Choice[] = [
  { value: "EMERGENCY_FUND", label: "Épargne de sécurité" },
  { value: "CAR", label: "Acheter une voiture" },
  { value: "HOME", label: "Acheter un logement" },
  { value: "TRAVEL", label: "Voyager" },
  { value: "PROJECT", label: "Financer un projet" },
  { value: "FUTURE", label: "Préparer l’avenir" },
  { value: "OTHER", label: "Autre" },
];

export const YES_NO_CHOICES: Choice[] = [
  { value: "yes", label: "Oui" },
  { value: "no", label: "Non" },
];

const SECTIONS: Array<{ from: number; to: number; section: OnboardingSection }> = [
  { from: 1, to: 2, section: { label: "Informations personnelles", shortLabel: "Profil" } },
  { from: 3, to: 5, section: { label: "Situation professionnelle", shortLabel: "Activité" } },
  { from: 6, to: 7, section: { label: "Situation financière", shortLabel: "Revenus" } },
  { from: 8, to: 14, section: { label: "Dépenses mensuelles", shortLabel: "Dépenses" } },
  { from: 15, to: 22, section: { label: "Habitudes financières", shortLabel: "Habitudes" } },
  { from: 23, to: 28, section: { label: "Votre objectif", shortLabel: "Objectif" } },
];

export function getOnboardingSection(step: number): OnboardingSection {
  return (
    SECTIONS.find(({ from, to }) => step >= from && step <= to)?.section ?? SECTIONS[0]!.section
  );
}

export function getChoiceLabel(choices: Choice[], value: string) {
  return choices.find((choice) => choice.value === value)?.label ?? value;
}
