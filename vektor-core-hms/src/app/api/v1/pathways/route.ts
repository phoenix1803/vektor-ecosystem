import { jsonOk } from "@/lib/mock";
import { listOutcomePathways } from "@/lib/hms-data";
import type { NextRequest } from "next/server";
import { requireApiPermission } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await requireApiPermission(request, "analytics", "view", {
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });
  if (!auth.ok) {
    return auth.response;
  }

  const rows = await listOutcomePathways();
  return jsonOk({ data: rows, total: rows.length, source: "repository" });
}
