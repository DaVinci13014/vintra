import { ArrowLeft, BellRing, CircleHelp, LockKeyhole, Palette, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Avatar, Logo } from "@/shared/ui";

const NAVIGATION = [
  { id: "profile", href: "/settings/profile", label: "Mon profil", icon: null },
  { id: "preferences", href: "/settings/preferences", label: "Préférences", icon: Palette },
  {
    id: "notifications",
    href: "/settings/notifications",
    label: "Notifications",
    icon: BellRing,
  },
  { id: "security", href: "/settings/security", label: "Sécurité", icon: LockKeyhole },
  { id: "privacy", href: "/settings/privacy", label: "Confidentialité", icon: ShieldCheck },
  { id: "support", href: "/settings/support", label: "Support", icon: CircleHelp },
] as const;

type SectionId = (typeof NAVIGATION)[number]["id"];

export function SettingsLayout({
  children,
  active,
  user,
}: {
  children: ReactNode;
  active?: SectionId;
  user: { firstName: string; lastName: string; image?: string | null };
}) {
  return (
    <main className="min-h-svh bg-background px-4 py-4 sm:px-8 sm:py-6">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Logo href="/dashboard" priority />
        <Link
          href="/dashboard"
          className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-secondary-text transition hover:bg-card hover:text-foreground"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Tableau de bord
        </Link>
      </header>

      <div className="mx-auto grid w-full min-w-0 max-w-6xl gap-8 py-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-12">
        <aside className="min-w-0">
          <Link href="/settings" className="block rounded-xl px-3 py-2">
            <p className="text-2xl font-semibold">Paramètres</p>
          </Link>
          <nav
            className="mt-4 flex w-full max-w-full gap-2 overflow-x-auto pb-2 lg:grid lg:overflow-visible"
            aria-label="Sections des paramètres"
          >
            {NAVIGATION.map(({ id, href, label, icon: Icon }) => (
              <Link
                key={id}
                href={href}
                aria-current={active === id ? "page" : undefined}
                className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm transition ${
                  active === id
                    ? "bg-brand/10 text-brand"
                    : "text-secondary-text hover:bg-card hover:text-foreground"
                }`}
              >
                {Icon ? (
                  <Icon size={18} aria-hidden="true" />
                ) : (
                  <Avatar
                    firstName={user.firstName}
                    lastName={user.lastName}
                    image={user.image}
                    size="sm"
                  />
                )}
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}
