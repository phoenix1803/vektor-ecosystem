import { prisma, isDatabaseConfigured } from "@/lib/db";
import { jsonOk } from "@/lib/mock";
import { inventoryItemCreateSchema } from "@/lib/schemas";
import { listInventoryItems } from "@/lib/hms-data";

export async function GET() {
  const items = await listInventoryItems();
  return jsonOk({ data: items, source: isDatabaseConfigured ? "database" : "mock" });
}

export async function POST(request: Request) {
  const parsed = inventoryItemCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonOk({ ok: false, errors: parsed.error.flatten() }, 400);
  }

  const payload = parsed.data;

  if (!isDatabaseConfigured) {
    return jsonOk({ id: `SKU-${Date.now()}`, ...payload, source: "mock" }, 201);
  }

  const item = await prisma.inventoryItem.create({
    data: {
      hospitalId: payload.hospitalId,
      sku: payload.sku,
      name: payload.name,
      category: payload.category || "GENERAL",
      stockOnHand: payload.stockOnHand || 0,
      reorderLevel: payload.reorderLevel || 0,
      expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : null,
    },
  });

  return jsonOk(item, 201);
}
