import { Activity, ChartColumnBig, UsersRound } from "lucide-react";
import { getAnalyticsSnapshot } from "@/lib/hms-data";
import { RevenueTrendChart } from "@/components/analytics/revenue-trend-chart";

export default async function AnalyticsExecutivePage() {
  const snapshot = await getAnalyticsSnapshot();
  const revenueData = [
    { month: "Nov", revenue: 620000 },
    { month: "Dec", revenue: 740000 },
    { month: "Jan", revenue: 810000 },
    { month: "Feb", revenue: 780000 },
    { month: "Mar", revenue: 920000 },
    { month: "Apr", revenue: 840000 },
  ];

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ChartColumnBig className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Analytics</p>
        </div>
        <h1 className="mt-3 text-3xl">Executive KPI Dashboard</h1>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-5"><Activity className="h-4 w-4 text-brand" aria-hidden="true" /><p className="mt-2 text-sm font-semibold">Revenue</p><p className="text-2xl font-semibold">Rs {(snapshot.revenue / 100000).toFixed(1)}L</p></article>
        <article className="panel p-5"><UsersRound className="h-4 w-4 text-brand" aria-hidden="true" /><p className="mt-2 text-sm font-semibold">Footfall</p><p className="text-2xl font-semibold">{snapshot.satisfaction}% satisfaction</p></article>
        <article className="panel p-5"><ChartColumnBig className="h-4 w-4 text-brand" aria-hidden="true" /><p className="mt-2 text-sm font-semibold">Occupancy</p><p className="text-2xl font-semibold">{snapshot.occupancy}%</p></article>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-semibold">Monthly Revenue Trend</h2>
        <div className="mt-4">
          <RevenueTrendChart data={revenueData} />
        </div>
      </section>
    </div>
  );
}
