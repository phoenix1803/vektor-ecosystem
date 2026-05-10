import { jsonOk } from "@/lib/mock";
import { listAuditLogs } from "@/lib/hms-data";
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
  const query = (searchParams.get("q") || "").toLowerCase();

  const rows = await listAuditLogs();
  const filtered = query
    ? rows.filter(
        (row) =>
          row.actorName.toLowerCase().includes(query) ||
          row.action.toLowerCase().includes(query) ||
          row.resource.toLowerCase().includes(query),
      )
    : rows;

  return jsonOk({ data: filtered, total: filtered.length, source: "repository" });
}