import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Vintra - Conseiller financier", template: "%s · Vintra" },
  description: "Comprenez vos finances et construisez une épargne à votre rythme.",
  icons: {
    icon: "/logo/vintra-logo.svg",
    shortcut: "/logo/vintra-logo.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
