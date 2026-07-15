import { headers } from "next/headers";

import { auth } from "@/features/auth/server";
import { prisma } from "@/shared/api/database";

export async function getSettingsOverview(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      profile: {
        select: {
          birthDate: true,
          country: true,
          profession: true,
          currency: true,
          locale: true,
          theme: true,
          onboardingCompleted: true,
        },
      },
      _count: { select: { supportRequests: true } },
    },
  });

  if (!user?.profile) return null;

  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    profile: {
      ...user.profile,
      birthDate: user.profile.birthDate?.toISOString().slice(0, 10) ?? "",
    },
    supportRequestCount: user._count.supportRequests,
  };
}

export async function getSecuritySettings(currentSessionToken: string) {
  const sessions = await auth.api.listSessions({ headers: await headers() });

  return sessions.map((session) => ({
    id: session.id,
    current: session.token === currentSessionToken,
    device: getDeviceLabel(session.userAgent),
    location: maskIpAddress(session.ipAddress),
    createdAt: session.createdAt.toISOString(),
    expiresAt: session.expiresAt.toISOString(),
  }));
}

function getDeviceLabel(userAgent?: string | null) {
  if (!userAgent) return "Appareil non identifié";

  const browser = userAgent.includes("Firefox")
    ? "Firefox"
    : userAgent.includes("Edg/")
      ? "Edge"
      : userAgent.includes("Chrome")
        ? "Chrome"
        : userAgent.includes("Safari")
          ? "Safari"
          : "Navigateur";
  const system =
    userAgent.includes("iPhone") || userAgent.includes("iPad")
      ? "iOS"
      : userAgent.includes("Android")
        ? "Android"
        : userAgent.includes("Mac OS")
          ? "macOS"
          : userAgent.includes("Windows")
            ? "Windows"
            : userAgent.includes("Linux")
              ? "Linux"
              : "appareil inconnu";

  return `${browser} · ${system}`;
}

function maskIpAddress(ipAddress?: string | null) {
  if (!ipAddress) return "Localisation non disponible";
  if (ipAddress.includes(":")) return `${ipAddress.split(":").slice(0, 3).join(":")}:…`;

  const parts = ipAddress.split(".");
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.…` : "Adresse réseau masquée";
}
