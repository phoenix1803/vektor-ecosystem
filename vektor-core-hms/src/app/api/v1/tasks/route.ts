import { jsonOk } from "@/lib/mock";
import { listOrchestratedTasks } from "@/lib/hms-data";
import type { NextRequest } from "next/server";
import { requireApiPermission } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await requireApiPermission(request, "dashboard", "view", {
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });
  if (!auth.ok) {
    return auth.response;
  }

  const { searchParams } = new URL(request.url);
  const moduleFilter = searchParams.get("module") || undefined;

  const rows = await listOrchestratedTasks(moduleFilter);
  return jsonOk({ data: rows, total: rows.length, source: "repository" });
}
