import { Activity, AlertTriangle, ShoppingBag, Zap } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getPatientByUhid, getPatientVitalsHistory } from "@/lib/hms-data";

interface TimelineRecord {
  patient: {
    id: string;
    fullName: string;
    age?: number;
    bloodGroup?: string | null;
    gender?: string | null;
    hospitalName?: string;
  };
  encounters: Array<{
    id: string;
    startedAt: string | Date;
    type: string;
    vitals?: Array<{
      recordedAt?: string | Date;
      bloodPressure?: string | null;
      heartRate?: number | null;
      spo2?: number | null;
      temperature?: number | null;
      weightKg?: number | null;
    }>;
    admission?: {
      bed?: { ward: string; bedCode: string };
    } | null;
  }>;
}

interface Allergies {
  allergen: string;
  severity?: string;
}

interface Medications {
  medicationName: string;
  dosage?: string;
  frequency?: string;
}

interface MockPatientData {
  allergies: Allergies[];
  medications: Medications[];
}

function calculateDaysAgo(date: string | Date): string {
  if (!date) return "Unknown";
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export default async function PortalTimelinePage() {
  const session = await getServerSession(authOptions);
  const patientUhid = session?.user.patientUhid || "UHID-12091";
  const patientRecord = (await getPatientByUhid(patientUhid)) as TimelineRecord | null;

  if (!patientRecord?.patient) {
    return (
      <div className="space-y-5">
        <section className="panel p-6">
          <p className="text-foreground/60">Patient record not found.</p>
        </section>
      </div>
    );
  }

  const patient = patientRecord.patient;
  const encounters = patientRecord.encounters || [];

  // Mock data for allergies and medications (would come from database in production)
  const mockData: MockPatientData = {
    allergies: [
      { allergen: "Penicillin", severity: "SEVERE" },
      { allergen: "Sulfonamides", severity: "MODERATE" },
    ],
    medications: [
      { medicationName: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { medicationName: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { medicationName: "Atorvastatin", dosage: "20mg", frequency: "Once daily" },
    ],
  };

  // Get latest vitals from most recent encounter
  const latestVitals = encounters[0]?.vitals?.[0];

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Activity className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Health Timeline</p>
        </div>
        <h1 className="mt-3 text-3xl">Lifetime Medical Record</h1>
        <p className="mt-2 text-sm text-foreground/70">Complete health history for {patient.fullName}</p>
      </section>

      {/* Identity Card - Large & Prominent */}
      <section className="panel p-6">
        <div className="grid gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/60">Patient Identity</p>
            <p className="mt-3 text-4xl font-semibold text-brand">{patient.fullName}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="text-foreground/70">
                <span className="font-semibold">Age:</span> {patient.age || "Unknown"}
              </span>
              <span className="text-foreground/70">
                <span className="font-semibold">Gender:</span> {patient.gender || "Not specified"}
              </span>
              <span className="text-foreground/70">
                <span className="font-semibold">Blood Type:</span> {patient.bloodGroup || "Not recorded"}
              </span>
            </div>
          </div>

          {/* Allergies - Red Badges */}
          {mockData.allergies.length > 0 && (
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-danger">
                <AlertTriangle className="h-4 w-4" />
                Critical Allergies
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mockData.allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-full border border-danger/30 bg-danger/10 px-3 py-1.5 text-sm font-semibold text-danger"
                  >
                    {allergy.allergen}
                    <span className="text-xs text-danger/70">({allergy.severity})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Medications */}
      {mockData.medications.length > 0 && (
        <section className="panel p-6">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ShoppingBag className="h-4 w-4 text-brand" />
            Current Medications
          </p>
          <div className="mt-4 space-y-3">
            {mockData.medications.map((med, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border border-line bg-white p-4">
                <div>
                  <p className="font-semibold text-foreground">{med.medicationName}</p>
                  <p className="mt-1 text-sm text-foreground/70">
                    {med.dosage} • {med.frequency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Vitals History */}
      {latestVitals && (
        <section className="panel p-6">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Zap className="h-4 w-4 text-brand" />
            Latest Vitals
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {latestVitals.bloodPressure && (
              <article className="rounded-xl border border-line bg-white p-4">
                <p className="text-xs text-foreground/60">Blood Pressure</p>
                <p className="mt-2 text-xl font-bold text-brand">{latestVitals.bloodPressure}</p>
                <p className="mt-2 text-xs text-foreground/60">
                  {latestVitals.recordedAt ? `Recorded ${calculateDaysAgo(latestVitals.recordedAt)}` : "Date unknown"}
                </p>
              </article>
            )}
            {latestVitals.heartRate !== null && latestVitals.heartRate !== undefined && (
              <article className="rounded-xl border border-line bg-white p-4">
                <p className="text-xs text-foreground/60">Heart Rate</p>
                <p className="mt-2 text-xl font-bold text-brand">{latestVitals.heartRate} bpm</p>
                <p className="mt-2 text-xs text-foreground/60">
                  {latestVitals.recordedAt ? `Recorded ${calculateDaysAgo(latestVitals.recordedAt)}` : "Date unknown"}
                </p>
              </article>
            )}
            {latestVitals.spo2 !== null && latestVitals.spo2 !== undefined && (
              <article className="rounded-xl border border-line bg-white p-4">
                <p className="text-xs text-foreground/60">SpO₂</p>
                <p className="mt-2 text-xl font-bold text-brand">{latestVitals.spo2}%</p>
                <p className="mt-2 text-xs text-foreground/60">
                  {latestVitals.recordedAt ? `Recorded ${calculateDaysAgo(latestVitals.recordedAt)}` : "Date unknown"}
                </p>
              </article>
            )}
            {latestVitals.temperature && (
              <article className="rounded-xl border border-line bg-white p-4">
                <p className="text-xs text-foreground/60">Temperature</p>
                <p className="mt-2 text-xl font-bold text-brand">{latestVitals.temperature}°C</p>
                <p className="mt-2 text-xs text-foreground/60">
                  {latestVitals.recordedAt ? `Recorded ${calculateDaysAgo(latestVitals.recordedAt)}` : "Date unknown"}
                </p>
              </article>
            )}
            {latestVitals.weightKg && (
              <article className="rounded-xl border border-line bg-white p-4">
                <p className="text-xs text-foreground/60">Weight</p>
                <p className="mt-2 text-xl font-bold text-brand">{latestVitals.weightKg} kg</p>
                <p className="mt-2 text-xs text-foreground/60">
                  {latestVitals.recordedAt ? `Recorded ${calculateDaysAgo(latestVitals.recordedAt)}` : "Date unknown"}
                </p>
              </article>
            )}
          </div>
        </section>
      )}

      {/* Encounter Timeline */}
      {encounters.length > 0 && (
        <section className="panel p-6">
          <p className="text-sm font-semibold">Encounter Timeline</p>
          <div className="mt-4 space-y-3">
            {encounters.map((encounter) => (
              <div key={encounter.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-brand"></div>
                  {encounters.indexOf(encounter) < encounters.length - 1 && <div className="h-8 w-0.5 bg-line"></div>}
                </div>
                <div className="flex-1 rounded-xl border border-line bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {encounter.type === "OPD" ? "Outpatient Visit" : encounter.type === "IPD" ? "Hospital Admission" : "Emergency Visit"}
                      </p>
                      <p className="mt-1 text-sm text-foreground/70">
                        {new Date(encounter.startedAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    {encounter.admission?.bed && (
                      <span className="rounded-lg bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                        {encounter.admission.bed.ward} • Bed {encounter.admission.bed.bedCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {encounters.length === 0 && (
        <section className="panel p-6">
          <p className="text-center text-sm text-foreground/60">No encounter history available.</p>
        </section>
      )}
    </div>
  );
}
