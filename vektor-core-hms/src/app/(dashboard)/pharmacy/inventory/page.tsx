import { PackageCheck } from "lucide-react";
import { listPharmacyInventory } from "@/lib/hms-data";

export default async function Page() {
  const inventory = await listPharmacyInventory();
  const lowStockCount = inventory.filter((item) => item.stockStatus === "LOW").length;

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <PackageCheck className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Pharmacy Operations</p>
        </div>
        <h1 className="mt-3 text-3xl">Drug Inventory</h1>
        <p className="mt-2 text-sm text-foreground/70">Track medicine stock, reorder risk, and expiry-sensitive inventory.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-5">
          <p className="text-sm text-foreground/70">Inventory SKUs</p>
          <p className="mt-2 text-2xl font-semibold">{inventory.length}</p>
        </article>
        <article className="panel p-5">
          <p className="text-sm text-foreground/70">Low Stock Alerts</p>
          <p className="mt-2 text-2xl font-semibold text-rose-600">{lowStockCount}</p>
        </article>
        <article className="panel p-5">
          <p className="text-sm text-foreground/70">Healthy Stock</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">{inventory.filter((item) => item.stockStatus === "HEALTHY").length}</p>
        </article>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Medicine</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Reorder Level</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{item.sku}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.stockOnHand}</td>
                <td className="px-4 py-3">{item.reorderLevel}</td>
                <td className="px-4 py-3">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-3">{item.stockStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}