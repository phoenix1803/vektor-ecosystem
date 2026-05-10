import { Clock3 } from "lucide-react";
import { listAttendance } from "@/lib/hms-data";

export default async function Page() {
  const attendance = await listAttendance();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Clock3 className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Administration & HR</p>
        </div>
        <h1 className="mt-3 text-3xl">Attendance and Leave</h1>
        <p className="mt-2 text-sm text-foreground/70">Track check-ins, leaves, and attendance exceptions.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Staff</th>
              <th className="px-4 py-3">Check-in</th>
              <th className="px-4 py-3">Check-out</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Leave</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((entry) => (
              <tr key={entry.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{entry.staffName}</td>
                <td className="px-4 py-3">{new Date(entry.checkIn).toLocaleString()}</td>
                <td className="px-4 py-3">{entry.checkOut ? new Date(entry.checkOut).toLocaleString() : "-"}</td>
                <td className="px-4 py-3">{entry.status}</td>
                <td className="px-4 py-3">{entry.leaveType || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}