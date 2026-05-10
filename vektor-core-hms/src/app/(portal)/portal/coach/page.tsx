import { Sparkles } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getPatientByUhid, listHealthGoals, listPortalMessages } from "@/lib/hms-data";

export default async function PortalCoachPage() {
  const session = await getServerSession(authOptions);
  const patientUhid = session?.user.patientUhid || "UHID-12091";
  const [record, goals, messages] = await Promise.all([
    getPatientByUhid(patientUhid),
    listHealthGoals(patientUhid),
    listPortalMessages(patientUhid),
  ]);

  const latestMessage = messages[0];

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><Sparkles className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">AI Coach</p></div>
        <h1 className="mt-3 text-3xl">Personal Health Coach</h1>
        <p className="mt-2 text-sm text-foreground/70">Adaptive recommendations for {record.patient.fullName} based on goals and recent updates.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Today&apos;s Action Plan</h2>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            {goals.map((goal) => (
              <li key={goal.id} className="rounded-xl border border-line bg-white px-3 py-2">
                {goal.title}: target {goal.target}, progress {goal.progress}%
              </li>
            ))}
          </ul>
        </article>

        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Care Team Prompt</h2>
          <div className="mt-4 rounded-xl border border-line bg-white p-4 text-sm">
            <p className="font-semibold">{latestMessage?.senderRole || "Care Team"}</p>
            <p className="mt-2 text-foreground/70">{latestMessage?.body || "Keep medication adherence high and record vitals twice today."}</p>
          </div>
          <div className="mt-4 rounded-xl border border-brand/30 bg-brand-soft p-4 text-sm text-brand">
            Symptom triage and medication tracker are available in the portal navigation for patient self-service guidance.
          </div>
        </article>
      </section>
    </div>
  );
}