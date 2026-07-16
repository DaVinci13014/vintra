import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "@/features/auth/server";
import { LandingPage } from "@/widgets/landing";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    description: "Comprenez vos finances et construisez une épargne à votre rythme.",
    locale: "fr_FR",
    siteName: "Vintra",
    title: "Vintra - Conseiller financier",
    type: "website",
    url: "/",
  },
  robots: { follow: true, index: true },
};

export default async function HomePage() {
  const session = await getSession();

  if (session) redirect("/onboarding");

  return <LandingPage />;
}
