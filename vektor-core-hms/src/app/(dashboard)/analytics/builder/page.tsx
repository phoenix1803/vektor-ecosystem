import { Blocks } from "lucide-react";
import { listReportTemplates } from "@/lib/hms-data";

export default async function Page() {
  const templates = await listReportTemplates();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Blocks className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Analytics & Reporting</p>
        </div>
        <h1 className="mt-3 text-3xl">Custom Report Builder</h1>
        <p className="mt-2 text-sm text-foreground/70">Manage reusable templates and launch no-code operational reports.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Template</th>
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">Cadence</th>
              <th className="px-4 py-3">Last Run</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{template.name}</td>
                <td className="px-4 py-3">{template.domain}</td>
                <td className="px-4 py-3">{template.cadence}</td>
                <td className="px-4 py-3">{new Date(template.lastRunAt).toLocaleString()}</td>
                <td className="px-4 py-3">{template.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}