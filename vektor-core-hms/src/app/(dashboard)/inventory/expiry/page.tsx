import { CalendarClock } from "lucide-react";
import { listExpiryWatchlist } from "@/lib/hms-data";

export default async function Page() {
  const watchlist = await listExpiryWatchlist();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <CalendarClock className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Expiry Governance</p>
        </div>
        <h1 className="mt-3 text-3xl">Expiry Management</h1>
        <p className="mt-2 text-sm text-foreground/70">Prioritize FEFO issue, prevent wastage, and isolate short-shelf stock early.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Expiry Date</th>
              <th className="px-4 py-3">Days Left</th>
              <th className="px-4 py-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((row) => (
              <tr key={row.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{row.itemName}</td>
                <td className="px-4 py-3">{row.sku}</td>
                <td className="px-4 py-3">{new Date(row.expiryDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{row.daysToExpire}</td>
                <td className="px-4 py-3">{row.stockOnHand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}