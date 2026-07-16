import { Database, Download, FileJson, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { SettingsLayout } from "@/widgets/settings";

export default async function SettingsPrivacyPage() {
  const session = await requireSession();
  if (!session.user.emailVerified) redirect("/verification-email");

  return (
    <SettingsLayout active="privacy" user={session.user}>
      <p className="text-sm font-medium text-brand">Confidentialité</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Contrôler mes données
      </h1>
      <p className="mt-3 max-w-2xl text-secondary-text">
        Téléchargez une copie lisible de vos informations, sans mot de passe ni jeton de session.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <ExportCard
          icon={FileJson}
          title="Exporter mon profil"
          description="Identité, préférences et situation financière actuelle."
          href="/api/account/export?scope=profile"
          label="Télécharger mon profil"
        />
        <ExportCard
          icon={Database}
          title="Télécharger toutes mes données"
          description="Profil, analyses, objectifs, conseils, historique, support et audit."
          href="/api/account/export?scope=full"
          label="Télécharger mes données"
        />
      </section>

      <section className="mt-5 rounded-3xl border border-border bg-surface p-5 sm:p-8">
        <ShieldCheck className="text-brand" aria-hidden="true" />
        <h2 className="mt-5 text-lg font-semibold">Politique de confidentialité</h2>
        <p className="mt-2 text-sm leading-6 text-secondary-text">
          Consultez les données utilisées par Vintra, leur finalité et les moyens disponibles pour
          exercer votre contrôle.
        </p>
        <Link
          href="/settings/privacy/policy"
          className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-5 text-sm font-medium transition hover:bg-elevated"
        >
          Consulter la politique
        </Link>
      </section>
    </SettingsLayout>
  );
}

function ExportCard({
  icon: Icon,
  title,
  description,
  href,
  label,
}: {
  icon: typeof Database;
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <article className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
      <Icon className="text-brand" aria-hidden="true" />
      <h2 className="mt-5 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-secondary-text">{description}</p>
      <a
        href={href}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background"
      >
        <Download size={18} aria-hidden="true" />
        {label}
      </a>
    </article>
  );
}
