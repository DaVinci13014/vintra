import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getSecuritySettings } from "@/features/settings";
import { SecuritySettings } from "@/features/settings/ui";
import { SettingsLayout } from "@/widgets/settings";

export default async function SettingsSecurityPage() {
  const session = await requireSession();
  if (!session.user.emailVerified) redirect("/verification-email");
  const sessions = await getSecuritySettings(session.session.token);

  return (
    <SettingsLayout active="security">
      <p className="text-sm font-medium text-brand">Sécurité</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Protéger mon compte
      </h1>
      <p className="mt-3 max-w-2xl text-secondary-text">
        Gérez votre mot de passe et les appareils actuellement connectés.
      </p>
      <div className="mt-8">
        <SecuritySettings sessions={sessions} />
      </div>
    </SettingsLayout>
  );
}
