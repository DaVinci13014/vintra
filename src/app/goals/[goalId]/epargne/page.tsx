import { History, PiggyBank, Target } from "lucide-react";
import { notFound } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getGoalSavings } from "@/features/goals";
import { SavingsContributionForm } from "@/features/goals/ui";
import { GoalsLayout } from "@/widgets/goals";

export default async function GoalSavingsPage({ params }: { params: Promise<{ goalId: string }> }) {
  const session = await requireSession();
  const { goalId } = await params;
  const goal = await getGoalSavings(session.user.id, goalId);
  if (!goal || (goal.status !== "ACTIVE" && goal.status !== "COMPLETED")) notFound();

  const money = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: goal.currency,
    maximumFractionDigits: 2,
  });
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);

  return (
    <GoalsLayout backHref={"/goals/" + goal.id}>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-brand">Objectif principal</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">Faire progresser mon épargne</h1>
        <p className="mt-4 max-w-2xl leading-7 text-secondary-text">
          Ajoutez chaque somme mise de côté. Votre objectif et la courbe d’épargne se mettent à jour
          automatiquement.
        </p>

        <section className="mt-8 rounded-3xl border border-border bg-surface p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-secondary-text">{goal.title}</p>
              <p className="mt-2 text-3xl font-semibold">{money.format(goal.currentAmount)}</p>
              <p className="mt-1 text-sm text-secondary-text">
                sur {money.format(goal.targetAmount)}
              </p>
            </div>
            <Target className="text-brand" aria-hidden="true" />
          </div>
          <div
            className="mt-6 h-3 overflow-hidden rounded-full bg-card"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(goal.progress)}
            aria-label="Progression de l’objectif"
          >
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: String(Math.min(100, goal.progress)) + "%" }}
            />
          </div>
          <p className="mt-3 text-sm text-secondary-text">{Math.round(goal.progress)} % atteint</p>
        </section>

        <section
          className={`mt-5 rounded-3xl border border-brand/30 p-5 sm:p-8 ${
            goal.status === "ACTIVE" ? "bg-brand/5" : "bg-brand/10"
          }`}
        >
          {goal.status === "ACTIVE" && (
            <div className="mb-6 flex items-center gap-3">
              <PiggyBank className="text-brand" aria-hidden="true" />
              <h2 className="text-xl font-semibold">Ajouter un versement</h2>
            </div>
          )}
          <SavingsContributionForm
            currency={goal.currency}
            goalId={goal.id}
            isCompleted={goal.status === "COMPLETED"}
            remainingAmount={remainingAmount}
          />
        </section>

        <section className="mt-10" aria-labelledby="contribution-history-title">
          <div className="flex items-center gap-3">
            <History className="text-brand" size={21} aria-hidden="true" />
            <h2 id="contribution-history-title" className="text-xl font-semibold">
              Historique des versements
            </h2>
          </div>
          {goal.contributions.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface p-7 text-center text-secondary-text">
              Votre premier versement apparaîtra ici.
            </div>
          ) : (
            <ol className="mt-4 grid gap-3">
              {goal.contributions.map((contribution) => (
                <li
                  key={contribution.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5"
                >
                  <div>
                    <p className="font-medium">Versement ajouté</p>
                    <time
                      dateTime={contribution.createdAt}
                      className="mt-1 block text-sm text-secondary-text"
                    >
                      {formatDate(contribution.createdAt)}
                    </time>
                  </div>
                  <p className="font-semibold text-brand">+ {money.format(contribution.amount)}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </GoalsLayout>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}
