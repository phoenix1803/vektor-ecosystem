import { Tickets } from "lucide-react";
import { listMaintenanceTickets } from "@/lib/hms-data";

export default async function Page() {
  const tickets = await listMaintenanceTickets();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><Tickets className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Maintenance & Assets</p></div>
        <h1 className="mt-3 text-3xl">Repair Tickets</h1>
        <p className="mt-2 text-sm text-foreground/70">Log and track equipment breakdowns through resolution.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Equipment</th>
              <th className="px-4 py-3">Issue</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{ticket.ticketNo}</td>
                <td className="px-4 py-3">{ticket.equipmentName}</td>
                <td className="px-4 py-3">{ticket.issue}</td>
                <td className="px-4 py-3">{ticket.priority}</td>
                <td className="px-4 py-3">{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}