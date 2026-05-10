import { BadgeCheck } from "lucide-react";
import { listBillingClaims } from "@/lib/hms-data";

export default async function Page() {
  const claims = await listBillingClaims();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Billing & Finance</p>
        </div>
        <h1 className="mt-3 text-3xl">Insurance Claims</h1>
        <p className="mt-2 text-sm text-foreground/70">Track claim submission, approval, and denial lifecycle for invoices.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Payer</th>
              <th className="px-4 py-3">Claim Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{claim.invoiceNo}</td>
                <td className="px-4 py-3">{claim.patientName}</td>
                <td className="px-4 py-3">{claim.payerName}</td>
                <td className="px-4 py-3">Rs {claim.claimAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{claim.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}