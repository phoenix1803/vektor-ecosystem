import { jsonOk } from "@/lib/mock";
import { getSecuritySnapshot, recordAuditEvent } from "@/lib/settings-data";

export async function GET() {
  const snapshot = await getSecuritySnapshot();
  return jsonOk({ data: snapshot });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  await recordAuditEvent("UPDATE", "settings-security", "Security Admin", payload);

  const snapshot = await getSecuritySnapshot();
  return jsonOk({ ok: true, data: snapshot });
}