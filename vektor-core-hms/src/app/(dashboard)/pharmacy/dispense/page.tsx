import { AlertTriangle, Pill, ScanSearch } from "lucide-react";
import { listPrescriptions } from "@/lib/hms-data";

export default async function DispensePage() {
  const prescriptions = await listPrescriptions();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Pill className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Pharmacy Workflow</p>
        </div>
        <h1 className="mt-3 text-3xl">Prescription Dispense Queue</h1>
      </section>

      <section className="panel border-warning/30 bg-warning/5 p-4">
        <div className="flex items-center gap-2 text-warning">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-sm font-semibold">1 Potential Drug Interaction Detected</p>
        </div>
        <p className="mt-1 text-sm text-foreground/75">
          Metformin (Arjun Mehta) plus Contrast Dye scheduled for CT. Hold Metformin 48h prior.
          <span className="ml-1 font-semibold text-warning">Action required.</span>
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Scan Prescription</h2>
          <div className="mt-4 space-y-3">
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Prescription QR or ID" />
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Drug search" />
            <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">Load Dispense Form</button>
          </div>
        </article>

        <article className="panel p-5 xl:col-span-2">
          <div className="flex items-center gap-2">
            <ScanSearch className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Active Prescriptions</h2>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-strong text-foreground/75">
                <tr>
                  <th className="px-4 py-3">Prescription</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription) => (
                  <tr key={prescription.id} className="border-t border-line">
                    <td className="px-4 py-3 font-medium">{prescription.prescriptionNo}</td>
                    <td className="px-4 py-3">{prescription.patientName}</td>
                    <td className="px-4 py-3">{prescription.medicationCount}</td>
                    <td className="px-4 py-3">{prescription.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
