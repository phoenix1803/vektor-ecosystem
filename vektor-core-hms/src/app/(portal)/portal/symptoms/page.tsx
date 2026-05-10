import { Stethoscope } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { listPortalMessages } from "@/lib/hms-data";

export default async function PortalSymptomsPage() {
  const session = await getServerSession(authOptions);
  const messages = await listPortalMessages(session?.user.patientUhid || "UHID-12091");

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><Stethoscope className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Symptom Checker</p></div>
        <h1 className="mt-3 text-3xl">Symptom Triage Assistant</h1>
        <p className="mt-2 text-sm text-foreground/70">Capture symptoms and review escalation advice before booking urgent care.</p>
      </section>

      <section className="panel p-5 text-sm">
        <h2 className="text-lg font-semibold">Quick Triage Inputs</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-line bg-white px-3 py-2" placeholder="Primary symptom" />
          <input className="rounded-xl border border-line bg-white px-3 py-2" placeholder="Duration" />
          <input className="rounded-xl border border-line bg-white px-3 py-2" placeholder="Temperature" />
          <input className="rounded-xl border border-line bg-white px-3 py-2" placeholder="Other notes" />
        </div>
        <button className="mt-4 rounded-xl bg-brand px-4 py-2.5 font-semibold text-white">Run triage</button>
      </section>

      <section className="panel p-5 text-sm">
        <h2 className="text-lg font-semibold">Care Team Suggestions</h2>
        <ul className="mt-3 space-y-2">
          {messages.map((message) => (
            <li key={message.id} className="rounded-xl border border-line bg-white px-3 py-2">
              {message.senderRole} · {message.body}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
