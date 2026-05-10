import { Ruler } from "lucide-react";
import { listCalibrationLogs } from "@/lib/hms-data";

export default async function Page() {
  const logs = await listCalibrationLogs();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><Ruler className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Maintenance & Assets</p></div>
        <h1 className="mt-3 text-3xl">Calibration Logs</h1>
        <p className="mt-2 text-sm text-foreground/70">Capture calibration events for biomedical compliance.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {logs.map((log) => (
          <article key={log.id} className="panel p-5 text-sm">
            <p className="font-semibold">{log.equipmentName}</p>
            <p className="mt-1 text-foreground/70">Performed: {new Date(log.performedAt).toLocaleDateString()}</p>
            <p className="mt-1 text-foreground/70">Next due: {log.nextDue}</p>
            <p className="mt-1 text-foreground/70">Status: {log.status}</p>
          </article>
        ))}
      </section>
    </div>
  );
}