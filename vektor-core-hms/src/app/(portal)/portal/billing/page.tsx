import { CircleDollarSign } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { listPatientInvoices } from "@/lib/hms-data";

type InvoiceItem = {
  id: string;
  invoiceNo: string;
  patientName: string;
  totalAmount: number;
  status: string;
  issuedAt: string;
};

export default async function PortalBillingPage() {
  const session = await getServerSession(authOptions);
  const invoices = (await listPatientInvoices(session?.user.patientUhid || "UHID-12091")) as InvoiceItem[];

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><CircleDollarSign className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Billing</p></div>
        <h1 className="mt-3 text-3xl">Invoices and Payments</h1>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75"><tr><th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Issued</th></tr></thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{invoice.invoiceNo}</td>
                <td className="px-4 py-3">Rs {invoice.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{invoice.status}</td>
                <td className="px-4 py-3">{new Date(invoice.issuedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
