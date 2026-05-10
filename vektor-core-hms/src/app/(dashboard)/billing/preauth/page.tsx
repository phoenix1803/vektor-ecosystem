import { ShieldCheck } from "lucide-react";
import { listPreauthRequests } from "@/lib/hms-data";

export default async function Page() {
  const requests = await listPreauthRequests();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Billing & Finance</p>
        </div>
        <h1 className="mt-3 text-3xl">Pre-Authorization</h1>
        <p className="mt-2 text-sm text-foreground/70">Manage pre-auth requests and insurer status updates before admission or procedures.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Procedure</th>
              <th className="px-4 py-3">Insurer</th>
              <th className="px-4 py-3">Requested</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{request.patientName}</td>
                <td className="px-4 py-3">{request.procedure}</td>
                <td className="px-4 py-3">{request.insurer}</td>
                <td className="px-4 py-3">Rs {request.requestedAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}