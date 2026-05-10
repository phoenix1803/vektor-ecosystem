import { KeyRound, ShieldCheck, ShieldEllipsis } from "lucide-react";
import { getSecuritySnapshot } from "@/lib/settings-data";

export default async function SecurityPage() {
  const snapshot = await getSecuritySnapshot();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Security Workflow</p>
        </div>
        <h1 className="mt-3 text-3xl">Security and Session Controls</h1>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-5">
          <KeyRound className="h-4 w-4 text-brand" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold">MFA Enforcement</h2>
          <p className="mt-2 text-sm text-foreground/70">Require OTP or authenticator checks for sensitive roles.</p>
          <p className="mt-1 text-xs text-foreground/60">Status: {snapshot.mfaEnforced ? "Enabled" : "Disabled"}</p>
        </article>
        <article className="panel p-5">
          <ShieldEllipsis className="h-4 w-4 text-brand" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold">IP Allowlisting</h2>
          <p className="mt-2 text-sm text-foreground/70">Restrict admin and billing access to approved networks.</p>
          <p className="mt-1 text-xs text-foreground/60">Status: {snapshot.ipAllowlistingEnabled ? "Enabled" : "Disabled"}</p>
        </article>
        <article className="panel p-5">
          <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold">Session Lifecycle</h2>
          <p className="mt-2 text-sm text-foreground/70">Short-lived JWT sessions with refresh and revocation hooks.</p>
          <p className="mt-1 text-xs text-foreground/60">Session strategy: {snapshot.sessionStrategy}</p>
        </article>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-semibold">Compliance Guardrails</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
          <div className="rounded-xl border border-line bg-white p-3">In transit encryption: {snapshot.encryptionInTransit ? "Enforced" : "Not enforced"}</div>
          <div className="rounded-xl border border-line bg-white p-3">At rest encryption: {snapshot.encryptionAtRest ? "Enforced" : "Not enforced"}</div>
          <div className="rounded-xl border border-line bg-white p-3">DPDP controls: {snapshot.dpdpControlsEnabled ? "Enabled" : "Pending"}</div>
        </div>
      </section>
    </div>
  );
}
