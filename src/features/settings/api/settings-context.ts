import { getSession } from "@/features/auth/server";
import type { ApiResponse } from "@/shared/api";

export async function getSettingsContext(): Promise<
  ApiResponse<{ userId: string; email: string }>
> {
  const session = await getSession();
  if (!session) return failure("AUTH_UNAUTHORIZED", "Votre session a expiré.");
  if (!session.user.emailVerified) {
    return failure("AUTH_EMAIL_NOT_VERIFIED", "Vérifiez votre adresse email.");
  }

  return { success: true, data: { userId: session.user.id, email: session.user.email } };
}

export function failure(code: string, message: string): ApiResponse<never> {
  return { success: false, error: { code, message } };
}
