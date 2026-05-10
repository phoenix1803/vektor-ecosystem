import { CalendarRange } from "lucide-react";
import { listRoster } from "@/lib/hms-data";

export default async function Page() {
  const roster = await listRoster();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <CalendarRange className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Administration & HR</p>
        </div>
        <h1 className="mt-3 text-3xl">Shift Roster</h1>
        <p className="mt-2 text-sm text-foreground/70">Build rosters, approve swaps, and monitor overtime.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Staff</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Shift</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((item) => (
              <tr key={item.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{item.staffName}</td>
                <td className="px-4 py-3">{item.area}</td>
                <td className="px-4 py-3">{item.shift}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}