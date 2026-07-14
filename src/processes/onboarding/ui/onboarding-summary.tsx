import { Pencil } from "lucide-react";

import {
  BANK_CHECK_CHOICES,
  END_OF_MONTH_CHOICES,
  FREQUENCY_CHOICES,
  getChoiceLabel,
  GOAL_CHOICES,
  INCOME_FREQUENCY_CHOICES,
  INCOME_TYPE_CHOICES,
  INSTALLMENT_CHOICES,
  PROFESSION_CHOICES,
  type OnboardingValues,
} from "@/processes/onboarding/model";

type OnboardingSummaryProps = {
  values: OnboardingValues;
  onEdit: (step: number) => void;
};

export function OnboardingSummary({ values, onEdit }: OnboardingSummaryProps) {
  const sections = [
    {
      title: "Informations personnelles",
      step: 1,
      rows: [
        ["Date de naissance", formatDate(values.birthDate)],
        ["Pays", values.country],
      ],
    },
    {
      title: "Situation professionnelle",
      step: 3,
      rows: [
        ["Situation", getChoiceLabel(PROFESSION_CHOICES, values.profession)],
        ["Revenus", getChoiceLabel(INCOME_TYPE_CHOICES, values.incomeType)],
        ["Fréquence", getChoiceLabel(INCOME_FREQUENCY_CHOICES, values.incomeFrequency)],
      ],
    },
    {
      title: "Revenus",
      step: 6,
      rows: [
        ["Revenu mensuel", formatCurrency(values.monthlyIncome)],
        [
          "Revenus complémentaires",
          values.hasAdditionalIncome ? formatCurrency(values.additionalIncome) : "Non",
        ],
      ],
    },
    {
      title: "Dépenses mensuelles",
      step: 8,
      rows: [
        ["Logement", formatCurrency(values.housingExpense)],
        ["Alimentation", formatCurrency(values.foodExpense)],
        ["Transport", formatCurrency(values.transportExpense)],
        ["Restaurants", formatCurrency(values.restaurantExpense)],
        ["Shopping", formatCurrency(values.shoppingExpense)],
        ["Loisirs", formatCurrency(values.hobbyExpense)],
        ["Abonnements", formatCurrency(values.subscriptionExpense)],
      ],
    },
    {
      title: "Habitudes et épargne",
      step: 15,
      rows: [
        ["Achats impulsifs", getChoiceLabel(FREQUENCY_CHOICES, values.impulsePurchase)],
        ["Consultation du compte", getChoiceLabel(BANK_CHECK_CHOICES, values.bankCheckFrequency)],
        ["Budget mensuel", values.hasBudget ? "Oui" : "Non"],
        ["Paiement fractionné", getChoiceLabel(INSTALLMENT_CHOICES, values.installmentUsage)],
        ["Fin de mois", getChoiceLabel(END_OF_MONTH_CHOICES, values.endOfMonthDifficulty)],
        ["Épargne actuelle", values.hasSavings ? formatCurrency(values.currentSavings) : "Aucune"],
        ["Épargne mensuelle", formatCurrency(values.monthlySavings)],
      ],
    },
    {
      title: "Objectif",
      step: 23,
      rows: [
        ["Motivation", getChoiceLabel(GOAL_CHOICES, values.goalReason)],
        ["Montant", formatCurrency(values.goalTargetAmount)],
        ["Échéance", formatMonth(values.goalTargetDate)],
        ["Priorité", `${values.goalPriority ?? "—"}/10`],
      ],
    },
  ];

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-brand">Résumé</p>
      <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
        Vérifiez vos réponses.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-secondary-text sm:text-base">
        Vous pourrez encore modifier ces informations avant la création de votre analyse.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-medium">{section.title}</h2>
              <button
                type="button"
                onClick={() => onEdit(section.step)}
                className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-secondary-text outline-none hover:bg-elevated hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Pencil aria-hidden="true" size={16} />
                Modifier
              </button>
            </div>
            <dl className="grid gap-3">
              {section.rows.map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 text-sm">
                  <dt className="text-muted">{label}</dt>
                  <dd className="max-w-[60%] text-right text-secondary-text">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}

function formatCurrency(value: number | null) {
  if (value === null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00.000Z`),
  );
}

function formatMonth(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}-01T00:00:00.000Z`));
}
