import { FlaskConical } from "lucide-react";
import { listLabResults } from "@/lib/hms-data";

export default async function Page() {
  const results = await listLabResults();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <FlaskConical className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Lab & Diagnostics</p>
        </div>
        <h1 className="mt-3 text-3xl">Result Entry</h1>
        <p className="mt-2 text-sm text-foreground/70">Record diagnostic results with abnormal-value emphasis.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Test</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Resulted</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{result.testCode}</td>
                <td className="px-4 py-3">{result.patientName}</td>
                <td className="px-4 py-3">{result.value} {result.unit}</td>
                <td className="px-4 py-3">{result.status}</td>
                <td className="px-4 py-3">{new Date(result.resultedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}