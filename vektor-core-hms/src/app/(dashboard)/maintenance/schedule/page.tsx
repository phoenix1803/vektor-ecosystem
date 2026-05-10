import { CalendarCheck2 } from "lucide-react";
import { listMaintenanceSchedule } from "@/lib/hms-data";

export default async function Page() {
  const schedule = await listMaintenanceSchedule();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><CalendarCheck2 className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Maintenance & Assets</p></div>
        <h1 className="mt-3 text-3xl">Preventive Schedule</h1>
        <p className="mt-2 text-sm text-foreground/70">Plan preventive maintenance calendar and equipment task cycles.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Equipment</th>
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <tr key={row.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{row.equipmentName}</td>
                <td className="px-4 py-3">{row.task}</td>
                <td className="px-4 py-3">{row.dueDate}</td>
                <td className="px-4 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}