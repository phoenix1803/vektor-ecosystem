import { jsonOk } from "@/lib/mock";
import { getCommandCenterSnapshot } from "@/lib/hms-data";
import type { NextRequest } from "next/server";
import { requireApiPermission } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await requireApiPermission(request, "dashboard", "view", {
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });
  if (!auth.ok) {
    return auth.response;
  }

  const data = await getCommandCenterSnapshot();
  return jsonOk({ data, source: "repository", generatedAt: new Date().toISOString() });
}
