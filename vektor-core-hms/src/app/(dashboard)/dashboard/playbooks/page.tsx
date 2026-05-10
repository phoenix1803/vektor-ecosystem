import { SlidersHorizontal } from "lucide-react";
import { listPlaybookRules } from "@/lib/hms-data";
import { requirePagePermission } from "@/lib/page-auth";

export default async function PlaybooksPage() {
  await requirePagePermission("settings", "administer", {
    requireMfa: true,
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });

  const rows = await listPlaybookRules();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Phase 2</p>
        </div>
        <h1 className="mt-3 text-3xl">Configurable Playbooks</h1>
        <p className="mt-2 text-sm text-foreground/70">No-code rule governance for alert routing, assignment, and escalation logic.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Rule</th>
              <th className="px-4 py-3">Trigger</th>
              <th className="px-4 py-3">Condition</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="px-4 py-3">{row.trigger}</td>
                <td className="px-4 py-3">{row.condition}</td>
                <td className="px-4 py-3">{row.action}</td>
                <td className="px-4 py-3">v{row.version}</td>
                <td className="px-4 py-3">{row.isActive ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
