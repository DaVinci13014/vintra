import {
  Bell,
  CalendarClock,
  CircleDollarSign,
  Gauge,
  PiggyBank,
  ReceiptText,
  Settings,
  Sparkles,
  Target,
  TrendingDown,
  WalletCards,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import type { DashboardData } from "@/features/dashboard";
import { Logo } from "@/shared/ui";
import { SavingsHistoryChart } from "./savings-history-chart";

type CompletedDashboardData = Extract<DashboardData, { completed: true }>;

const PROFILE_LABELS = {
  SAVER: "Épargnant",
  BALANCED: "Équilibré",
  SPENDER: "Dépensier",
  FRAGILE: "Fragile",
} as const;

const DIFFICULTY_LABELS = {
  EASY: "Facile",
  NORMAL: "Réaliste",
  CHALLENGING: "Ambitieux",
  UNREALISTIC: "À ajuster",
} as const;

export function DashboardPage({
  data,
  firstName,
}: {
  data: CompletedDashboardData;
  firstName: string;
}) {
  const money = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: data.currency,
    maximumFractionDigits: 0,
  });
  const greeting = getGreeting(new Date().getHours());

  return (
    <main className="min-h-svh bg-background pb-24">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 px-4 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Logo priority />
          <nav className="flex items-center gap-2" aria-label="Actions du compte">
            <button
              disabled
              className="grid size-11 place-items-center rounded-xl border border-border bg-card text-muted"
              aria-label="Notifications — bientôt disponible"
            >
              <Bell size={19} aria-hidden="true" />
            </button>
            <button
              disabled
              className="grid size-11 place-items-center rounded-xl border border-border bg-card text-muted"
              aria-label="Paramètres — bientôt disponible"
            >
              <Settings size={19} aria-hidden="true" />
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-8 sm:py-12">
        <section>
          <p className="text-sm font-medium text-brand">Votre espace financier</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            {greeting}, {firstName} 👋
          </h1>
          <p className="mt-3 text-secondary-text">
            Profil {PROFILE_LABELS[data.financialProfile.profileType]} · Santé financière{" "}
            {data.financialProfile.financialHealthScore}/100
          </p>
        </section>

        <section aria-labelledby="summary-title">
          <div className="mb-4 flex items-center gap-2">
            <Gauge className="text-brand" size={20} aria-hidden="true" />
            <h2 id="summary-title" className="text-lg font-semibold">
              Votre situation
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={PiggyBank}
              label="Capacité d’épargne"
              value={`${money.format(data.financialProfile.savingCapacity)}/mois`}
              primary
            />
            <SummaryCard
              icon={WalletCards}
              label="Épargne actuelle"
              value={money.format(data.currentSavings)}
            />
            <SummaryCard
              icon={CircleDollarSign}
              label="Revenus"
              value={money.format(data.financialProfile.monthlyIncome)}
            />
            <SummaryCard
              icon={TrendingDown}
              label="Dépenses"
              value={money.format(data.financialProfile.monthlyExpenses)}
            />
          </div>
        </section>

        {data.goal && data.savingPlan ? (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <section
              className="rounded-3xl border border-border bg-surface p-5 sm:p-7"
              aria-labelledby="goal-title"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-brand">Objectif principal</p>
                  <h2 id="goal-title" className="mt-2 text-2xl font-semibold">
                    {data.goal.title}
                  </h2>
                </div>
                <Target className="text-brand" aria-hidden="true" />
              </div>
              <div className="mt-8 flex items-end justify-between gap-4">
                <p className="text-2xl font-semibold">{money.format(data.goal.currentAmount)}</p>
                <p className="text-sm text-secondary-text">
                  sur {money.format(data.goal.targetAmount)}
                </p>
              </div>
              <div
                className="mt-3 h-3 overflow-hidden rounded-full bg-card"
                aria-label={`${Math.round(data.goal.progress)} % atteint`}
              >
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${Math.min(100, data.goal.progress)}%` }}
                />
              </div>
              <div className="mt-4 flex flex-wrap justify-between gap-3 text-sm text-secondary-text">
                <span>{Math.round(data.goal.progress)} % atteint</span>
                <span>Échéance {formatDate(data.goal.targetDate)}</span>
              </div>
            </section>

            <section
              className="rounded-3xl border border-brand/30 bg-brand/10 p-5 sm:p-7"
              aria-labelledby="plan-title"
            >
              <CalendarClock className="text-brand" aria-hidden="true" />
              <h2 id="plan-title" className="mt-5 text-lg font-semibold">
                Plan mensuel recommandé
              </h2>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {money.format(data.savingPlan.recommendedMonthlySaving)}
              </p>
              <p className="mt-1 text-sm text-secondary-text">à mettre de côté chaque mois</p>
              <p className="mt-6 inline-flex rounded-full border border-brand/30 px-3 py-1 text-xs font-medium text-brand">
                {DIFFICULTY_LABELS[data.savingPlan.difficulty]}
              </p>
            </section>
          </div>
        ) : (
          <section className="rounded-3xl border border-dashed border-border bg-surface p-8 text-center">
            <Target className="mx-auto text-brand" />
            <h2 className="mt-4 text-xl font-semibold">Créez votre premier objectif</h2>
            <p className="mt-2 text-secondary-text">
              Transformez votre capacité d’épargne en projet concret.
            </p>
            <Link
              href="/goals/nouveau"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-medium text-background"
            >
              Créer un objectif
            </Link>
          </section>
        )}

        <SavingsHistoryChart data={data.savingsHistory} currency={data.currency} />

        <section aria-labelledby="recommendations-title">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-brand" size={20} aria-hidden="true" />
              <h2 id="recommendations-title" className="text-lg font-semibold">
                Vos priorités
              </h2>
            </div>
            <Link href="/recommendations" className="text-sm text-brand hover:underline">
              Voir toutes
            </Link>
          </div>
          {data.recommendations.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-6 text-secondary-text">
              Tout semble bien se passer pour le moment.
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-3">
              {data.recommendations.map((recommendation) => (
                <Link
                  key={recommendation.id}
                  href={`/recommendations/${recommendation.id}`}
                  className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition hover:border-brand/40"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-brand">
                    {recommendation.priority}
                  </p>
                  <h3 className="mt-3 font-semibold">{recommendation.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-secondary-text">
                    {recommendation.description}
                  </p>
                  {recommendation.potentialSaving > 0 && (
                    <p className="mt-4 text-sm font-medium">
                      Jusqu’à {money.format(recommendation.potentialSaving)}/mois
                    </p>
                  )}
                  <span className="mt-4 text-sm text-brand group-hover:underline">
                    Voir le détail
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="quick-actions-title">
          <h2 id="quick-actions-title" className="text-lg font-semibold">
            Actions rapides
          </h2>
          <p className="mt-1 text-sm text-secondary-text">
            Ces accès seront activés avec les écrans de modification correspondants.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ActionLink icon={CircleDollarSign} label="Modifier mes revenus" href="/profile" />
            <ActionLink icon={ReceiptText} label="Modifier mes dépenses" href="/profile" />
            <ActionLink
              icon={Target}
              label={data.goal ? "Modifier mon objectif" : "Créer un objectif"}
              href={data.goal ? `/goals/${data.goal.id}/modifier` : "/goals/nouveau"}
            />
            <ActionLink icon={UserRound} label="Mettre à jour mon profil" href="/profile" />
          </div>
        </section>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur"
        aria-label="Navigation principale"
      >
        <div className="mx-auto flex max-w-xl items-center justify-around">
          <NavItem href="/dashboard" label="Accueil" icon={Gauge} active />
          <NavItem href="/goals" label="Objectifs" icon={Target} />
          <NavItem href="/recommendations" label="Conseils" icon={Sparkles} />
          <NavItem href="/profile" label="Profil" icon={WalletCards} />
          <PendingNavItem label="Réglages" icon={Settings} />
        </div>
      </nav>
    </main>
  );
}

type Icon = typeof Gauge;

function SummaryCard({
  icon: Icon,
  label,
  value,
  primary = false,
}: {
  icon: Icon;
  label: string;
  value: string;
  primary?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border p-5 ${primary ? "border-brand/30 bg-brand/10" : "border-border bg-surface"}`}
    >
      <Icon
        className={primary ? "text-brand" : "text-secondary-text"}
        size={20}
        aria-hidden="true"
      />
      <p className="mt-5 text-sm text-secondary-text">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </article>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: Icon;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-1 text-xs ${active ? "text-brand" : "text-muted hover:text-foreground"}`}
    >
      <Icon size={19} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

function PendingNavItem({ label, icon: Icon }: { label: string; icon: Icon }) {
  return (
    <span
      aria-disabled="true"
      className="flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-1 text-xs text-muted/60"
    >
      <Icon size={19} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

function ActionLink({ icon: Icon, label, href }: { icon: Icon; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-20 items-center gap-3 rounded-2xl border border-border bg-surface px-4 text-left text-sm text-secondary-text transition hover:border-brand/40 hover:text-foreground"
    >
      <Icon size={19} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

function getGreeting(hour: number) {
  if (hour < 18) return "Bonjour";
  return "Bonsoir";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(date);
}
