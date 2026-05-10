import { Building2 } from "lucide-react";
import { getHospitalProfile } from "@/lib/hms-data";

export default async function Page() {
  const profile = await getHospitalProfile();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Building2 className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Settings</p>
        </div>
        <h1 className="mt-3 text-3xl">Hospital Profile</h1>
      </section>

      <section className="panel p-6">
        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-foreground/60">Hospital Name</dt>
            <dd className="mt-1 text-sm font-medium">{profile.hospitalName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-foreground/60">License No</dt>
            <dd className="mt-1 text-sm font-medium">{profile.licenseNo}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-foreground/60">GSTIN</dt>
            <dd className="mt-1 text-sm font-medium">{profile.gstin}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-foreground/60">NABL Status</dt>
            <dd className="mt-1 text-sm font-medium">{profile.nablStatus}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-foreground/60">NABH Status</dt>
            <dd className="mt-1 text-sm font-medium">{profile.nabhStatus}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-foreground/60">Registered Address</dt>
            <dd className="mt-1 text-sm font-medium">{profile.registeredAddress}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}