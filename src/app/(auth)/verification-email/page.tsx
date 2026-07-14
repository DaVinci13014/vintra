import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { VerificationEmailPanel } from "@/features/auth";
import { getSession } from "@/features/auth/server";
import { Button } from "@/shared/ui";
import { AuthLayout } from "@/widgets/auth";

export const metadata: Metadata = { title: "Vérification email" };

type VerificationEmailPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerificationEmailPage({ searchParams }: VerificationEmailPageProps) {
  const session = await getSession();
  if (session) redirect("/onboarding");

  const { email } = await searchParams;

  return (
    <AuthLayout
      title="Vérifiez votre adresse email."
      description="Nous venons d’envoyer un lien de confirmation."
      alternateAction={
        <Button asChild variant="secondary">
          <Link href="/connexion">Se connecter</Link>
        </Button>
      }
    >
      <VerificationEmailPanel email={email} />
    </AuthLayout>
  );
}
