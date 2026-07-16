import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { serverEnv } from "@/shared/config/server";
import { auth } from "./auth";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });

  if (!session || serverEnv.REQUIRE_EMAIL_VERIFICATION || session.user.emailVerified) {
    return session;
  }

  return {
    ...session,
    user: {
      ...session.user,
      emailVerified: true,
    },
  };
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/connexion");
  }

  return session;
}
