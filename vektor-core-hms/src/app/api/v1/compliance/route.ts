import { jsonOk } from "@/lib/mock";
import { getComplianceSnapshot, listAuditLogs } from "@/lib/hms-data";

export async function GET() {
  const [snapshot, auditLogs] = await Promise.all([getComplianceSnapshot(), listAuditLogs()]);

  return jsonOk({
    data: {
      ...snapshot,
      recentAuditLogs: auditLogs.slice(0, 10),
    },
    generatedAt: new Date().toISOString(),
  });
}