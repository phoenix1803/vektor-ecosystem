import { ShieldCheck } from "lucide-react";
import { listControlledSubstances } from "@/lib/hms-data";

export default async function Page() {
  const logs = await listControlledSubstances();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Controlled Medicines</p>
        </div>
        <h1 className="mt-3 text-3xl">Controlled Substances</h1>
        <p className="mt-2 text-sm text-foreground/70">Maintain narcotics balance, issue traceability, and audit reconciliation status.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Drug</th>
              <th className="px-4 py-3">Schedule</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Last Issued To</th>
              <th className="px-4 py-3">Last Issued At</th>
              <th className="px-4 py-3">Audit</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((row) => (
              <tr key={row.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{row.drugName}</td>
                <td className="px-4 py-3">{row.schedule}</td>
                <td className="px-4 py-3">{row.balanceUnits}</td>
                <td className="px-4 py-3">{row.lastIssuedTo}</td>
                <td className="px-4 py-3">{new Date(row.lastIssuedAt).toLocaleString()}</td>
                <td className="px-4 py-3">{row.auditStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}