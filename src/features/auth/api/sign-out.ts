"use server";

import { headers } from "next/headers";

import type { ApiResponse } from "@/shared/api";
import { prisma } from "@/shared/api/database";
import { auth } from "./auth";
import { getSession } from "./session";

export async function signOut(): Promise<ApiResponse<{ destination: string }>> {
  const session = await getSession();

  try {
    await auth.api.signOut({ headers: await headers() });
  } catch {
    return {
      success: false,
      error: { code: "SIGN_OUT_FAILED", message: "La déconnexion n’a pas pu être effectuée." },
    };
  }

  if (session) {
    try {
      await prisma.auditLog.create({
        data: { userId: session.user.id, action: "SIGNED_OUT" },
      });
    } catch {
      return { success: true, data: { destination: "/connexion" } };
    }
  }

  return { success: true, data: { destination: "/connexion" } };
}
