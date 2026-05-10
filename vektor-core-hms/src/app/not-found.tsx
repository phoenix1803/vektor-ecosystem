import Link from "next/link";
import { AlertCircle, Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="soft-grid flex min-h-screen items-center justify-center px-6 py-10">
      <div className="panel w-full max-w-2xl p-8 md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-danger/30 bg-danger/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-danger">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          404 · Route Not Found
        </div>

        <h1 className="mt-5 text-4xl leading-tight md:text-5xl">This care route does not exist.</h1>
        <p className="mt-4 text-sm text-foreground/75 md:text-base">
          The page may have moved, the URL might be incorrect, or access flow may have changed.
          Use one of the safe paths below to continue.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Go To Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-foreground hover:bg-surface-strong"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Open Home
          </Link>
        </div>
      </div>
    </div>
  );
}
