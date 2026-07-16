import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/shared/ui";

export function NotificationsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-svh bg-background px-4 py-4 sm:px-8 sm:py-6">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <Logo href="/dashboard" priority />
        <nav className="flex items-center gap-2" aria-label="Actions des notifications">
          <Link
            href="/settings/notifications"
            className="grid size-11 place-items-center rounded-xl border border-border bg-card text-secondary-text transition hover:text-foreground"
            aria-label="Préférences de notifications"
          >
            <SlidersHorizontal size={18} aria-hidden="true" />
          </Link>
          <Link
            href="/dashboard"
            className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-secondary-text transition hover:bg-card hover:text-foreground"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Tableau de bord
          </Link>
        </nav>
      </header>
      <div className="mx-auto max-w-5xl py-10">{children}</div>
    </main>
  );
}
