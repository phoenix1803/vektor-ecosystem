import { prisma, isDatabaseConfigured } from "@/lib/db";
import { jsonOk } from "@/lib/mock";
import { patientCreateSchema } from "@/lib/schemas";
import { listPatients } from "@/lib/hms-data";

export async function GET() {
  const patients = await listPatients();
  return jsonOk({ data: patients, source: isDatabaseConfigured ? "database" : "mock" });
}

export async function POST(request: Request) {
  const parsed = patientCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonOk({ ok: false, errors: parsed.error.flatten() }, 400);
  }

  const payload = parsed.data;

  if (!isDatabaseConfigured) {
    return jsonOk({ id: `UHID-${Date.now()}`, ...payload, source: "mock" }, 201);
  }

  const patient = await prisma.patient.create({
    data: {
      hospitalId: payload.hospitalId || "hsp_demo_001",
      uhid: payload.uhid || `UHID-${Date.now()}`,
      fullName: payload.fullName || "Unknown Patient",
      phone: payload.phone || null,
      gender: payload.gender || null,
      dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : null,
      aadhaar: payload.aadhaar || null,
      bloodGroup: payload.bloodGroup || null,
    },
  });

  return jsonOk(patient, 201);
}
