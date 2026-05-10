import { HeartPulse } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getPatientByUhid } from "@/lib/hms-data";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type GoalItem = {
  id: string;
  title: string;
  target: string;
  progress: number;
};

export default async function PortalVitalsPage() {
  const session = await getServerSession(authOptions);
  const patientRecord = (await getPatientByUhid(session?.user.patientUhid || "UHID-12091")) as { healthGoals: GoalItem[] };
  const bpData = [
    { day: "Apr 11", systolic: 145, diastolic: 92 },
    { day: "Apr 12", systolic: 138, diastolic: 88 },
    { day: "Apr 13", systolic: 142, diastolic: 90 },
    { day: "Apr 14", systolic: 135, diastolic: 86 },
    { day: "Apr 15", systolic: 132, diastolic: 84 },
    { day: "Apr 16", systolic: 128, diastolic: 82 },
    { day: "Apr 17", systolic: 130, diastolic: 82 },
  ];

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><HeartPulse className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Vitals</p></div>
        <h1 className="mt-3 text-3xl">Tracked Health Readings</h1>
      </section>

      <section className="panel p-5">
        <p className="text-sm text-foreground/70">Blood pressure, sugar, and weight charts can connect to the stored FHIR observation JSON in the database.</p>
        <div className="mt-4 h-64 rounded-xl border border-line bg-white p-4">
          <p className="mb-3 text-sm font-semibold">Blood Pressure Trend (7 days)</p>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={bpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="systolic" stroke="var(--danger)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="diastolic" stroke="var(--brand)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {patientRecord.healthGoals.map((goal) => (
            <div key={goal.id} className="rounded-xl border border-line bg-white p-3 text-sm">
              <p className="font-semibold">{goal.title}</p>
              <p className="mt-1 text-foreground/70">Target {goal.target}</p>
              <p className="mt-1 text-foreground/70">Progress {goal.progress}%</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
