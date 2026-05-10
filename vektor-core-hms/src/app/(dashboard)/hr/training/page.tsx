import { GraduationCap } from "lucide-react";
import { listTrainingRecords } from "@/lib/hms-data";

export default async function Page() {
  const training = await listTrainingRecords();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <GraduationCap className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Administration & HR</p>
        </div>
        <h1 className="mt-3 text-3xl">Training and CME</h1>
        <p className="mt-2 text-sm text-foreground/70">Track mandatory training and CME completion status.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Staff</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Completion</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {training.map((entry) => (
              <tr key={entry.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{entry.staffName}</td>
                <td className="px-4 py-3">{entry.course}</td>
                <td className="px-4 py-3">{entry.completion}%</td>
                <td className="px-4 py-3">{entry.dueDate}</td>
                <td className="px-4 py-3">{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}