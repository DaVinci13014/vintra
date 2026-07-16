import type { Metadata } from "next";

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

export default function HomePage() {
  return <LandingPage />;
}
