import { jsonOk } from "@/lib/mock";
import { listJourneyScores } from "@/lib/hms-data";
import type { NextRequest } from "next/server";
import { requireApiPermission } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await requireApiPermission(request, "analytics", "view", {
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });
  if (!auth.ok) {
    return auth.response;
  }

  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") || undefined;

  const rows = await listJourneyScores(scope);
  return jsonOk({ data: rows, total: rows.length, source: "repository" });
}
