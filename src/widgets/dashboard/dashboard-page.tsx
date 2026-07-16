import {
  CalendarClock,
  CircleDollarSign,
  Gauge,
  PiggyBank,
  Plus,
  ReceiptText,
  Settings,
  Sparkles,
  Target,
  TrendingDown,
  WalletCards,
} from "lucide-react";
import Link from "next/link";

import type { DashboardData } from "@/features/dashboard";
import { NotificationBell } from "@/features/notifications/ui";
import { Avatar, Logo } from "@/shared/ui";
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
  user,
}: {
  data: CompletedDashboardData;
  user: { firstName: string; lastName: string; image?: string | null };
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
          <Logo href="/dashboard" priority />
          <nav className="flex items-center gap-2" aria-label="Actions du compte">
            <NotificationBell initialCount={data.unreadNotificationCount} />
            <Link
              href="/settings"
              className="grid size-11 place-items-center rounded-full outline-none transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Ouvrir mon profil"
            >
              <Avatar
                firstName={user.firstName}
                lastName={user.lastName}
                image={user.image}
                size="md"
              />
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-8 sm:py-12">
        <section>
          <p className="text-sm font-medium text-brand">Vue d’ensemble</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            {greeting}, {user.firstName}
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
              <Link
                href={`/goals/${data.goal.id}/epargne`}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background transition hover:bg-brand hover:text-brand-foreground"
              >
                <PiggyBank size={18} aria-hidden="true" />
                {data.goal.status === "COMPLETED" ? "Voir mes versements" : "Ajouter de l’épargne"}
              </Link>
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
            <h2 className="mt-4 text-xl font-semibold">
              {data.plannedGoals.length > 0
                ? "Choisissez votre objectif principal"
                : "Créez votre premier objectif"}
            </h2>
            <p className="mt-2 text-secondary-text">
              {data.plannedGoals.length > 0
                ? "Activez l’un de vos projets planifiés pour générer votre plan d’épargne."
                : "Transformez votre capacité d’épargne en projet concret."}
            </p>
            <Link
              href={data.plannedGoals.length > 0 ? "/goals" : "/goals/nouveau"}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-medium text-background"
            >
              {data.plannedGoals.length > 0 ? "Voir mes objectifs" : "Créer un objectif"}
            </Link>
          </section>
        )}

        {data.plannedGoals.length > 0 && (
          <section aria-labelledby="planned-goals-title">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-brand">À venir</p>
                <h2 id="planned-goals-title" className="mt-1 text-lg font-semibold">
                  Autres objectifs
                </h2>
              </div>
              <Link href="/goals" className="text-sm text-brand hover:underline">
                Tout gérer
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {data.plannedGoals.map((plannedGoal) => (
                <Link
                  key={plannedGoal.id}
                  href={`/goals/${plannedGoal.id}`}
                  className="rounded-2xl border border-border bg-surface p-5 transition hover:border-brand/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-brand">Planifié</p>
                      <h3 className="mt-2 font-semibold">{plannedGoal.title}</h3>
                    </div>
                    <Target className="shrink-0 text-secondary-text" size={19} aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-lg font-semibold">
                    {money.format(plannedGoal.currentAmount)}
                  </p>
                  <p className="mt-1 text-sm text-secondary-text">
                    sur {money.format(plannedGoal.targetAmount)}
                  </p>
                  <div
                    className="mt-4 h-2 overflow-hidden rounded-full bg-card"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(plannedGoal.progress)}
                    aria-label={`Progression de ${plannedGoal.title}`}
                  >
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${Math.min(100, plannedGoal.progress)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-secondary-text">
                    {Math.round(plannedGoal.progress)} % · Échéance{" "}
                    {formatDate(plannedGoal.targetDate)}
                  </p>
                </Link>
              ))}
            </div>
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
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ActionLink
              icon={CircleDollarSign}
              label="Modifier mes revenus"
              href="/settings/profile/finances"
            />
            <ActionLink
              icon={ReceiptText}
              label="Modifier mes dépenses"
              href="/settings/profile/finances"
            />
            <ActionLink
              icon={Plus}
              label={data.goal ? "Ajouter un objectif" : "Créer un objectif"}
              href="/goals/nouveau"
            />
            <ProfileActionLink
              firstName={user.firstName}
              lastName={user.lastName}
              image={user.image}
            />
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
          <ProfileNavItem firstName={user.firstName} lastName={user.lastName} image={user.image} />
          <NavItem href="/settings" label="Réglages" icon={Settings} />
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

function ProfileActionLink({
  firstName,
  lastName,
  image,
}: {
  firstName: string;
  lastName: string;
  image?: string | null;
}) {
  return (
    <Link
      href="/settings/profile"
      className="flex min-h-20 items-center gap-3 rounded-2xl border border-border bg-surface px-4 text-left text-sm text-secondary-text transition hover:border-brand/40 hover:text-foreground"
    >
      <Avatar firstName={firstName} lastName={lastName} image={image} size="sm" />
      <span>Mettre à jour mon profil</span>
    </Link>
  );
}

function ProfileNavItem({
  firstName,
  lastName,
  image,
}: {
  firstName: string;
  lastName: string;
  image?: string | null;
}) {
  return (
    <Link
      href="/settings/profile"
      className="flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-1 text-xs text-muted hover:text-foreground"
    >
      <Avatar firstName={firstName} lastName={lastName} image={image} size="xs" />
      <span>Profil</span>
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
