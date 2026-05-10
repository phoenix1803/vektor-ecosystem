import { HeartPulse } from "lucide-react";
import { listIcuAlerts } from "@/lib/hms-data";

export default async function Page() {
  const alerts = await listIcuAlerts();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <HeartPulse className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Inpatient and Ward</p>
        </div>
        <h1 className="mt-3 text-3xl">ICU Monitoring</h1>
        <p className="mt-2 text-sm text-foreground/70">Review high-acuity patient signals and escalation markers.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {alerts.map((alert) => (
          <article key={alert.id} className="panel p-5 text-sm">
            <p className="font-semibold">{alert.patientName}</p>
            <p className="mt-1 text-foreground/70">Bed: {alert.bedCode}</p>
            <p className="mt-1 text-foreground/70">Alert: {alert.alert}</p>
            <p className="mt-1 text-foreground/70">Severity: {alert.severity}</p>
          </article>
        ))}
      </section>
    </div>
  );
}