import { Microscope } from "lucide-react";
import { listSampleTracking } from "@/lib/hms-data";

export default async function Page() {
  const samples = await listSampleTracking();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Microscope className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Lab & Diagnostics</p>
        </div>
        <h1 className="mt-3 text-3xl">Sample Tracking</h1>
        <p className="mt-2 text-sm text-foreground/70">Track sample collection, transit, and turnaround lifecycle.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {samples.map((sample) => (
          <article key={sample.id} className="panel p-5 text-sm">
            <p className="font-semibold">{sample.sampleId}</p>
            <p className="mt-1 text-foreground/70">Patient: {sample.patientName}</p>
            <p className="mt-1 text-foreground/70">Status: {sample.status}</p>
            <p className="mt-1 text-foreground/70">Collected: {new Date(sample.collectedAt).toLocaleString()}</p>
            <p className="mt-1 text-foreground/70">TAT: {sample.turnaroundMinutes} min</p>
          </article>
        ))}
      </section>
    </div>
  );
}