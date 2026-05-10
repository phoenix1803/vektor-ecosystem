import { BadgeCheck, Users } from "lucide-react";
import { listStaff } from "@/lib/hms-data";

export default async function StaffPage() {
  const staff = await listStaff();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Users className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">HR</p>
        </div>
        <h1 className="mt-3 text-3xl">Staff Directory</h1>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Department</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{member.fullName}</td>
                <td className="px-4 py-3">{member.role}</td>
                <td className="px-4 py-3">{member.department ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel p-5">
        <div className="flex items-center gap-2 text-brand">
          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
          <p className="text-sm font-semibold">Credential renewals and training compliance can be connected here.</p>
        </div>
      </section>
    </div>
  );
}
