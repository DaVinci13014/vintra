import { z } from "zod";

export const themePreferenceSchema = z.enum(["LIGHT", "DARK", "SYSTEM"]);
export const localePreferenceSchema = z.literal("FR");
export const currencyPreferenceSchema = z.enum(["EUR", "USD", "GBP", "CHF", "CAD"]);

export const THEME_COOKIE_NAME = "vintra-theme";
export const LOCALE_COOKIE_NAME = "vintra-locale";

export type ThemePreference = z.infer<typeof themePreferenceSchema>;
export type LocalePreference = z.infer<typeof localePreferenceSchema>;
