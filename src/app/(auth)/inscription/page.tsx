import type { Metadata } from "next";
import Link from "next/link";

import { SignUpForm } from "@/features/auth";
import { Button } from "@/shared/ui";
import { AuthLayout } from "@/widgets/auth";

export const metadata: Metadata = { title: "Inscription" };

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Créez votre espace."
      description="Quelques informations suffisent pour commencer. L’analyse financière vient ensuite."
      alternateAction={
        <Button asChild variant="secondary">
          <Link href="/connexion">Se connecter</Link>
        </Button>
      }
    >
      <SignUpForm />
    </AuthLayout>
  );
}
