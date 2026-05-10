import { CalendarPlus2 } from "lucide-react";

export default function NewAppointmentPage() {
  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <CalendarPlus2 className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Scheduling</p>
        </div>
        <h1 className="mt-3 text-3xl">Create Appointment</h1>
      </section>

      <form className="panel grid gap-4 p-5 md:grid-cols-2">
        <input className="rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Patient search" />
        <input className="rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Doctor" />
        <input className="rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Date" />
        <input className="rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Time" />
        <select className="rounded-xl border border-line bg-white px-3 py-2 text-sm">
          <option>OPD</option>
          <option>Tele</option>
          <option>Walk-in</option>
        </select>
        <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white md:col-span-2">Book Appointment</button>
      </form>
    </div>
  );
}
