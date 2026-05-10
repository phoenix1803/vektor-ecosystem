import { prisma, isDatabaseConfigured } from "@/lib/db";
import { jsonOk } from "@/lib/mock";
import { billingInvoiceCreateSchema } from "@/lib/schemas";
import { listBillingInvoices } from "@/lib/hms-data";

export async function GET() {
  const invoices = await listBillingInvoices();
  return jsonOk({ data: invoices, source: isDatabaseConfigured ? "database" : "mock" });
}

export async function POST(request: Request) {
  const parsed = billingInvoiceCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonOk({ ok: false, errors: parsed.error.flatten() }, 400);
  }

  const payload = parsed.data;

  if (!isDatabaseConfigured) {
    return jsonOk({ id: `INV-${Date.now()}`, ...payload, source: "mock" }, 201);
  }

  const invoice = await prisma.billingInvoice.create({
    data: {
      encounterId: payload.encounterId,
      invoiceNo: payload.invoiceNo || `VKC-${Date.now()}`,
      status: payload.status || "DRAFT",
      totalAmount: payload.totalAmount || 0,
      taxAmount: payload.taxAmount || 0,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
    },
  });

  return jsonOk(invoice, 201);
}
