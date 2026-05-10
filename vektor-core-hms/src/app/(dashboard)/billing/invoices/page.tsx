import { CircleDollarSign, FileText, Receipt } from "lucide-react";
import { listBillingInvoices } from "@/lib/hms-data";

function statusChip(status: string) {
  const key = status.toUpperCase();
  const map: Record<string, string> = {
    PAID: "chip border-success/30 bg-success/10 text-success",
    PENDING: "chip border-warning/30 bg-warning/10 text-warning",
    OVERDUE: "chip border-danger/30 bg-danger/10 text-danger",
    DRAFT: "chip border-line bg-surface-strong text-foreground/60",
  };

  return <span className={map[key] ?? "chip border-line bg-white text-foreground/70"}>{status}</span>;
}

export default async function BillingInvoicesPage() {
  const invoices = await listBillingInvoices();
  const revenueToday = invoices
    .filter((invoice) => invoice.status.toUpperCase() === "PAID")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const outstanding = invoices
    .filter((invoice) => ["PENDING", "OVERDUE"].includes(invoice.status.toUpperCase()))
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const overdue = invoices
    .filter((invoice) => invoice.status.toUpperCase() === "OVERDUE")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Receipt className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Billing Workflow</p>
        </div>
        <h1 className="mt-3 text-3xl">Invoices and Payment Closure</h1>
        <p className="mt-2 text-sm text-foreground/70">Create, review, and reconcile invoice lifecycle from encounter data.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-5">
          <p className="text-sm text-foreground/70">Revenue Today</p>
          <p className="mt-2 text-2xl font-semibold">Rs {revenueToday.toLocaleString()}</p>
        </article>
        <article className="panel p-5">
          <p className="text-sm text-foreground/70">Outstanding</p>
          <p className="mt-2 text-2xl font-semibold text-warning">Rs {outstanding.toLocaleString()}</p>
        </article>
        <article className="panel p-5">
          <p className="text-sm text-foreground/70">Overdue</p>
          <p className="mt-2 text-2xl font-semibold text-danger">Rs {overdue.toLocaleString()}</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">New Invoice</h2>
          <div className="mt-4 space-y-3">
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Encounter ID" />
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Invoice total" />
            <select className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm">
              <option>Draft</option>
              <option>Sent</option>
              <option>Pending</option>
            </select>
            <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">Create Invoice</button>
          </div>
        </article>

        <article className="panel p-5 xl:col-span-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Invoice Queue</h2>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-strong text-foreground/75">
                <tr>
                  <th className="px-4 py-3">Invoice No</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.invoiceNo} className="border-t border-line">
                    <td className="px-4 py-3 font-medium">{invoice.invoiceNo}</td>
                    <td className="px-4 py-3">{invoice.patientName}</td>
                    <td className="px-4 py-3">Rs {invoice.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">{statusChip(invoice.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="panel p-5">
        <div className="flex items-center gap-2 text-brand">
          <CircleDollarSign className="h-4 w-4" aria-hidden="true" />
          <p className="text-sm font-semibold">Collection and reconciliation hooks are ready for API v1 integration.</p>
        </div>
      </section>
    </div>
  );
}
