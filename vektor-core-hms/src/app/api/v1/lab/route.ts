import { prisma, isDatabaseConfigured } from "@/lib/db";
import { jsonOk } from "@/lib/mock";
import { labOrderCreateSchema } from "@/lib/schemas";
import { listLabOrders } from "@/lib/hms-data";

export async function GET() {
  const orders = await listLabOrders();
  return jsonOk({ data: orders, source: isDatabaseConfigured ? "database" : "mock" });
}

export async function POST(request: Request) {
  const parsed = labOrderCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonOk({ ok: false, errors: parsed.error.flatten() }, 400);
  }

  const payload = parsed.data;

  if (!isDatabaseConfigured) {
    return jsonOk({ id: `LAB-${Date.now()}`, ...payload, source: "mock" }, 201);
  }

  const order = await prisma.labOrder.create({
    data: {
      encounterId: payload.encounterId,
      orderedByUserId: payload.orderedByUserId,
      testCode: payload.testCode,
      status: payload.status || "ORDERED",
      priority: payload.priority || "ROUTINE",
    },
  });

  return jsonOk(order, 201);
}
