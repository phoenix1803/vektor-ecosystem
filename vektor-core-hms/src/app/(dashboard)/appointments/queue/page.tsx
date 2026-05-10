import { ListOrdered } from "lucide-react";
import { listAppointmentQueue } from "@/lib/hms-data";

export default async function AppointmentQueuePage() {
  const queue = await listAppointmentQueue();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ListOrdered className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Queue Board</p>
        </div>
        <h1 className="mt-3 text-3xl">Walk-in Token Board</h1>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Token</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Wait (min)</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((entry) => (
              <tr key={entry.token} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-semibold">{entry.token}</td>
                <td className="px-4 py-3">{entry.patientName}</td>
                <td className="px-4 py-3">{entry.doctorName}</td>
                <td className="px-4 py-3">{entry.status}</td>
                <td className="px-4 py-3">{entry.waitingMinutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
