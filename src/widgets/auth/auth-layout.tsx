import { ArrowUpRight, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/shared/ui";

type AuthLayoutProps = {
  title: string;
  description: string;
  alternateAction: ReactNode;
  children: ReactNode;
};

export function AuthLayout({ title, description, alternateAction, children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <section className="flex min-h-svh flex-col px-4 py-4 sm:px-8 sm:py-8 lg:px-12 xl:px-20">
        <header className="flex items-center justify-between gap-4">
          <Logo priority />
          {alternateAction}
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 items-center py-12">
          <div className="w-full">
            <div className="mb-8">
              <p className="mb-4 text-sm font-medium text-brand">Espace personnel</p>
              <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">{title}</h1>
              <p className="mt-4 text-base leading-7 text-secondary-text">{description}</p>
            </div>
            {children}
          </div>
        </div>

        <footer className="flex items-center gap-2 border-t border-divider pt-5 text-xs text-muted">
          <LockKeyhole aria-hidden="true" size={14} />
          <span>Vos données restent privées.</span>
        </footer>
      </section>

      <aside className="relative hidden min-h-svh overflow-hidden border-l border-border bg-surface p-10 lg:flex lg:items-end xl:p-16">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[96px] border border-divider" />
          <div className="absolute left-1/2 top-1/2 size-[360px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[72px] border border-divider" />
          <svg className="absolute left-1/2 top-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 text-foreground" viewBox="0 0 36 36" fill="none">
            <path d="M8.5 24.3L17.7697 9L27.5 27L8.5 24.3ZM17.7697 9L23.2394 19.2937L8.5 24.3M12.1273 20.025L20.463 26" stroke="currentColor" strokeWidth="0.35" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="relative max-w-lg border-t border-divider pt-8">
          <ArrowUpRight aria-hidden="true" className="mb-6 text-brand" size={24} />
          <p className="text-3xl font-medium leading-tight tracking-[-0.035em] xl:text-4xl">
            Un plan clair, construit autour de votre réalité.
          </p>
          <p className="mt-5 max-w-md leading-7 text-secondary-text">
            Vintra transforme quelques informations simples en une trajectoire d’épargne compréhensible.
          </p>
        </div>
      </aside>
    </main>
  );
}
