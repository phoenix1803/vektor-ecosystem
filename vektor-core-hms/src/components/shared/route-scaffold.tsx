import { CheckCircle2, Link2, ListChecks } from "lucide-react";

type RouteScaffoldProps = {
  domain: string;
  title: string;
  description: string;
  routePath: string;
  apiPath?: string;
};

export function RouteScaffold({ domain, title, description, routePath, apiPath }: RouteScaffoldProps) {
  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <p className="chip bg-brand-soft text-brand">{domain}</p>
        <h1 className="mt-4 text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-foreground/70">{description}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="panel p-5 text-sm">
          <div className="flex items-center gap-2 text-brand">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <p className="font-semibold">Dedicated Route Active</p>
          </div>
          <p className="mt-2 text-foreground/70">This page is now a direct route and no longer depends on catch-all module fallback.</p>
        </article>
        <article className="panel p-5 text-sm">
          <div className="flex items-center gap-2 text-brand">
            <Link2 className="h-4 w-4" aria-hidden="true" />
            <p className="font-semibold">Route Key</p>
          </div>
          <p className="mt-2 text-foreground/70">{routePath}</p>
          {apiPath ? <p className="mt-1 text-foreground/70">API: {apiPath}</p> : null}
        </article>
        <article className="panel p-5 text-sm">
          <div className="flex items-center gap-2 text-brand">
            <ListChecks className="h-4 w-4" aria-hidden="true" />
            <p className="font-semibold">Workflow Status</p>
          </div>
          <p className="mt-2 text-foreground/70">UI route is implemented and ready for deeper module-specific controls.</p>
        </article>
      </section>
    </div>
  );
}