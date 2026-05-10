import { Package } from "lucide-react";
import { listBillingPackages } from "@/lib/hms-data";

export default async function Page() {
  const packages = await listBillingPackages();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Package className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Billing & Finance</p>
        </div>
        <h1 className="mt-3 text-3xl">Billing Packages</h1>
        <p className="mt-2 text-sm text-foreground/70">Define bundled procedure and health-check packages with pricing controls.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => (
          <article key={pkg.id} className="panel p-5 text-sm">
            <p className="font-semibold">{pkg.name}</p>
            <p className="mt-1 text-foreground/70">Category: {pkg.category}</p>
            <p className="mt-1 text-foreground/70">Price: Rs {pkg.price.toLocaleString()}</p>
            <p className="mt-1 text-foreground/70">Status: {pkg.active ? "Active" : "Inactive"}</p>
          </article>
        ))}
      </section>
    </div>
  );
}