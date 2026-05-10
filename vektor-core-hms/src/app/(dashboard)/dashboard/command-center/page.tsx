import Link from "next/link";
import { AlertTriangle, ClipboardList, Gauge, Siren, TimerReset } from "lucide-react";
import {
  getCommandCenterSnapshot,
  listOrchestratedTasks,
  listSlaSnapshots,
} from "@/lib/hms-data";
import { requirePagePermission } from "@/lib/page-auth";

export default async function CommandCenterPage() {
  await requirePagePermission("dashboard", "view", {
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });

  const [snapshot, tasks, sla] = await Promise.all([
    getCommandCenterSnapshot(),
    listOrchestratedTasks(),
    listSlaSnapshots(),
  ]);

  const activeTasks = tasks.filter((task) => task.status !== "DONE").length;

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <p className="chip bg-brand-soft text-brand">Command Center</p>
        <h1 className="mt-4 text-3xl">Cross-Module Clinical Command Center</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Live operational intelligence across critical care, diagnostics, throughput, and finance.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <article className="panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/70">Bed Pressure</p>
            <Gauge className="h-4 w-4 text-brand" aria-hidden="true" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{snapshot.bedPressurePercent}%</p>
        </article>
        <article className="panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/70">Critical Labs Pending</p>
            <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{snapshot.criticalLabsPending}</p>
        </article>
        <article className="panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/70">Emergency Load</p>
            <Siren className="h-4 w-4 text-danger" aria-hidden="true" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{snapshot.emergencyLoad}</p>
        </article>
        <article className="panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/70">Discharge Blockers</p>
            <TimerReset className="h-4 w-4 text-brand" aria-hidden="true" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{snapshot.dischargeBlockers}</p>
        </article>
        <article className="panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/70">Open Orchestrated Tasks</p>
            <ClipboardList className="h-4 w-4 text-brand" aria-hidden="true" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{activeTasks}</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel p-5 xl:col-span-2">
          <h2 className="text-lg font-semibold">Live Alert Feed</h2>
          <div className="mt-4 space-y-3">
            {snapshot.alerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-line bg-white p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">
                    {alert.severity} - {alert.title}
                  </p>
                  <p className="text-xs text-foreground/60">Age: {alert.ageMinutes} min</p>
                </div>
                <p className="mt-1 text-foreground/75">{alert.detail}</p>
                <div className="mt-2">
                  <Link href={alert.routePath} className="text-xs font-semibold text-brand underline-offset-2 hover:underline">
                    Open {alert.module} workflow
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <h2 className="text-lg font-semibold">SLA Pulse</h2>
          <div className="mt-4 space-y-3">
            {sla.map((metric) => (
              <div key={metric.id} className="rounded-xl border border-line bg-white p-3 text-sm">
                <p className="font-semibold">{metric.process}</p>
                <p className="mt-1 text-foreground/75">p50 {metric.p50Minutes} min | p90 {metric.p90Minutes} min</p>
                <p className="text-foreground/75">Breaches (24h): {metric.breaches24h}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-semibold">Task Orchestration Queue</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-strong text-foreground/75">
              <tr>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Assignee Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">SLA Due</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{task.module}</td>
                  <td className="px-4 py-3">{task.title}</td>
                  <td className="px-4 py-3">{task.assigneeRole}</td>
                  <td className="px-4 py-3">{task.status}</td>
                  <td className="px-4 py-3">{new Date(task.slaDueAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
