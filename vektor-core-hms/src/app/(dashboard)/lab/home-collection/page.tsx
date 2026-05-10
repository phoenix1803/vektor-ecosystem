import { MapPinned } from "lucide-react";
import { listHomeCollections } from "@/lib/hms-data";

export default async function Page() {
  const collections = await listHomeCollections();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <MapPinned className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Lab & Diagnostics</p>
        </div>
        <h1 className="mt-3 text-3xl">Home Collection</h1>
        <p className="mt-2 text-sm text-foreground/70">Plan and monitor home sample collection requests.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Slot</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{collection.patientName}</td>
                <td className="px-4 py-3">{collection.address}</td>
                <td className="px-4 py-3">{collection.slot}</td>
                <td className="px-4 py-3">{collection.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}