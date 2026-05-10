import { Gauge } from "lucide-react";
import { listJourneyScores } from "@/lib/hms-data";
import { requirePagePermission } from "@/lib/page-auth";

export default async function JourneyScorePage() {
  await requirePagePermission("analytics", "view", {
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });

  const rows = await listJourneyScores();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Gauge className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Phase 2</p>
        </div>
        <h1 className="mt-3 text-3xl">Patient Journey Score</h1>
        <p className="mt-2 text-sm text-foreground/70">Composite score unifying clinical safety, timeliness, communication, and billing experience.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Scope</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Clinical</th>
              <th className="px-4 py-3">Timeliness</th>
              <th className="px-4 py-3">Communication</th>
              <th className="px-4 py-3">Billing</th>
              <th className="px-4 py-3">Composite</th>
              <th className="px-4 py-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{row.scope}</td>
                <td className="px-4 py-3">{row.patientName || row.scopeId}</td>
                <td className="px-4 py-3">{row.clinicalSafety}</td>
                <td className="px-4 py-3">{row.serviceTimeliness}</td>
                <td className="px-4 py-3">{row.communication}</td>
                <td className="px-4 py-3">{row.billingFriction}</td>
                <td className="px-4 py-3 font-semibold">{row.compositeScore}</td>
                <td className="px-4 py-3">{row.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
