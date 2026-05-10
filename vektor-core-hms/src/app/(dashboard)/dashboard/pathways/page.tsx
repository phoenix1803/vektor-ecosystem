import { Route } from "lucide-react";
import { listOutcomePathways } from "@/lib/hms-data";
import { requirePagePermission } from "@/lib/page-auth";

export default async function PathwaysPage() {
  await requirePagePermission("analytics", "view", {
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });

  const rows = await listOutcomePathways();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Route className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Phase 2</p>
        </div>
        <h1 className="mt-3 text-3xl">Outcome-Driven Care Pathways</h1>
        <p className="mt-2 text-sm text-foreground/70">Track pathway adherence, overdue milestones, and next-step accountability.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Pathway</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Adherence</th>
              <th className="px-4 py-3">Overdue</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{row.pathwayName}</td>
                <td className="px-4 py-3">{row.patientName}</td>
                <td className="px-4 py-3">{row.ownerRole}</td>
                <td className="px-4 py-3">{row.adherenceScore}%</td>
                <td className="px-4 py-3">{row.overdueSteps}</td>
                <td className="px-4 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
