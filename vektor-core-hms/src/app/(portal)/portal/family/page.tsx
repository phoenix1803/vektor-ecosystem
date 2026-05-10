import { Users } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getPatientByUhid } from "@/lib/hms-data";

type FamilyMemberItem = {
  id: string;
  fullName: string;
  relation: string;
  isEmergency: boolean;
};

export default async function PortalFamilyPage() {
  const session = await getServerSession(authOptions);
  const patientRecord = (await getPatientByUhid(session?.user.patientUhid || "UHID-12091")) as { familyMembers: FamilyMemberItem[] };

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><Users className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Family</p></div>
        <h1 className="mt-3 text-3xl">Family health tree</h1>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {patientRecord.familyMembers.map((member) => (
          <article key={member.id} className="panel p-5 text-sm">
            <p className="font-semibold">{member.fullName}</p>
            <p className="mt-1 text-foreground/70">Relation: {member.relation}</p>
            <p className="mt-1 text-foreground/70">Emergency contact: {member.isEmergency ? "Yes" : "No"}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
