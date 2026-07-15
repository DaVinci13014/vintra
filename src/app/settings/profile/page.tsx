import Link from "next/link";
import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getSettingsOverview } from "@/features/settings";
import { PersonalSettingsForm } from "@/features/settings/ui";
import { SettingsLayout } from "@/widgets/settings";

export default async function SettingsProfilePage() {
  const session = await requireSession();
  if (!session.user.emailVerified) redirect("/verification-email");
  const data = await getSettingsOverview(session.user.id);
  if (!data?.profile.onboardingCompleted) redirect("/onboarding");
  if (!data.profile.birthDate || !data.profile.country || !data.profile.profession) {
    redirect("/onboarding");
  }

  return (
    <SettingsLayout active="profile">
      <div>
        <p className="text-sm font-medium text-brand">Mon profil</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Informations personnelles
        </h1>
        <p className="mt-3 max-w-2xl text-secondary-text">
          Ces informations permettent à Vintra d’adapter votre accompagnement.
        </p>
      </div>
      <div className="mt-8">
        <PersonalSettingsForm
          initialImage={data.image}
          initialValues={{
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.profile.birthDate,
            country: data.profile.country,
            profession: data.profile.profession,
          }}
        />
      </div>
      <section className="mt-5 rounded-3xl border border-border bg-surface p-5 sm:p-8">
        <h2 className="text-lg font-semibold">Revenus, charges et épargne</h2>
        <p className="mt-2 text-sm leading-6 text-secondary-text">
          Toute modification financière déclenche une nouvelle analyse et actualise vos conseils.
        </p>
        <Link
          href="/settings/profile/finances"
          className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-5 text-sm font-medium transition hover:bg-elevated"
        >
          Modifier mes informations financières
        </Link>
      </section>
    </SettingsLayout>
  );
}
