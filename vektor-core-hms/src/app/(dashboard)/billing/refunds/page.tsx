import { RotateCcw } from "lucide-react";
import { listRefundRequests } from "@/lib/hms-data";

export default async function Page() {
  const refunds = await listRefundRequests();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Billing & Finance</p>
        </div>
        <h1 className="mt-3 text-3xl">Refund Workflow</h1>
        <p className="mt-2 text-sm text-foreground/70">Process refund requests with approval and audit checkpoints.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((refund) => (
              <tr key={refund.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{refund.invoiceNo}</td>
                <td className="px-4 py-3">{refund.patientName}</td>
                <td className="px-4 py-3">{refund.reason}</td>
                <td className="px-4 py-3">Rs {refund.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{refund.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}