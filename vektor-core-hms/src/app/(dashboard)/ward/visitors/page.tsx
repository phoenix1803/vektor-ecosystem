import { Users } from "lucide-react";
import { listVisitorPasses } from "@/lib/hms-data";

export default async function Page() {
  const passes = await listVisitorPasses();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Users className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Inpatient and Ward</p>
        </div>
        <h1 className="mt-3 text-3xl">Visitor Management</h1>
        <p className="mt-2 text-sm text-foreground/70">Issue and monitor visitor access for restricted wards.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Visitor</th>
              <th className="px-4 py-3">Relation</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Valid Until</th>
            </tr>
          </thead>
          <tbody>
            {passes.map((pass) => (
              <tr key={pass.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{pass.patientName}</td>
                <td className="px-4 py-3">{pass.visitorName}</td>
                <td className="px-4 py-3">{pass.relation}</td>
                <td className="px-4 py-3">{pass.passStatus}</td>
                <td className="px-4 py-3">{new Date(pass.validUntil).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}