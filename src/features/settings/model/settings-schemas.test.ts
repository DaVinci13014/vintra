import { describe, expect, it } from "vitest";

import {
  changePasswordSchema,
  deleteAccountSchema,
  personalSettingsSchema,
  preferencesSchema,
  supportRequestSchema,
} from "./settings-schemas";

describe("schémas des paramètres", () => {
  it("valide un profil personnel adulte", () => {
    expect(
      personalSettingsSchema.safeParse({
        firstName: "Élodie",
        lastName: "D’Arcy",
        birthDate: "1990-04-12",
        country: "France",
        profession: "EMPLOYEE",
      }).success,
    ).toBe(true);
  });

  it("refuse un utilisateur mineur et une date impossible", () => {
    expect(
      personalSettingsSchema.safeParse({
        firstName: "Jean",
        lastName: "Test",
        birthDate: "2020-02-30",
        country: "France",
        profession: "STUDENT",
      }).success,
    ).toBe(false);
  });

  it("limite les préférences aux valeurs prises en charge", () => {
    expect(
      preferencesSchema.safeParse({ locale: "FR", currency: "EUR", theme: "DARK" }).success,
    ).toBe(true);
    expect(
      preferencesSchema.safeParse({ locale: "EN", currency: "BTC", theme: "NEON" }).success,
    ).toBe(false);
  });

  it("applique les règles du mot de passe et sa confirmation", () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: "Ancien1!",
        newPassword: "Nouveau1!",
        confirmPassword: "Nouveau1!",
      }).success,
    ).toBe(true);
    expect(
      changePasswordSchema.safeParse({
        currentPassword: "Ancien1!",
        newPassword: "tropfaible",
        confirmPassword: "différent",
      }).success,
    ).toBe(false);
  });

  it("exige une demande de support suffisamment détaillée", () => {
    expect(
      supportRequestSchema.safeParse({
        type: "BUG",
        message: "Un problème reproductible apparaît sur mon tableau de bord.",
      }).success,
    ).toBe(true);
    expect(supportRequestSchema.safeParse({ type: "BUG", message: "Trop court" }).success).toBe(
      false,
    );
  });

  it("exige le mot exact pour supprimer le compte", () => {
    expect(
      deleteAccountSchema.safeParse({ confirmation: "SUPPRIMER", password: "Secret1!" }).success,
    ).toBe(true);
    expect(
      deleteAccountSchema.safeParse({ confirmation: "supprimer", password: "Secret1!" }).success,
    ).toBe(false);
  });
});
