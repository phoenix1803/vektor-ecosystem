import { ChartLine } from "lucide-react";
import { listPerformanceMetrics } from "@/lib/hms-data";

export default async function Page() {
  const metrics = await listPerformanceMetrics();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ChartLine className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Administration & HR</p>
        </div>
        <h1 className="mt-3 text-3xl">Performance Dashboards</h1>
        <p className="mt-2 text-sm text-foreground/70">View productivity and patient feedback indicators by role.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.id} className="panel p-5 text-sm">
            <p className="font-semibold">{metric.staffName}</p>
            <p className="mt-1 text-foreground/70">Score: {metric.score}</p>
            <p className="mt-1 text-foreground/70">Satisfaction: {metric.satisfaction}%</p>
            <p className="mt-1 text-foreground/70">Caseload: {metric.caseload}</p>
            <p className="mt-1 text-foreground/70">Status: {metric.status}</p>
          </article>
        ))}
      </section>
    </div>
  );
}