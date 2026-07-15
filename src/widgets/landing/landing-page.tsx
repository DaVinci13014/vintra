import Link from "next/link";

import { Button, Logo } from "@/shared/ui";
import { LandingVisual } from "./landing-visual";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="grid min-h-[calc(100svh-72px)] lg:grid-cols-2">
        <div className="flex min-h-[680px] flex-col px-4 pb-12 pt-4 sm:px-6 lg:min-h-0 lg:px-10 lg:py-8 xl:px-16">
          <header className="flex items-center justify-between gap-4">
            <Logo priority />
            <nav aria-label="Authentification" className="flex items-center gap-2">
              <Button asChild variant="primary">
                <Link href="/connexion">Connexion</Link>
              </Button>
            </nav>
          </header>

          <div className="flex flex-1 items-center py-16 lg:py-20">
            <div className="max-w-2xl">
              <p className="mb-6 text-sm font-medium text-brand">Coach financier personnel</p>
              <h1 className="text-[clamp(3.5rem,7.5vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
                Prenez le contrôle.
                <span className="mt-4 block text-secondary-text">Simplement.</span>
              </h1>
              <p className="mt-10 max-w-xl text-lg leading-7 text-secondary-text sm:text-xl sm:leading-8">
                Vintra vous aide à comprendre vos finances et à construire votre épargne à
                votre rythme.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/inscription">Commencer</Link>
                </Button>
                <p className="text-sm text-muted">Gratuit. Sans connexion bancaire.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-divider pt-5 text-xs text-muted">
            <span>Analyse personnalisée</span>
            <span>Données privées</span>
          </div>
        </div>

        <LandingVisual />
      </section>

      <footer className="flex min-h-[72px] flex-wrap items-center justify-between gap-4 border-t border-border px-4 py-4 text-xs text-muted sm:px-6 lg:px-10 xl:px-16">
        <p>© 2026 Vintra</p>
        <p>Comprendre. Planifier. Progresser.</p>
      </footer>
    </main>
  );
}
