import { ClipboardList } from "lucide-react";
import { listAuditLogs } from "@/lib/hms-data";
import { requirePagePermission } from "@/lib/page-auth";

export default async function Page() {
  await requirePagePermission("settings", "administer", {
    requireMfa: true,
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });

  const logs = await listAuditLogs();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Settings</p>
        </div>
        <h1 className="mt-3 text-3xl">Audit Viewer</h1>
        <p className="mt-2 text-sm text-foreground/70">Access timeline and change activity with actor and resource context.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Resource ID</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((entry) => (
              <tr key={entry.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{entry.actorName}</td>
                <td className="px-4 py-3">{entry.action}</td>
                <td className="px-4 py-3">{entry.resource}</td>
                <td className="px-4 py-3">{entry.resourceId || "-"}</td>
                <td className="px-4 py-3">{new Date(entry.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}