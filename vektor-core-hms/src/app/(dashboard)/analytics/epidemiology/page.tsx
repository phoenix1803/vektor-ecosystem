import { Biohazard } from "lucide-react";
import { listEpidemiologySignals } from "@/lib/hms-data";

export default async function Page() {
  const signals = await listEpidemiologySignals();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Biohazard className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Epidemiology Tracking</p>
        </div>
        <h1 className="mt-3 text-3xl">Epidemiology Tracking</h1>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Syndrome</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">7d Cases</th>
              <th className="px-4 py-3">Baseline</th>
              <th className="px-4 py-3">Risk</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal) => (
              <tr key={signal.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{signal.syndrome}</td>
                <td className="px-4 py-3">{signal.unit}</td>
                <td className="px-4 py-3">{signal.cases7d}</td>
                <td className="px-4 py-3">{signal.baseline}</td>
                <td className="px-4 py-3">{signal.riskLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}