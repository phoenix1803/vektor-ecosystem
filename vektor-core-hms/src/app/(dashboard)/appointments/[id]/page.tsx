import { notFound } from "next/navigation";
import { CalendarCheck2 } from "lucide-react";
import { getAppointmentById } from "@/lib/hms-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AppointmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <CalendarCheck2 className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Appointment Detail</p>
        </div>
        <h1 className="mt-3 text-3xl">Appointment {appointment.id}</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Review status, schedule, and visit metadata for this appointment.
        </p>
      </section>

      <section className="panel p-6">
        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-foreground/60">Patient</dt>
            <dd className="mt-1 text-sm font-medium">{appointment.patientName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-foreground/60">Doctor</dt>
            <dd className="mt-1 text-sm font-medium">{appointment.doctorName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-foreground/60">Start Time</dt>
            <dd className="mt-1 text-sm font-medium">{new Date(appointment.startsAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-foreground/60">Status</dt>
            <dd className="mt-1 text-sm font-medium">{appointment.status}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-foreground/60">Type</dt>
            <dd className="mt-1 text-sm font-medium">{appointment.type}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-foreground/60">Location</dt>
            <dd className="mt-1 text-sm font-medium">{appointment.location}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
