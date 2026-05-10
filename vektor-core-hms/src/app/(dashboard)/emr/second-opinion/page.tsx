import { Microscope } from "lucide-react";
import { listSecondOpinions } from "@/lib/hms-data";

export default async function Page() {
  const requests = await listSecondOpinions();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Microscope className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Clinical Collaboration</p>
        </div>
        <h1 className="mt-3 text-3xl">Second Opinion Workflow</h1>
        <p className="mt-2 text-sm text-foreground/70">Coordinate specialist review requests and track response turnaround.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Case</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Specialty</th>
              <th className="px-4 py-3">Requested</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{request.caseNo}</td>
                <td className="px-4 py-3">{request.patientName}</td>
                <td className="px-4 py-3">{request.specialty}</td>
                <td className="px-4 py-3">{new Date(request.requestedAt).toLocaleString()}</td>
                <td className="px-4 py-3">{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}