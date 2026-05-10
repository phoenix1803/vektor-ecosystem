import { getServerSession } from "next-auth";
import { AlertTriangle, CalendarDays, FileText, HeartPulse, ShieldCheck, Users } from "lucide-react";
import { authOptions } from "@/auth";
import { getPatientByUhid } from "@/lib/hms-data";

type PatientRecordProps = {
  params: Promise<{ id: string }>;
};

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export default async function PatientProfilePage({ params }: PatientRecordProps) {
  const { id } = await params;
  const [record, session] = await Promise.all([getPatientByUhid(id), getServerSession(authOptions)]);
  const role = session?.user?.role;
  const isDoctor = role === "DOCTOR";

  if (!record) {
    return (
      <div className="space-y-5">
        <section className="panel p-6">
          <h1 className="text-3xl">Patient Not Found</h1>
          <p className="mt-2 text-sm text-foreground/70">No patient record is available for this UHID.</p>
        </section>
      </div>
    );
  }

  const patientData = record.patient as Record<string, unknown>;
  const bloodType = typeof patientData.blood_type === "string" ? patientData.blood_type : "Unknown";
  const allergies = asStringArray(patientData.allergies);
  const activeConditions = asStringArray(patientData.conditions);
  const criticalFlags = asStringArray(patientData.critical_flags);

  const latestEncounter = record.encounters[0];
  const latestVitals = (latestEncounter?.vitals?.[0] || {}) as Record<string, unknown>;
  const lastBp = typeof latestVitals.bloodPressure === "string" ? latestVitals.bloodPressure : "Not recorded";
  const lastSugar = typeof latestVitals.bloodSugar === "string" ? latestVitals.bloodSugar : "Not recorded";
  const lastSpo2 = typeof latestVitals.spo2 === "number" ? `${latestVitals.spo2}%` : "Not recorded";

  const currentMedications = (latestEncounter?.prescriptions || [])
    .flatMap((prescription) =>
      (prescription.medications || []).map((medication) => {
        const med = medication as Record<string, unknown>;
        const drug = typeof med.drugName === "string" ? med.drugName : "Medication";
        const dose = typeof med.dose === "string" ? med.dose : "";
        return `${drug}${dose ? ` - ${dose}` : ""}`;
      })
    )
    .slice(0, 10);

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <p className="chip bg-brand-soft text-brand">Patient Clinical Profile</p>
        <h1 className="mt-4 text-3xl">{record.patient.fullName}</h1>
        <p className="mt-2 text-sm text-foreground/70">
          UHID {record.patient.uhid} | {record.patient.hospitalName || "Hospital"}
        </p>
      </section>

      {isDoctor ? (
        <>
          <section className="panel p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-danger" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Critical Flags</h2>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-line bg-white p-3 text-sm">
                <p className="text-foreground/70">Blood Type</p>
                <p className="mt-1 font-semibold">{bloodType}</p>
              </div>
              <div className="rounded-xl border border-line bg-white p-3 text-sm">
                <p className="text-foreground/70">Allergies</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {allergies.length > 0 ? (
                    allergies.map((allergy) => (
                      <span key={allergy} className="chip border-danger/30 bg-danger/10 text-danger">
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <span className="text-foreground/70">None recorded</span>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-line bg-white p-3 text-sm">
                <p className="text-foreground/70">Active Conditions</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(activeConditions.length ? activeConditions : criticalFlags).length > 0 ? (
                    (activeConditions.length ? activeConditions : criticalFlags).map((condition) => (
                      <span key={condition} className="chip border-warning/30 bg-warning/10 text-warning">
                        {condition}
                      </span>
                    ))
                  ) : (
                    <span className="text-foreground/70">None recorded</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="panel p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand" aria-hidden="true" />
                <h2 className="text-lg font-semibold">Current Medications</h2>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {currentMedications.length > 0 ? (
                  currentMedications.map((medication) => (
                    <div key={medication} className="rounded-xl border border-line bg-white px-3 py-2">
                      {medication}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-line bg-white px-3 py-2 text-foreground/70">
                    No active medications listed.
                  </div>
                )}
              </div>
            </article>

            <article className="panel p-5">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-brand" aria-hidden="true" />
                <h2 className="text-lg font-semibold">Last Vitals</h2>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-line bg-white p-3 text-sm">
                  <p className="text-foreground/70">BP</p>
                  <p className="mt-1 font-semibold">{lastBp}</p>
                </div>
                <div className="rounded-xl border border-line bg-white p-3 text-sm">
                  <p className="text-foreground/70">Sugar</p>
                  <p className="mt-1 font-semibold">{lastSugar}</p>
                </div>
                <div className="rounded-xl border border-line bg-white p-3 text-sm">
                  <p className="text-foreground/70">SpO2</p>
                  <p className="mt-1 font-semibold">{lastSpo2}</p>
                </div>
              </div>
            </article>
          </section>
        </>
      ) : null}

      <section className="panel p-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-brand" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Encounter History</h2>
        </div>
        <div className="mt-4 space-y-3">
          {record.encounters.length > 0 ? (
            record.encounters.map((encounter) => (
              <div key={encounter.id} className="rounded-xl border border-line bg-white p-3 text-sm">
                <p className="font-semibold">{encounter.type}</p>
                <p className="mt-1 text-foreground/70">
                  {new Date(encounter.startedAt).toLocaleString()}
                </p>
                <p className="mt-1 text-foreground/70">{encounter.notes || "Clinical note available"}</p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-line bg-white p-3 text-sm text-foreground/70">
              No encounter history available.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="panel p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Consent & Compliance</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {record.consents.map((consent) => (
              <div key={consent.id} className="rounded-xl border border-line bg-white p-3">
                <p className="font-semibold">{consent.consentType}</p>
                <p className="mt-1 text-foreground/70">Signed by {consent.signedBy}</p>
                <p className="mt-1 text-foreground/70">Status: {consent.status}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Family Contacts</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {record.familyMembers.map((member) => (
              <div key={member.id} className="rounded-xl border border-line bg-white p-3 text-sm">
                <p className="font-semibold">{member.fullName}</p>
                <p className="mt-1 text-foreground/70">{member.relation}</p>
                <p className="mt-1 text-foreground/70">Emergency contact: {member.isEmergency ? "Yes" : "No"}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="panel p-5">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Records</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {record.documents.map((document) => (
              <div key={document.id} className="rounded-xl border border-line bg-white p-3">
                <p className="font-semibold">{document.title}</p>
                <p className="mt-1 text-foreground/70">Type: {document.documentType}</p>
                <p className="mt-1 text-foreground/70">OCR: {document.ocrText || "Indexed"}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Billing</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {record.encounters
              .map((encounter) => encounter.billingInvoice)
              .filter((invoice): invoice is NonNullable<typeof invoice> => Boolean(invoice))
              .map((invoice) => (
                <div key={invoice.invoiceNo} className="rounded-xl border border-line bg-white p-3">
                  <p className="font-semibold">{invoice.invoiceNo}</p>
                  <p className="mt-1 text-foreground/70">Status: {invoice.status}</p>
                  <p className="mt-1 text-foreground/70">Amount: Rs {invoice.totalAmount.toLocaleString()}</p>
                </div>
              ))}
          </div>
        </article>
      </section>
    </div>
  );
}
