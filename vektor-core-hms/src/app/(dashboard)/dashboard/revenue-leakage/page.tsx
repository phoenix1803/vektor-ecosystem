import { AlertOctagon } from "lucide-react";
import { listRevenueLeakageAlerts } from "@/lib/hms-data";
import { requirePagePermission } from "@/lib/page-auth";

export default async function RevenueLeakagePage() {
  await requirePagePermission("billing", "view", {
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });

  const rows = await listRevenueLeakageAlerts();
  const totalAtRisk = rows.filter((row) => row.status !== "RECOVERED").reduce((sum, row) => sum + row.potentialLeakage, 0);

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <AlertOctagon className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Phase 2</p>
        </div>
        <h1 className="mt-3 text-3xl">Revenue Leakage Detection</h1>
        <p className="mt-2 text-sm text-foreground/70">Detect and recover missing charges, coding mismatches, and claim delays.</p>
        <p className="mt-3 text-sm font-semibold text-danger">Open leakage at risk: INR {totalAtRisk.toLocaleString()}</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Encounter</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{row.encounterId}</td>
                <td className="px-4 py-3">{row.patientName}</td>
                <td className="px-4 py-3">{row.category}</td>
                <td className="px-4 py-3">INR {row.potentialLeakage.toLocaleString()}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">{row.recommendedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
