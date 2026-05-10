import { ShieldCheck } from "lucide-react";
import { listAccreditationEvidence } from "@/lib/hms-data";
import { requirePagePermission } from "@/lib/page-auth";

export default async function AccreditationPage() {
  await requirePagePermission("settings", "administer", {
    requireMfa: true,
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });

  const rows = await listAccreditationEvidence();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Phase 3</p>
        </div>
        <h1 className="mt-3 text-3xl">Accreditation Evidence Packs</h1>
        <p className="mt-2 text-sm text-foreground/70">Readiness tracking for NABH and NABL controls with evidence and gap visibility.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Standard</th>
              <th className="px-4 py-3">Control</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Evidence</th>
              <th className="px-4 py-3">Gaps</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{row.standard}</td>
                <td className="px-4 py-3">{row.controlCode}</td>
                <td className="px-4 py-3">{row.title}</td>
                <td className="px-4 py-3">{row.owner}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">{row.evidenceCount}</td>
                <td className="px-4 py-3">{row.gapCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
