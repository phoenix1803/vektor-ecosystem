import { prisma, isDatabaseConfigured } from "@/lib/db";
import { jsonOk } from "@/lib/mock";
import { emrNoteCreateSchema } from "@/lib/schemas";
import { listClinicalNotes } from "@/lib/hms-data";

export async function GET() {
  const notes = await listClinicalNotes();
  return jsonOk({ data: notes, source: isDatabaseConfigured ? "database" : "mock" });
}

export async function POST(request: Request) {
  const parsed = emrNoteCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonOk({ ok: false, errors: parsed.error.flatten() }, 400);
  }

  const payload = parsed.data;

  if (!isDatabaseConfigured) {
    return jsonOk({ id: `NOTE-${Date.now()}`, ...payload, source: "mock" }, 201);
  }

  const created = await prisma.clinicalNote.create({
    data: {
      encounterId: payload.encounterId,
      authorUserId: payload.authorUserId,
      noteType: payload.noteType || "SOAP",
      summary: payload.summary || "",
      contentFhir: payload.contentFhir || {},
    },
  });

  return jsonOk(created, 201);
}
