import { FileBadge2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getPatientByUhid, listPrescriptions } from "@/lib/hms-data";

export default async function PortalReportsPage() {
  const session = await getServerSession(authOptions);
  const patientUhid = session?.user.patientUhid || "UHID-12091";
  const [record, prescriptions] = await Promise.all([
    getPatientByUhid(patientUhid),
    listPrescriptions(),
  ]);

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><FileBadge2 className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Reports</p></div>
        <h1 className="mt-3 text-3xl">Prescriptions and Documents</h1>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Document Vault</h2>
          <div className="mt-4 space-y-3 text-sm">
            {record.documents.map((document) => (
              <div key={document.id} className="rounded-xl border border-line bg-white p-3">
                <p className="font-semibold">{document.title}</p>
                <p className="mt-1 text-foreground/70">Type: {document.documentType}</p>
                <p className="mt-1 text-foreground/70">Indexed: {new Date(document.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Prescription Access</h2>
          <div className="mt-4 space-y-3 text-sm">
            {prescriptions
              .filter((entry) => entry.patientName === record.patient.fullName)
              .map((entry) => (
                <div key={entry.id} className="rounded-xl border border-line bg-white p-3">
                  <p className="font-semibold">{entry.prescriptionNo}</p>
                  <p className="mt-1 text-foreground/70">Status: {entry.status}</p>
                  <p className="mt-1 text-foreground/70">Medications: {entry.medicationCount}</p>
                </div>
              ))}
          </div>
        </article>
      </section>
    </div>
  );
}