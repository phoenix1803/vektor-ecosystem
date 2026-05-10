import { WalletCards } from "lucide-react";
import { listFinanceMetrics } from "@/lib/hms-data";

export default async function Page() {
  const metrics = await listFinanceMetrics();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <WalletCards className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Finance Analytics</p>
        </div>
        <h1 className="mt-3 text-3xl">Finance Analytics</h1>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Revenue</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Margin</th>
              <th className="px-4 py-3">Collection Rate</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{metric.department}</td>
                <td className="px-4 py-3">INR {metric.revenue.toLocaleString()}</td>
                <td className="px-4 py-3">INR {metric.cost.toLocaleString()}</td>
                <td className="px-4 py-3">INR {metric.margin.toLocaleString()}</td>
                <td className="px-4 py-3">{Math.round(metric.collectionRate * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}