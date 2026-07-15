"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import type { ApiResponse } from "@/shared/api";
import { prisma } from "@/shared/api/database";
import { LOCALE_COOKIE_NAME, THEME_COOKIE_NAME } from "@/shared/config";
import { preferencesSchema, type PreferencesInput } from "../model/settings-schemas";
import { failure, getSettingsContext } from "./settings-context";

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function updatePreferences(input: unknown): Promise<ApiResponse<PreferencesInput>> {
  const context = await getSettingsContext();
  if (!context.success) return context;

  const parsed = preferencesSchema.safeParse(input);
  if (!parsed.success) {
    return failure(
      "VALIDATION_ERROR",
      parsed.error.issues[0]?.message ?? "Vérifiez vos préférences.",
    );
  }

  try {
    await prisma.$transaction([
      prisma.profile.update({
        where: { userId: context.data.userId },
        data: parsed.data,
      }),
      prisma.auditLog.create({
        data: { userId: context.data.userId, action: "PREFERENCES_UPDATED" },
      }),
    ]);
  } catch {
    return failure("PREFERENCES_UPDATE_FAILED", "Vos préférences n’ont pas pu être enregistrées.");
  }

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: false,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_YEAR,
  };
  cookieStore.set(THEME_COOKIE_NAME, parsed.data.theme, cookieOptions);
  cookieStore.set(LOCALE_COOKIE_NAME, parsed.data.locale, cookieOptions);
  revalidatePath("/", "layout");

  return { success: true, data: parsed.data };
}
