import { Sparkles } from "lucide-react";
import { listHousekeepingTasks } from "@/lib/hms-data";

export default async function Page() {
  const tasks = await listHousekeepingTasks();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><Sparkles className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Maintenance & Assets</p></div>
        <h1 className="mt-3 text-3xl">Housekeeping Tasks</h1>
        <p className="mt-2 text-sm text-foreground/70">Track cleaning requests, checklists, and turnaround time.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{task.room}</td>
                <td className="px-4 py-3">{task.assignee}</td>
                <td className="px-4 py-3">{new Date(task.dueAt).toLocaleString()}</td>
                <td className="px-4 py-3">{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}