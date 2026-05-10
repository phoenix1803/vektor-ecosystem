import Link from "next/link";
import { Activity, CalendarDays, ShieldAlert, Tablet } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { PatientEmergencySummary } from "@/components/portal/patient-emergency-summary";
import { getPatientByUhid, listHealthGoals, listPortalMessages } from "@/lib/hms-data";

type PatientSummary = {
  fullName: string;
  uhid: string;
  hospitalName?: string;
  hospital?: { name: string };
};

type PortalRecord = {
  patient: PatientSummary;
  encounters?: Array<{
    vitals?: Array<{
      bloodPressure?: string | null;
      spo2?: number | null;
    }>;
  }>;
};

type PortalItem = {
  id: string;
  senderName?: string;
  senderRole?: string;
  body?: string;
  title?: string;
  target?: string;
  progress?: number;
};

export default async function PortalHomePage() {
  const session = await getServerSession(authOptions);
  const patientUhid = session?.user.patientUhid || "UHID-12091";
  const patientRecord = (await getPatientByUhid(patientUhid)) as PortalRecord;
  const messages = (await listPortalMessages(patientUhid)) as PortalItem[];
  const goals = (await listHealthGoals(patientUhid)) as PortalItem[];
  const patient = patientRecord.patient;
  const hospitalName = patient.hospital?.name || patient.hospitalName || "Apollo North Campus";
  const latestVitals = patientRecord.encounters?.[0]?.vitals?.[0] ?? null;

  return (
    <div className="space-y-5">
      <PatientEmergencySummary />

      <section className="panel p-6">
        <p className="chip bg-brand-soft text-brand">Patient Portal</p>
        <h1 className="mt-4 text-3xl">Welcome back, {patient.fullName}</h1>
        <p className="mt-2 text-sm text-foreground/70">UHID {patient.uhid} · {hospitalName}</p>
      </section>

      <section className="panel border-brand/30 bg-brand-soft/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">Next Appointment</p>
        <h2 className="mt-2 text-xl font-semibold">Dr. Sana Iyer - Cardiology OPD</h2>
        <p className="mt-1 text-sm text-foreground/70">Tomorrow, 10:30 AM | Apollo North Campus, Room 214</p>
        <div className="mt-3 flex gap-2">
          <button className="rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white">View Details</button>
          <button className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold text-foreground/80">Reschedule</button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/portal/emergency" className="panel border-danger/30 bg-white p-5 hover:border-danger/50">
          <ShieldAlert className="h-4 w-4 text-danger" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold">Emergency SOS</p>
          <p className="mt-1 text-xs text-foreground/70">One tap to trigger emergency response</p>
        </Link>
        <Link href="/portal/timeline" className="panel p-5 hover:border-brand/40">
          <Activity className="h-4 w-4 text-brand" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold">My Health Timeline</p>
          <p className="mt-1 text-xs text-foreground/70">Visits, labs, and care milestones</p>
        </Link>
        <Link href="/portal/appointments" className="panel p-5 hover:border-brand/40">
          <CalendarDays className="h-4 w-4 text-brand" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold">Appointments</p>
          <p className="mt-1 text-xs text-foreground/70">Upcoming and past bookings</p>
        </Link>
        <Link href="/portal/medications" className="panel p-5 hover:border-brand/40">
          <Tablet className="h-4 w-4 text-brand" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold">My Medications</p>
          <p className="mt-1 text-xs text-foreground/70">Prescriptions and reminders</p>
        </Link>
      </section>

      {latestVitals ? (
        <section className="panel p-5">
          <h2 className="text-lg font-semibold">Health Snapshot</h2>
          <p className="mt-1 text-sm text-foreground/70">Last known vitals from your recent encounter.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-line bg-white p-3 text-sm">
              <p className="text-xs text-foreground/60">Last BP</p>
              <p className="mt-1 font-semibold">{latestVitals.bloodPressure || "Not recorded"}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-3 text-sm">
              <p className="text-xs text-foreground/60">Last Sugar</p>
              <p className="mt-1 font-semibold">Not available</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-3 text-sm">
              <p className="text-xs text-foreground/60">Last SpO2</p>
              <p className="mt-1 font-semibold">{typeof latestVitals.spo2 === "number" ? `${latestVitals.spo2}%` : "Not recorded"}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Today's Medications</h2>
          <div className="mt-3 space-y-2">
            {[
              { drug: "Metformin 500mg", time: "8:00 AM", status: "taken" },
              { drug: "Amlodipine 5mg", time: "8:00 AM", status: "taken" },
              { drug: "Metformin 500mg", time: "8:00 PM", status: "due" },
            ].map((med, index) => (
              <div key={`${med.drug}-${index}`} className="flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2 text-sm">
                <span className="font-medium">{med.drug}</span>
                <span className="text-foreground/60">{med.time}</span>
                <span className={`chip ${med.status === "taken" ? "border-success/30 bg-success/10 text-success" : "border-warning/30 bg-warning/10 text-warning"}`}>
                  {med.status === "taken" ? "Taken" : "Due"}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Active health goals</h2>
            <Link href="/portal/goals" className="text-xs font-semibold text-brand hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="rounded-xl border border-line bg-white p-3 text-sm">
                <p className="font-semibold">{goal.title || "Goal"}</p>
                <p className="mt-1 text-foreground/70">Target: {goal.target || "On track"}</p>
                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded-full border border-line bg-background">
                    <div
                      className="h-full bg-brand"
                      style={{ width: `${Math.min(100, Math.max(0, goal.progress || 0))}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-foreground/60">{goal.progress || 0}% complete</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Recent care messages</h2>
            <Link href="/portal/messages" className="text-xs font-semibold text-brand hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {messages.slice(0, 3).map((message) => (
              <div key={message.id} className="rounded-xl border border-line bg-white p-3 text-sm">
                <p className="font-semibold">{message.senderRole || "Care Team"} · {message.senderName || "Hospital"}</p>
                <p className="mt-1 text-foreground/70">{message.body || message.title || "No message"}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
