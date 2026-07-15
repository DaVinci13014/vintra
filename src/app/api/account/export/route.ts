import { type NextRequest, NextResponse } from "next/server";

import { getSession } from "@/features/auth/server";
import { createAccountExport } from "@/features/settings";
import { exportScopeSchema } from "@/features/settings/model";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "AUTH_UNAUTHORIZED" }, { status: 401 });
  }

  const scope = exportScopeSchema.safeParse(request.nextUrl.searchParams.get("scope") ?? "full");
  if (!scope.success) {
    return NextResponse.json({ error: "INVALID_EXPORT_SCOPE" }, { status: 400 });
  }

  const data = await createAccountExport(session.user.id, scope.data);
  if (!data) {
    return NextResponse.json({ error: "PROFILE_NOT_FOUND" }, { status: 404 });
  }

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="vintra-${scope.data}-${date}.json"`,
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
