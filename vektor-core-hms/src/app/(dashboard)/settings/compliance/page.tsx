import { ClipboardCheck, ShieldCheck } from "lucide-react";
import { getComplianceSnapshot, listAuditLogs } from "@/lib/hms-data";

export default async function CompliancePage() {
  const [snapshot, auditLogs] = await Promise.all([getComplianceSnapshot(), listAuditLogs()]);

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Compliance</p>
        </div>
        <h1 className="mt-3 text-3xl">Audit and Compliance Controls</h1>
        <p className="mt-2 text-sm text-foreground/70">
          DPDP, consent coverage, ABHA linkage, and audit trails in one operational surface.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <article className="panel p-5 text-sm"><p className="text-foreground/70">Audit events</p><p className="mt-2 text-2xl font-semibold">{snapshot.auditCount}</p></article>
        <article className="panel p-5 text-sm"><p className="text-foreground/70">Portal messages</p><p className="mt-2 text-2xl font-semibold">{snapshot.portalMessages}</p></article>
        <article className="panel p-5 text-sm"><p className="text-foreground/70">Documents indexed</p><p className="mt-2 text-2xl font-semibold">{snapshot.documentsIndexed}</p></article>
        <article className="panel p-5 text-sm"><p className="text-foreground/70">Consent records</p><p className="mt-2 text-2xl font-semibold">{snapshot.consentRecords}</p></article>
        <article className="panel p-5 text-sm"><p className="text-foreground/70">ABHA linked</p><p className="mt-2 text-2xl font-semibold">{snapshot.abhaLinked ? "Yes" : "No"}</p></article>
      </section>

      <section className="panel p-5">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-brand" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Recent Audit Trail</h2>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-strong text-foreground/75">
              <tr>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((event) => (
                <tr key={event.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{event.actorName}</td>
                  <td className="px-4 py-3">{event.action}</td>
                  <td className="px-4 py-3">{event.resource}</td>
                  <td className="px-4 py-3">{new Date(event.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}