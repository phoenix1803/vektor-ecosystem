import { ClipboardCheck } from "lucide-react";
import { listInspectionTasks } from "@/lib/hms-data";

export default async function Page() {
  const inspections = await listInspectionTasks();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><ClipboardCheck className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Maintenance & Assets</p></div>
        <h1 className="mt-3 text-3xl">Facility Inspection</h1>
        <p className="mt-2 text-sm text-foreground/70">Schedule inspections with punch list and sign-off records.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {inspections.map((inspection) => (
          <article key={inspection.id} className="panel p-5 text-sm">
            <p className="font-semibold">{inspection.area}</p>
            <p className="mt-1 text-foreground/70">Inspector: {inspection.inspector}</p>
            <p className="mt-1 text-foreground/70">Scheduled: {new Date(inspection.scheduledAt).toLocaleString()}</p>
            <p className="mt-1 text-foreground/70">Status: {inspection.status}</p>
          </article>
        ))}
      </section>
    </div>
  );
}