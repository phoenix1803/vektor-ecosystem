import { jsonOk } from "@/lib/mock";
import { listAuditTimeline } from "@/lib/hms-data";
import type { NextRequest } from "next/server";
import { requireApiPermission } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await requireApiPermission(request, "settings", "administer", {
    requireMfa: true,
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });
  if (!auth.ok) {
    return auth.response;
  }

  const { searchParams } = new URL(request.url);
  const resourceId = searchParams.get("resourceId") || undefined;

  const rows = await listAuditTimeline(resourceId);
  return jsonOk({ data: rows, total: rows.length, source: "repository" });
}
