import { ShieldCheck } from "lucide-react";
import { listCredentials } from "@/lib/hms-data";

export default async function Page() {
  const credentials = await listCredentials();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Administration & HR</p>
        </div>
        <h1 className="mt-3 text-3xl">Credentialing</h1>
        <p className="mt-2 text-sm text-foreground/70">Monitor licenses, renewals, and registration validity for staff.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Staff</th>
              <th className="px-4 py-3">License</th>
              <th className="px-4 py-3">Specialty</th>
              <th className="px-4 py-3">Renewal</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {credentials.map((entry) => (
              <tr key={entry.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{entry.staffName}</td>
                <td className="px-4 py-3">{entry.licenseNumber}</td>
                <td className="px-4 py-3">{entry.specialty}</td>
                <td className="px-4 py-3">{entry.renewalDate}</td>
                <td className="px-4 py-3">{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}