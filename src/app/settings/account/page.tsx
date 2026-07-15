import { LogOut, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/features/auth";
import { requireSession } from "@/features/auth/server";
import { DeleteAccount } from "@/features/settings/ui";
import { SettingsLayout } from "@/widgets/settings";

export default async function SettingsAccountPage() {
  const session = await requireSession();
  if (!session.user.emailVerified) redirect("/verification-email");

  return (
    <SettingsLayout active="account">
      <p className="text-sm font-medium text-brand">Compte</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Gérer mon compte
      </h1>

      <section className="mt-8 rounded-3xl border border-border bg-surface p-5 sm:p-8">
        <LogOut className="text-brand" aria-hidden="true" />
        <h2 className="mt-5 text-lg font-semibold">Déconnexion</h2>
        <p className="mt-2 text-sm leading-6 text-secondary-text">
          Fermez uniquement la session utilisée sur cet appareil.
        </p>
        <div className="mt-5">
          <SignOutButton />
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-danger/40 bg-danger/5 p-5 sm:p-8">
        <Trash2 className="text-danger" aria-hidden="true" />
        <h2 className="mt-5 text-lg font-semibold">Zone dangereuse</h2>
        <p className="mt-2 text-sm leading-6 text-secondary-text">
          La suppression efface définitivement vos données et invalide toutes les sessions.
        </p>
        <DeleteAccount email={session.user.email} />
      </section>
    </SettingsLayout>
  );
}
