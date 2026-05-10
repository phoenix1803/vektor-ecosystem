import { HeartPulse } from "lucide-react";
import { listClinicalOutcomes } from "@/lib/hms-data";

export default async function Page() {
  const outcomes = await listClinicalOutcomes();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <HeartPulse className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Clinical Outcomes</p>
        </div>
        <h1 className="mt-3 text-3xl">Clinical Outcomes</h1>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Readmission %</th>
              <th className="px-4 py-3">Complication %</th>
              <th className="px-4 py-3">Mortality %</th>
              <th className="px-4 py-3">ALOS (days)</th>
            </tr>
          </thead>
          <tbody>
            {outcomes.map((row) => (
              <tr key={row.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{row.department}</td>
                <td className="px-4 py-3">{row.readmissionRate.toFixed(1)}</td>
                <td className="px-4 py-3">{row.complicationRate.toFixed(1)}</td>
                <td className="px-4 py-3">{row.mortalityRate.toFixed(1)}</td>
                <td className="px-4 py-3">{row.avgLengthOfStay.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}