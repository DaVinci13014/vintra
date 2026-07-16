import {
  ChevronRight,
  BellRing,
  CircleHelp,
  LockKeyhole,
  Palette,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getSettingsOverview } from "@/features/settings";
import { SettingsLayout } from "@/widgets/settings";

const SECTIONS = [
  {
    href: "/settings/profile",
    title: "Mon profil",
    description: "Identité, finances et gestion du compte",
    icon: UserRound,
  },
  {
    href: "/settings/preferences",
    title: "Préférences",
    description: "Langue, devise et apparence",
    icon: Palette,
  },
  {
    href: "/settings/notifications",
    title: "Notifications",
    description: "Centre, Push et alertes de sécurité",
    icon: BellRing,
  },
  {
    href: "/settings/security",
    title: "Sécurité",
    description: "Mot de passe et sessions actives",
    icon: LockKeyhole,
  },
  {
    href: "/settings/privacy",
    title: "Confidentialité",
    description: "Export et contrôle de vos données",
    icon: ShieldCheck,
  },
  {
    href: "/settings/support",
    title: "Support",
    description: "FAQ, problème ou avis",
    icon: CircleHelp,
  },
] as const;

export default async function SettingsPage() {
  const session = await requireSession();
  if (!session.user.emailVerified) redirect("/verification-email");
  const data = await getSettingsOverview(session.user.id);
  if (!data?.profile.onboardingCompleted) redirect("/onboarding");

  return (
    <SettingsLayout>
      <section className="rounded-3xl border border-border bg-surface p-5 sm:p-8">
        <div className="flex items-center gap-4">
          {data.image ? (
            <Image
              src={data.image}
              alt="Photo de profil"
              width={64}
              height={64}
              unoptimized
              className="size-16 rounded-2xl object-cover"
            />
          ) : (
            <div className="grid size-16 place-items-center rounded-2xl bg-brand/10 text-xl font-semibold text-brand">
              {initials(data.firstName, data.lastName)}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold">
              {data.firstName} {data.lastName}
            </h1>
            <p className="mt-1 truncate text-sm text-secondary-text">{data.email}</p>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2" aria-label="Sections des paramètres">
        {SECTIONS.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex min-h-32 items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-brand/40"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-brand">
              <Icon size={19} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-secondary-text">{description}</p>
            </div>
            <ChevronRight
              size={19}
              className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand"
              aria-hidden="true"
            />
          </Link>
        ))}
      </section>
    </SettingsLayout>
  );
}

function initials(firstName: string, lastName: string) {
  return `${firstName.at(0) ?? ""}${lastName.at(0) ?? ""}`.toUpperCase();
}
