import { QrCode } from "lucide-react";
import { listElectronicPrescriptions } from "@/lib/hms-data";

export default async function Page() {
  const prescriptions = await listElectronicPrescriptions();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <QrCode className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Pharmacy Queue</p>
        </div>
        <h1 className="mt-3 text-3xl">e-Prescriptions</h1>
        <p className="mt-2 text-sm text-foreground/70">Review digital prescriptions awaiting pharmacist verification and dispensing.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Prescription</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Prescribed At</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription) => (
              <tr key={prescription.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{prescription.prescriptionNo}</td>
                <td className="px-4 py-3">{prescription.patientName}</td>
                <td className="px-4 py-3">{prescription.medicationCount}</td>
                <td className="px-4 py-3">{prescription.status}</td>
                <td className="px-4 py-3">{new Date(prescription.prescribedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}