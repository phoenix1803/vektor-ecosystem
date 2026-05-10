import { NotebookText } from "lucide-react";
import { listFormulary } from "@/lib/hms-data";

export default async function Page() {
  const formulary = await listFormulary();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <NotebookText className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Pharmacy Governance</p>
        </div>
        <h1 className="mt-3 text-3xl">Formulary Management</h1>
        <p className="mt-2 text-sm text-foreground/70">Maintain approved drugs, substitution rules, and restricted medications.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Drug</th>
              <th className="px-4 py-3">Generic</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Substitution</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {formulary.map((item) => (
              <tr key={item.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{item.drugName}</td>
                <td className="px-4 py-3">{item.genericName}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.substitutionPolicy}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}