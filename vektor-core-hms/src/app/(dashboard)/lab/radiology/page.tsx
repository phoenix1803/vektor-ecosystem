import { ScanSearch } from "lucide-react";
import { listRadiologyCases } from "@/lib/hms-data";

export default async function Page() {
  const cases = await listRadiologyCases();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ScanSearch className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Lab & Diagnostics</p>
        </div>
        <h1 className="mt-3 text-3xl">Radiology and PACS</h1>
        <p className="mt-2 text-sm text-foreground/70">Review radiology workflow status and AI-assisted flags.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cases.map((study) => (
          <article key={study.id} className="panel p-5 text-sm">
            <p className="font-semibold">{study.study}</p>
            <p className="mt-1 text-foreground/70">Patient: {study.patientName}</p>
            <p className="mt-1 text-foreground/70">AI flag: {study.aiFlag}</p>
            <p className="mt-1 text-foreground/70">Status: {study.status}</p>
          </article>
        ))}
      </section>
    </div>
  );
}