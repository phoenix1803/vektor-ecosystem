import { jsonOk } from "@/lib/mock";
import { assignNearestHospital } from "@/lib/emergency";
import { emergencyEventCreateSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const parsed = emergencyEventCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonOk({ ok: false, errors: parsed.error.flatten() }, 400);
  }

  const payload = parsed.data;

  const assigned = assignNearestHospital(payload.location.lat, payload.location.lng);

  return jsonOk({
    assigned_hospital_id: assigned.id,
    assigned_hospital_name: assigned.name,
    eta_minutes: assigned.etaMinutes,
    event_status: "queued",
    webhook_received_at: new Date().toISOString(),
  });
}
