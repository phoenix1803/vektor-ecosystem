import { CreditCard, Repeat } from "lucide-react";
import { listPaymentLedger } from "@/lib/hms-data";

export default async function Page() {
  const ledger = await listPaymentLedger();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <CreditCard className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Billing & Finance</p>
        </div>
        <h1 className="mt-3 text-3xl">Payment Ledger</h1>
        <p className="mt-2 text-sm text-foreground/70">Track UPI, card, net banking, and cash payment reconciliations.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((payment) => (
              <tr key={payment.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{payment.invoiceNo}</td>
                <td className="px-4 py-3">{payment.patientName}</td>
                <td className="px-4 py-3">{payment.method}</td>
                <td className="px-4 py-3">Rs {payment.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel p-5 text-sm">
        <div className="flex items-center gap-2 text-brand">
          <Repeat className="h-4 w-4" aria-hidden="true" />
          <p className="font-semibold">Reconciliation workflow ready for API integration.</p>
        </div>
      </section>
    </div>
  );
}