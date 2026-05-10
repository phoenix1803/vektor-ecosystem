import { Target } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { listHealthGoals } from "@/lib/hms-data";

export default async function PortalGoalsPage() {
  const session = await getServerSession(authOptions);
  const goals = await listHealthGoals(session?.user.patientUhid || "UHID-12091");

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><Target className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Goals</p></div>
        <h1 className="mt-3 text-3xl">Health goal tracking</h1>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {goals.map((goal: (typeof goals)[number]) => (
          <article key={goal.id} className="panel p-5 text-sm">
            <p className="font-semibold">{goal.title}</p>
            <p className="mt-1 text-foreground/70">Target: {goal.target}</p>
            <p className="mt-1 text-foreground/70">Progress: {goal.progress}%</p>
          </article>
        ))}
      </section>
    </div>
  );
}
