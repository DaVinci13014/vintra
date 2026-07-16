"use server";

import { Buffer } from "node:buffer";
import { revalidatePath } from "next/cache";

import type { ApiResponse } from "@/shared/api";
import { createNotification } from "@/entities/notification/server";
import { prisma } from "@/shared/api/database";
import { avatarSchema, personalSettingsSchema } from "../model/settings-schemas";
import { failure, getSettingsContext } from "./settings-context";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export async function updatePersonalSettings(
  input: unknown,
): Promise<ApiResponse<{ updated: true }>> {
  const context = await getSettingsContext();
  if (!context.success) return context;

  const parsed = personalSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return failure(
      "VALIDATION_ERROR",
      parsed.error.issues[0]?.message ?? "Vérifiez vos informations.",
    );
  }

  const birthDate = new Date(`${parsed.data.birthDate}T00:00:00.000Z`);

  try {
    await prisma.$transaction(async (transaction) => {
      const previous = await transaction.profile.findUniqueOrThrow({
        where: { userId: context.data.userId },
        select: { id: true, profession: true },
      });
      await transaction.user.update({
        where: { id: context.data.userId },
        data: {
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          name: `${parsed.data.firstName} ${parsed.data.lastName}`,
          profile: {
            update: {
              birthDate,
              country: parsed.data.country,
              profession: parsed.data.profession,
            },
          },
        },
      });
      await transaction.auditLog.create({
        data: { userId: context.data.userId, action: "PROFILE_UPDATED" },
      });
      if (previous.profession !== parsed.data.profession) {
        await createNotification(transaction, {
          profileId: previous.id,
          title: "Situation professionnelle mise à jour",
          description: "Votre profil personnel tient compte de votre nouvelle situation.",
          type: "SYSTEM",
          priority: "LOW",
          actionUrl: "/settings/profile",
        });
      }
    });
  } catch {
    return failure("PROFILE_UPDATE_FAILED", "Votre profil n’a pas pu être mis à jour.");
  }

  revalidateSettings();
  return { success: true, data: { updated: true } };
}

export async function updateAvatar(input: unknown): Promise<ApiResponse<{ image: string }>> {
  const context = await getSettingsContext();
  if (!context.success) return context;

  const parsed = avatarSchema.safeParse(input);
  if (!parsed.success) {
    return failure("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "L’image est invalide.");
  }

  const image = parseAvatar(parsed.data.dataUrl);
  if (!image.success) return image;

  try {
    await prisma.$transaction([
      prisma.user.update({ where: { id: context.data.userId }, data: { image: image.data } }),
      prisma.auditLog.create({
        data: { userId: context.data.userId, action: "AVATAR_UPDATED" },
      }),
    ]);
  } catch {
    return failure("AVATAR_UPDATE_FAILED", "La photo n’a pas pu être enregistrée.");
  }

  revalidateSettings();
  return { success: true, data: { image: image.data } };
}

export async function removeAvatar(): Promise<ApiResponse<{ removed: true }>> {
  const context = await getSettingsContext();
  if (!context.success) return context;

  try {
    await prisma.$transaction([
      prisma.user.update({ where: { id: context.data.userId }, data: { image: null } }),
      prisma.auditLog.create({
        data: { userId: context.data.userId, action: "AVATAR_UPDATED" },
      }),
    ]);
  } catch {
    return failure("AVATAR_UPDATE_FAILED", "La photo n’a pas pu être supprimée.");
  }

  revalidateSettings();
  return { success: true, data: { removed: true } };
}

function parseAvatar(dataUrl: string): ApiResponse<string> {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match?.[1] || !match[2]) {
    return failure("INVALID_AVATAR_TYPE", "Utilisez une image JPG, PNG ou WEBP.");
  }

  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length === 0 || bytes.length > MAX_AVATAR_BYTES) {
    return failure("INVALID_AVATAR_SIZE", "L’image doit peser moins de 5 Mo.");
  }

  if (!hasValidSignature(match[1], bytes)) {
    return failure("INVALID_AVATAR_CONTENT", "Le contenu de l’image n’est pas valide.");
  }

  return { success: true, data: `data:${match[1]};base64,${bytes.toString("base64")}` };
}

function hasValidSignature(mimeType: string, bytes: Buffer) {
  if (mimeType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }

  return (
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

function revalidateSettings() {
  revalidatePath("/dashboard");
  revalidatePath("/settings");
  revalidatePath("/settings/profile");
}
