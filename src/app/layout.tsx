import type { Metadata } from "next";
import Script from "next/script";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { AnalyticsConsentBanner } from "@/features/analytics-consent";
import { getApplicationUrl } from "@/shared/config/server";
import { RefreshOnHistoryNavigation } from "@/shared/lib";
import "./globals.css";

const applicationUrl = getApplicationUrl();

export const metadata: Metadata = {
  metadataBase: new URL(applicationUrl),
  applicationName: "Vintra",
  title: { default: "Vintra - Conseiller financier", template: "%s · Vintra" },
  description: "Comprenez vos finances et construisez une épargne à votre rythme.",
  icons: {
    icon: "/logo/vintra-logo.svg",
    shortcut: "/logo/vintra-logo.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      data-theme="system"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body>
        <RefreshOnHistoryNavigation />
        {children}
        <AnalyticsConsentBanner />
      </body>
    </html>
  );
}
