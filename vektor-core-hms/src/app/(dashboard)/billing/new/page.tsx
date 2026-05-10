import { CirclePlus, FileText } from "lucide-react";
import { listPatients, listBillingInvoices } from "@/lib/hms-data";

export default async function Page() {
  const [patients, invoices] = await Promise.all([listPatients(), listBillingInvoices()]);

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <CirclePlus className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Billing & Finance</p>
        </div>
        <h1 className="mt-3 text-3xl">Create Invoice</h1>
        <p className="mt-2 text-sm text-foreground/70">Auto-build invoices from encounter, procedure, medication, and room charge data.</p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Invoice Builder</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium">
              Patient
              <select className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm">
                {patients.map((patient) => (
                  <option key={patient.uhid} value={patient.uhid}>
                    {patient.fullName} ({patient.uhid})
                  </option>
                ))}
              </select>
            </label>
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Encounter ID" />
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Total amount" />
            <select className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm">
              <option>Draft</option>
              <option>Sent</option>
              <option>Pending</option>
              <option>Paid</option>
            </select>
            <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">Preview Invoice</button>
          </div>
        </article>

        <article className="panel p-5 xl:col-span-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Recent Invoice Pool</h2>
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
                  <tr key={invoice.id} className="border-t border-line">
                    <td className="px-4 py-3 font-medium">{invoice.invoiceNo}</td>
                    <td className="px-4 py-3">{invoice.patientName}</td>
                    <td className="px-4 py-3">Rs {invoice.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">{invoice.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}