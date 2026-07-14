import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth-session_token",
  "__Secure-better-auth-session_token",
] as const;

export function middleware(request: NextRequest) {
  const hasSessionCookie = SESSION_COOKIE_NAMES.some((cookieName) =>
    request.cookies.has(cookieName),
  );

  if (!hasSessionCookie) {
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("retour", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/onboarding/:path*",
    "/dashboard/:path*",
    "/goals/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/profile/:path*",
  ],
};
