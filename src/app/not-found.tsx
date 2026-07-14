import Link from "next/link";

import { Button, Logo } from "@/shared/ui";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-svh flex-col px-4 py-4 sm:px-8 sm:py-8">
      <Logo priority />
      <div className="m-auto max-w-lg text-center">
        <p className="font-mono text-sm text-brand">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Cette page n’existe pas.</h1>
        <p className="mt-4 text-secondary-text">Revenez à l’accueil pour continuer.</p>
        <Button asChild className="mt-8">
          <Link href="/">Retour à l’accueil</Link>
        </Button>
      </div>
    </main>
  );
}
