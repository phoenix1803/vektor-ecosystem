import { jsonOk } from "@/lib/mock";
import { getBackupSnapshot, recordAuditEvent } from "@/lib/settings-data";

export async function GET() {
  const snapshot = await getBackupSnapshot();
  return jsonOk({ data: snapshot });
}

export async function POST() {
  await recordAuditEvent("BACKUP_RUN", "settings-backup", "System", { trigger: "manual" });
  const snapshot = await getBackupSnapshot();

  return jsonOk({ ok: true, message: "Backup job accepted", data: snapshot }, 202);
}