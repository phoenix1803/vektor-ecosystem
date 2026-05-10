import { UserPlus } from "lucide-react";

export default function NewPatientPage() {
  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Registration</p>
        </div>
        <h1 className="mt-3 text-3xl">Register New Patient</h1>
      </section>

      <form className="panel grid gap-4 p-5 md:grid-cols-2">
        <input placeholder="Full name" className="rounded-xl border border-line bg-white px-3 py-2 text-sm" />
        <input placeholder="Date of birth" className="rounded-xl border border-line bg-white px-3 py-2 text-sm" />
        <input placeholder="Gender" className="rounded-xl border border-line bg-white px-3 py-2 text-sm" />
        <input placeholder="Blood group" className="rounded-xl border border-line bg-white px-3 py-2 text-sm" />
        <input placeholder="Aadhaar" className="rounded-xl border border-line bg-white px-3 py-2 text-sm" />
        <input placeholder="Primary phone" className="rounded-xl border border-line bg-white px-3 py-2 text-sm" />
        <input placeholder="Insurance provider" className="rounded-xl border border-line bg-white px-3 py-2 text-sm" />
        <input placeholder="Emergency contact" className="rounded-xl border border-line bg-white px-3 py-2 text-sm" />
        <button type="button" className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white md:col-span-2">
          Save and Generate UHID
        </button>
      </form>
    </div>
  );
}
