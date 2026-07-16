import type { NextRequest } from "next/server";

import { runWeeklySummaryCron } from "@/features/operations/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return runWeeklySummaryCron(request);
}
