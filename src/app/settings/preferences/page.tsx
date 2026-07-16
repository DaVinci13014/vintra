import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getSettingsOverview } from "@/features/settings";
import { PreferencesForm } from "@/features/settings/ui";
import { SettingsLayout } from "@/widgets/settings";

export default async function SettingsPreferencesPage() {
  const session = await requireSession();
  if (!session.user.emailVerified) redirect("/verification-email");
  const data = await getSettingsOverview(session.user.id);
  if (!data?.profile.onboardingCompleted) redirect("/onboarding");

  return (
    <SettingsLayout active="preferences">
      <p className="text-sm font-medium text-brand">Préférences</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Personnaliser Vintra
      </h1>
      <p className="mt-3 max-w-2xl text-secondary-text">
        Les changements sont enregistrés et appliqués sans redémarrage.
      </p>
      <div className="mt-8">
        <PreferencesForm
          initialValues={{
            locale: data.profile.locale,
            currency: data.profile.currency,
            theme: data.profile.theme,
          }}
        />
      </div>
    </SettingsLayout>
  );
}
