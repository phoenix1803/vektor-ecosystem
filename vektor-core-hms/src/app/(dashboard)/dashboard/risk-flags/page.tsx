import { BrainCircuit } from "lucide-react";
import { listRiskFlags } from "@/lib/hms-data";
import { requirePagePermission } from "@/lib/page-auth";

export default async function RiskFlagsPage() {
  await requirePagePermission("emr", "view", {
    disallowedRoles: ["PATIENT", "EMERGENCY_API"],
  });

  const rows = await listRiskFlags();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <BrainCircuit className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Phase 3</p>
        </div>
        <h1 className="mt-3 text-3xl">Explainable AI Risk Flags</h1>
        <p className="mt-2 text-sm text-foreground/70">Transparent risk factors, confidence levels, and action recommendations for clinicians.</p>
      </section>

      <section className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{row.patientName} - {row.riskType}</h2>
              <p className="text-sm font-semibold">{row.severity} ({Math.round(row.confidence * 100)}%)</p>
            </div>
            <p className="mt-2 text-sm text-foreground/75">Recommendation: {row.recommendation}</p>
            <p className="mt-2 text-xs text-foreground/60">Factors: {row.factors.join(", ")}</p>
            <p className="mt-2 text-xs text-foreground/60">Status: {row.status}{row.reviewedBy ? ` | Reviewed by ${row.reviewedBy}` : ""}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
