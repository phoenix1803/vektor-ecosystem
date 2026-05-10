import { Activity } from "lucide-react";
import { listChronicRegistry } from "@/lib/hms-data";

export default async function Page() {
  const rows = await listChronicRegistry();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Activity className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Clinical and EMR</p>
        </div>
        <h1 className="mt-3 text-3xl">Chronic Disease Monitoring</h1>
        <p className="mt-2 text-sm text-foreground/70">Track longitudinal care plans and review timelines for chronic patients.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Condition</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Last Review</th>
              <th className="px-4 py-3">Next Review</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{row.patientName}</td>
                <td className="px-4 py-3">{row.condition}</td>
                <td className="px-4 py-3">{row.riskLevel}</td>
                <td className="px-4 py-3">{new Date(row.lastReviewAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">{new Date(row.nextReviewAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}