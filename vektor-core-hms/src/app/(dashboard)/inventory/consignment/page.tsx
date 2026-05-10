import { Boxes } from "lucide-react";
import { listConsignmentItems } from "@/lib/hms-data";

export default async function Page() {
  const items = await listConsignmentItems();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Boxes className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Inventory & Supply Chain</p>
        </div>
        <h1 className="mt-3 text-3xl">Consignment Tracking</h1>
        <p className="mt-2 text-sm text-foreground/70">Monitor high-value implants and vendor-owned stocks used in procedures.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Implant / Item</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Lot No</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{item.implantName}</td>
                <td className="px-4 py-3">{item.vendorName}</td>
                <td className="px-4 py-3">{item.lotNo}</td>
                <td className="px-4 py-3">{item.quantityAvailable}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}