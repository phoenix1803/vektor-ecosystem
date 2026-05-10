import { ShieldAlert } from "lucide-react";
import { listRegulatoryReports } from "@/lib/hms-data";

export default async function Page() {
  const reports = await listRegulatoryReports();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Regulatory Reporting</p>
        </div>
        <h1 className="mt-3 text-3xl">Regulatory Reports</h1>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Report</th>
              <th className="px-4 py-3">Authority</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{report.reportName}</td>
                <td className="px-4 py-3">{report.authority}</td>
                <td className="px-4 py-3">{new Date(report.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{report.owner}</td>
                <td className="px-4 py-3">{report.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}