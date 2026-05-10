import { Shirt } from "lucide-react";
import { listLinenCycles } from "@/lib/hms-data";

export default async function Page() {
  const rows = await listLinenCycles();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Shirt className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Linen Operations</p>
        </div>
        <h1 className="mt-3 text-3xl">Linen and Laundry</h1>
        <p className="mt-2 text-sm text-foreground/70">Track issue-return counts and ward-wise laundry turnaround performance.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Ward</th>
              <th className="px-4 py-3">Issued</th>
              <th className="px-4 py-3">Returned</th>
              <th className="px-4 py-3">Pending</th>
              <th className="px-4 py-3">TAT (hrs)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{row.ward}</td>
                <td className="px-4 py-3">{row.issued}</td>
                <td className="px-4 py-3">{row.returned}</td>
                <td className="px-4 py-3">{row.pending}</td>
                <td className="px-4 py-3">{row.turnAroundHours.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}