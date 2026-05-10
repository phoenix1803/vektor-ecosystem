import { Pill } from "lucide-react";
import { listMedicationAdministrationRecords } from "@/lib/hms-data";

export default async function Page() {
  const records = await listMedicationAdministrationRecords();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Pill className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Inpatient and Ward</p>
        </div>
        <h1 className="mt-3 text-3xl">Medication Administration Record</h1>
        <p className="mt-2 text-sm text-foreground/70">Monitor administered and missed dose events per patient.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Medication</th>
              <th className="px-4 py-3">Dose</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Scheduled</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{record.patientName}</td>
                <td className="px-4 py-3">{record.medication}</td>
                <td className="px-4 py-3">{record.dose}</td>
                <td className="px-4 py-3">{record.status}</td>
                <td className="px-4 py-3">{new Date(record.scheduledAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}