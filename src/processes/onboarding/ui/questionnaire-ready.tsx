import { Check, ShieldCheck } from "lucide-react";

type QuestionnaireReadyProps = {
  firstName: string;
  onReview: () => void;
};

export function QuestionnaireReady({ firstName, onReview }: QuestionnaireReadyProps) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
        <Check aria-hidden="true" size={26} strokeWidth={2.5} />
      </div>
      <p className="mt-6 text-sm font-medium text-brand">Questionnaire terminé</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
        Merci, {firstName}.
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-secondary-text">
        Vos réponses sont enregistrées. Elles serviront à construire votre analyse financière lors
        de l’étape suivante.
      </p>
      <div className="mx-auto mt-8 flex max-w-md items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left text-sm text-secondary-text">
        <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-brand" size={20} />
        <p>
          Vos données restent privées et modifiables. Aucun calcul ni conseil n’a encore été généré.
        </p>
      </div>
      <button
        type="button"
        onClick={onReview}
        className="mt-6 min-h-11 rounded-xl px-4 text-sm font-medium text-secondary-text outline-none hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
      >
        Relire mes réponses
      </button>
    </div>
  );
}
