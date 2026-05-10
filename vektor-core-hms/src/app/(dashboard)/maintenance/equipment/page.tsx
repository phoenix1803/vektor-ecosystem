import { Wrench, ScanSearch } from "lucide-react";
import { listEquipment } from "@/lib/hms-data";

export default async function EquipmentPage() {
  const equipment = await listEquipment();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Wrench className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Maintenance</p>
        </div>
        <h1 className="mt-3 text-3xl">Equipment Registry</h1>
      </section>

      <section className="panel p-5">
        <div className="flex items-center gap-2">
          <ScanSearch className="h-4 w-4 text-brand" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Asset Status</h2>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-strong text-foreground/75">
              <tr>
                <th className="px-4 py-3">Equipment</th>
                <th className="px-4 py-3">Serial</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item.serial} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3">{item.serial}</td>
                  <td className="px-4 py-3">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
