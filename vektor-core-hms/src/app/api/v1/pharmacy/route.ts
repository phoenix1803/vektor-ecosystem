import { prisma, isDatabaseConfigured } from "@/lib/db";
import { jsonOk } from "@/lib/mock";
import { prescriptionCreateSchema } from "@/lib/schemas";
import { listPrescriptions } from "@/lib/hms-data";

export async function GET() {
  const prescriptions = await listPrescriptions();
  return jsonOk({ data: prescriptions, source: isDatabaseConfigured ? "database" : "mock" });
}

export async function POST(request: Request) {
  const parsed = prescriptionCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonOk({ ok: false, errors: parsed.error.flatten() }, 400);
  }

  const payload = parsed.data;

  if (!isDatabaseConfigured) {
    return jsonOk({ id: `RX-${Date.now()}`, ...payload, source: "mock" }, 201);
  }

  const prescription = await prisma.prescription.create({
    data: {
      encounterId: payload.encounterId,
      prescribedByUserId: payload.prescribedByUserId,
      status: payload.status || "DRAFT",
      notes: payload.notes || null,
    },
  });

  return jsonOk(prescription, 201);
}
