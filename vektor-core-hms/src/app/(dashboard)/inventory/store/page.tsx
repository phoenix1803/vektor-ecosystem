import { PackageSearch, Warehouse } from "lucide-react";
import { listInventoryItems } from "@/lib/hms-data";

export default async function StorePage() {
  const items = await listInventoryItems();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Warehouse className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Inventory Workflow</p>
        </div>
        <h1 className="mt-3 text-3xl">Central Store</h1>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Stock Adjustment</h2>
          <div className="mt-4 space-y-3">
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="SKU" />
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Quantity" />
            <select className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm">
              <option>Issue</option>
              <option>Receive</option>
              <option>Transfer</option>
            </select>
            <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">Apply Change</button>
          </div>
        </article>

        <article className="panel p-5 xl:col-span-2">
          <div className="flex items-center gap-2">
            <PackageSearch className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Inventory Stock Table</h2>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-strong text-foreground/75">
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Reorder</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.sku} className="border-t border-line">
                    <td className="px-4 py-3 font-medium">{item.sku}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.stockOnHand}</td>
                    <td className="px-4 py-3">{item.reorderLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
