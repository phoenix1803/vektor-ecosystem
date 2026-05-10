import { CalendarRange, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { listAppointments } from "@/lib/hms-data";

export default async function AppointmentsPage() {
  const [appointments, session] = await Promise.all([listAppointments(), getServerSession(authOptions)]);
  const role = session?.user?.role;
  const doctorId = session?.user?.id;
  const isDoctor = role === "DOCTOR";

  const visibleAppointments = isDoctor
    ? appointments.filter((appointment) => appointment.doctorUserId === doctorId)
    : appointments;

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <h1 className="text-3xl">Appointments & Scheduling</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Calendar operations, queue board, smart slots, and reminder status tracking.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-5">
          <div className="flex items-center gap-2 text-brand">
            <CalendarRange className="h-4 w-4" aria-hidden="true" />
            Calendar
          </div>
          <p className="mt-2 text-sm text-foreground/75">Day, week, and month scheduling view.</p>
        </article>
        <article className="panel p-5">
          <div className="flex items-center gap-2 text-brand">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            Queue
          </div>
          <p className="mt-2 text-sm text-foreground/75">Live walk-in token board with rescheduling.</p>
        </article>
        <article className="panel p-5">
          <div className="flex items-center gap-2 text-brand">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            AI Suggestions
          </div>
          <p className="mt-2 text-sm text-foreground/75">Smart slot recommendation and no-show flagging.</p>
        </article>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleAppointments.map((appointment) => (
              <tr key={appointment.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={appointment.patientUhid ? `/patients/${appointment.patientUhid}` : `/appointments/${appointment.id}`}
                    className="text-brand underline-offset-2 hover:underline"
                  >
                    {appointment.patientName}
                  </Link>
                </td>
                <td className="px-4 py-3">{isDoctor ? "You" : appointment.doctorName}</td>
                <td className="px-4 py-3">{new Date(appointment.startsAt).toLocaleString()}</td>
                <td className="px-4 py-3">{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
