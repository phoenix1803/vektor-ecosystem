import { SmilePlus } from "lucide-react";
import { listSatisfactionMetrics } from "@/lib/hms-data";

export default async function Page() {
  const metrics = await listSatisfactionMetrics();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <SmilePlus className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Patient Experience</p>
        </div>
        <h1 className="mt-3 text-3xl">Patient Satisfaction</h1>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Touchpoint</th>
              <th className="px-4 py-3">NPS</th>
              <th className="px-4 py-3">CSAT</th>
              <th className="px-4 py-3">Complaints</th>
              <th className="px-4 py-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{metric.touchpoint}</td>
                <td className="px-4 py-3">{metric.nps}</td>
                <td className="px-4 py-3">{metric.csat}%</td>
                <td className="px-4 py-3">{metric.complaints}</td>
                <td className="px-4 py-3">{metric.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}