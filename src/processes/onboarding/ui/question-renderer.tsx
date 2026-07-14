import {
  BUDGET_COMPLIANCE_CHOICES,
  ONBOARDING_QUESTIONS,
  YES_NO_CHOICES,
  type OnboardingFieldSetter,
  type OnboardingValues,
} from "@/processes/onboarding/model";
import { ChoiceGroup } from "./choice-group";
import { CountryCombobox } from "./country-combobox";
import { CurrencyField } from "./currency-field";
import { DateOfBirthField } from "./date-of-birth-field";
import { MonthPicker } from "./month-picker";
import { PrioritySlider } from "./priority-slider";

type QuestionRendererProps = {
  step: number;
  values: OnboardingValues;
  setField: OnboardingFieldSetter;
};

export function QuestionRenderer({ step, values, setField }: QuestionRendererProps) {
  const question = ONBOARDING_QUESTIONS[step];

  if (question?.kind === "choice") {
    const value = values[question.field];
    return (
      <QuestionLayout
        eyebrow={question.eyebrow}
        question={question.question}
        description={question.description}
      >
        <ChoiceGroup
          choices={question.choices}
          value={typeof value === "string" ? value : ""}
          onChange={(nextValue) => setField(question.field, nextValue)}
        />
      </QuestionLayout>
    );
  }

  if (question?.kind === "currency") {
    const value = values[question.field];
    return (
      <QuestionLayout
        eyebrow={question.eyebrow}
        question={question.question}
        description={question.description}
      >
        <CurrencyField
          value={typeof value === "number" ? value : null}
          placeholder={question.placeholder}
          onChange={(nextValue) => setField(question.field, nextValue)}
        />
      </QuestionLayout>
    );
  }

  switch (step) {
    case 1:
      return (
        <QuestionLayout
          eyebrow="Avant de commencer"
          question="Quelle est votre date de naissance ?"
          description="Nous utilisons votre âge pour personnaliser certaines recommandations. Vintra est réservé aux adultes."
        >
          <DateOfBirthField
            value={values.birthDate}
            onChange={(value) => setField("birthDate", value)}
          />
        </QuestionLayout>
      );
    case 2:
      return (
        <QuestionLayout
          eyebrow="Votre profil"
          question="Dans quel pays résidez-vous actuellement ?"
          description="Cette information permet d’adapter la devise et les conseils proposés."
        >
          <CountryCombobox
            value={values.country}
            onChange={(value) => setField("country", value)}
          />
        </QuestionLayout>
      );
    case 7:
      return (
        <QuestionLayout
          eyebrow="Vos revenus"
          question="Disposez-vous de revenus complémentaires ?"
          description="Activité secondaire, aides ou revenus réguliers supplémentaires."
        >
          <ChoiceGroup
            choices={YES_NO_CHOICES}
            value={toBooleanChoice(values.hasAdditionalIncome)}
            onChange={(value) => setField("hasAdditionalIncome", value === "yes")}
          />
          {values.hasAdditionalIncome && (
            <div className="mt-5 border-t border-divider pt-5">
              <p className="mb-3 text-sm font-medium">Montant mensuel moyen</p>
              <CurrencyField
                id="additional-income"
                value={values.additionalIncome}
                placeholder="250"
                onChange={(value) => setField("additionalIncome", value)}
              />
            </div>
          )}
        </QuestionLayout>
      );
    case 17:
      return (
        <QuestionLayout eyebrow="Vos habitudes" question="Avez-vous un budget mensuel ?">
          <ChoiceGroup
            choices={YES_NO_CHOICES}
            value={toBooleanChoice(values.hasBudget)}
            onChange={(value) => setField("hasBudget", value === "yes")}
          />
          {values.hasBudget && (
            <div className="mt-5 border-t border-divider pt-5">
              <p className="mb-3 text-sm font-medium">À quelle fréquence le respectez-vous ?</p>
              <ChoiceGroup
                choices={BUDGET_COMPLIANCE_CHOICES}
                value={values.budgetCompliance}
                onChange={(value) => setField("budgetCompliance", value)}
              />
            </div>
          )}
        </QuestionLayout>
      );
    case 20:
      return (
        <QuestionLayout
          eyebrow="Votre épargne"
          question="Disposez-vous actuellement d’une épargne ?"
          description="Compte épargne, livret ou somme déjà mise de côté."
        >
          <ChoiceGroup
            choices={YES_NO_CHOICES}
            value={toBooleanChoice(values.hasSavings)}
            onChange={(value) => setField("hasSavings", value === "yes")}
          />
        </QuestionLayout>
      );
    case 25:
      return (
        <QuestionLayout
          eyebrow="Votre objectif"
          question="Quand souhaitez-vous atteindre cet objectif ?"
          description="Choisissez un mois et une année à venir. Cette date pourra être ajustée plus tard."
        >
          <MonthPicker
            value={values.goalTargetDate}
            onChange={(value) => setField("goalTargetDate", value)}
          />
        </QuestionLayout>
      );
    case 26:
      return (
        <QuestionLayout
          eyebrow="Votre objectif"
          question="À quel point cet objectif est-il important pour vous ?"
          description="Cette priorité nous aidera à adapter le rythme du futur plan."
        >
          <PrioritySlider
            value={values.goalPriority}
            onChange={(value) => setField("goalPriority", value)}
          />
        </QuestionLayout>
      );
    default:
      return null;
  }
}

type QuestionLayoutProps = {
  eyebrow: string;
  question: string;
  description?: string;
  children: React.ReactNode;
};

function QuestionLayout({ eyebrow, question, description, children }: QuestionLayoutProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-brand">{eyebrow}</p>
      <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
        {question}
      </h1>
      {description && (
        <p className="mt-3 max-w-xl text-sm leading-6 text-secondary-text sm:text-base">
          {description}
        </p>
      )}
      <div className="mt-8">{children}</div>
    </div>
  );
}

function toBooleanChoice(value: boolean | null) {
  if (value === null) return "";
  return value ? "yes" : "no";
}
