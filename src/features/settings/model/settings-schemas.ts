import { z } from "zod";

import {
  currencyPreferenceSchema,
  localePreferenceSchema,
  themePreferenceSchema,
} from "@/shared/config";

const NAME_PATTERN = /^[\p{L}\p{M}' -]+$/u;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const personalSettingsSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères.")
    .regex(NAME_PATTERN, "Veuillez saisir un prénom valide."),
  lastName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(50, "Le nom ne peut pas dépasser 50 caractères.")
    .regex(NAME_PATTERN, "Veuillez saisir un nom valide."),
  birthDate: z
    .string()
    .regex(DATE_PATTERN, "Saisissez une date de naissance valide.")
    .refine(isAdultBirthDate, "Vous devez avoir au moins 18 ans pour utiliser Vintra."),
  country: z
    .string()
    .trim()
    .min(2, "Indiquez votre pays de résidence.")
    .max(80, "Le nom du pays est trop long."),
  profession: z.enum([
    "EMPLOYEE",
    "FREELANCER",
    "ENTREPRENEUR",
    "STUDENT",
    "UNEMPLOYED",
    "RETIRED",
  ]),
});

export const preferencesSchema = z.object({
  locale: localePreferenceSchema,
  currency: currencyPreferenceSchema,
  theme: themePreferenceSchema,
});

export const avatarSchema = z.object({
  dataUrl: z.string().max(7_000_000, "L’image dépasse la taille maximale autorisée."),
});

export const supportRequestSchema = z.object({
  type: z.enum(["CONTACT", "BUG", "FEEDBACK"]),
  message: z
    .string()
    .trim()
    .min(20, "Décrivez votre demande en au moins 20 caractères.")
    .max(2_000, "Votre message ne peut pas dépasser 2 000 caractères."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Saisissez votre mot de passe actuel."),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .max(128, "Le mot de passe ne peut pas dépasser 128 caractères.")
      .regex(PASSWORD_PATTERN, "Ajoutez une majuscule, une minuscule et un chiffre."),
    confirmPassword: z.string().min(1, "Confirmez votre nouveau mot de passe."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas.",
  });

export const deleteAccountSchema = z.object({
  confirmation: z.literal("SUPPRIMER", { error: "Saisissez SUPPRIMER pour confirmer." }),
  password: z.string().min(1, "Saisissez votre mot de passe actuel."),
});

export const exportScopeSchema = z.enum(["profile", "full"]);

export type PersonalSettingsInput = z.infer<typeof personalSettingsSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
export type SupportRequestInput = z.infer<typeof supportRequestSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

function isAdultBirthDate(value: string) {
  const birthDate = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(birthDate.getTime())) return false;

  const [year, month, day] = value.split("-").map(Number);
  if (
    birthDate.getUTCFullYear() !== year ||
    birthDate.getUTCMonth() !== (month ?? 0) - 1 ||
    birthDate.getUTCDate() !== day
  ) {
    return false;
  }

  const adultLimit = new Date();
  adultLimit.setUTCFullYear(adultLimit.getUTCFullYear() - 18);
  return birthDate <= adultLimit;
}
