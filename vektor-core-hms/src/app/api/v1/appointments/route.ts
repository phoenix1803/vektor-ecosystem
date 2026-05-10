import { prisma, isDatabaseConfigured } from "@/lib/db";
import { jsonOk } from "@/lib/mock";
import { appointmentCreateSchema } from "@/lib/schemas";
import { listAppointments } from "@/lib/hms-data";

export async function GET() {
  const appointments = await listAppointments();
  return jsonOk({ data: appointments, source: isDatabaseConfigured ? "database" : "mock" });
}

export async function POST(request: Request) {
  const parsed = appointmentCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonOk({ ok: false, errors: parsed.error.flatten() }, 400);
  }

  const payload = parsed.data;

  if (!isDatabaseConfigured) {
    return jsonOk({ id: `APT-${Date.now()}`, ...payload, source: "mock" }, 201);
  }

  const created = await prisma.appointment.create({
    data: {
      hospitalId: payload.hospitalId,
      patientId: payload.patientId,
      doctorUserId: payload.doctorUserId,
      type: payload.type || "OPD",
      status: payload.status || "BOOKED",
      startsAt: new Date(payload.startsAt),
      endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
      reason: payload.reason || null,
    },
  });

  return jsonOk(created, 201);
}
