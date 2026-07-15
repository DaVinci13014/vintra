import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import {
  LOCALE_COOKIE_NAME,
  localePreferenceSchema,
  THEME_COOKIE_NAME,
  themePreferenceSchema,
} from "@/shared/config";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Vintra - Conseiller financier", template: "%s · Vintra" },
  description: "Comprenez vos finances et construisez une épargne à votre rythme.",
  icons: {
    icon: "/logo/vintra-logo.svg",
    shortcut: "/logo/vintra-logo.svg",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const parsedTheme = themePreferenceSchema.safeParse(cookieStore.get(THEME_COOKIE_NAME)?.value);
  const parsedLocale = localePreferenceSchema.safeParse(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  const theme = parsedTheme.success ? parsedTheme.data : "SYSTEM";
  const locale = parsedLocale.success ? parsedLocale.data : "FR";

  return (
    <html
      lang={locale.toLowerCase()}
      data-theme={theme.toLowerCase()}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
