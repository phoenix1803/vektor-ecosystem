import { Tablet } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getPatientByUhid, listPrescriptions } from "@/lib/hms-data";

export default async function PortalMedicationsPage() {
  const session = await getServerSession(authOptions);
  const patientUhid = session?.user.patientUhid || "UHID-12091";
  const [record, prescriptions] = await Promise.all([
    getPatientByUhid(patientUhid),
    listPrescriptions(),
  ]);

  const patientPrescriptions = prescriptions.filter((entry) => entry.patientName === record.patient.fullName);

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><Tablet className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Medication Tracker</p></div>
        <h1 className="mt-3 text-3xl">Medication Adherence</h1>
        <p className="mt-2 text-sm text-foreground/70">Track active prescriptions and follow completion status.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Prescription</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Scheduled reminders</th>
            </tr>
          </thead>
          <tbody>
            {patientPrescriptions.map((entry) => (
              <tr key={entry.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{entry.prescriptionNo}</td>
                <td className="px-4 py-3">{entry.status}</td>
                <td className="px-4 py-3">{entry.medicationCount}</td>
                <td className="px-4 py-3">2 active reminders</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
