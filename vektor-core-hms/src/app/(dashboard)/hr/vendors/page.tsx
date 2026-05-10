import { Truck } from "lucide-react";
import { listVendors } from "@/lib/hms-data";

export default async function Page() {
  const vendors = await listVendors();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Truck className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Administration & HR</p>
        </div>
        <h1 className="mt-3 text-3xl">Vendor Management</h1>
        <p className="mt-2 text-sm text-foreground/70">Maintain vendor contracts, contacts, and service terms.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{vendor.vendorName}</td>
                <td className="px-4 py-3">{vendor.contact}</td>
                <td className="px-4 py-3">{vendor.service}</td>
                <td className="px-4 py-3">{vendor.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}