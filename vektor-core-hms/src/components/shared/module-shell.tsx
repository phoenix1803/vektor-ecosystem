import { Activity, Clock3, Route } from "lucide-react";

type ModuleShellProps = {
  title: string;
  description: string;
  routeKey: string;
};

export function ModuleShell({ title, description, routeKey }: ModuleShellProps) {
  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <p className="chip bg-brand-soft text-brand">Vektor Core Module</p>
        <h1 className="mt-4 text-3xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-foreground/75">{description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-foreground/70">
          <span className="inline-flex items-center gap-1">
            <Route className="h-3.5 w-3.5" aria-hidden="true" />
            Route: /{routeKey}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            Status: Scoped and wired
          </span>
          <span className="inline-flex items-center gap-1">
            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            Data contract ready
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {["Operational Queue", "Validation Rules", "Audit Timeline"].map((card) => (
          <article key={card} className="panel p-5">
            <h2 className="text-lg font-semibold">{card}</h2>
            <p className="mt-2 text-sm text-foreground/70">
              This panel is configured to be connected with API v1 and Prisma-backed data flows.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
