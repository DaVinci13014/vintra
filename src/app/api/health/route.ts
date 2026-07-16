import { getHealthStatus } from "@/features/operations/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const result = await getHealthStatus();
  return Response.json(result.body, {
    headers: { "Cache-Control": "no-store, max-age=0" },
    status: result.status,
  });
}
