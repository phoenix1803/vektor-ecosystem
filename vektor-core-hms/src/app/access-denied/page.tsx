import Link from "next/link";
import { Lock, ShieldAlert } from "lucide-react";

type AccessDeniedPageProps = {
  searchParams: Promise<{ reason?: string; blocked?: string }>;
};

function getReasonMessage(reason?: string) {
  switch (reason) {
    case "mfa-required":
      return "Multi-factor verification is required for this sensitive workflow.";
    case "route-blocked":
      return "Your role is not permitted to open that route.";
    case "insufficient-permission":
      return "Your account does not have the required permission for this action.";
    default:
      return "Access to this resource is restricted by security policy.";
  }
}

export default async function AccessDeniedPage({ searchParams }: AccessDeniedPageProps) {
  const params = await searchParams;
  const reasonMessage = getReasonMessage(params.reason);

  return (
    <div className="soft-grid flex min-h-screen items-center justify-center px-6 py-10">
      <div className="panel w-full max-w-2xl p-8 md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-warning">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
          Access Denied
        </div>

        <h1 className="mt-5 text-4xl leading-tight md:text-5xl">You are not authorized for this page.</h1>
        <p className="mt-4 text-sm text-foreground/75 md:text-base">{reasonMessage}</p>
        {params.blocked ? <p className="mt-2 text-xs text-foreground/60">Blocked route: {params.blocked}</p> : null}

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
          >
            <Lock className="h-4 w-4" aria-hidden="true" />
            Return To Dashboard
          </Link>
          <Link
            href="/settings/security"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-foreground hover:bg-surface-strong"
          >
            Open Security Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
