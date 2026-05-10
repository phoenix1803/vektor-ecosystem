import { Salad } from "lucide-react";
import { listDietOrders } from "@/lib/hms-data";

export default async function Page() {
  const orders = await listDietOrders();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Salad className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Inpatient and Ward</p>
        </div>
        <h1 className="mt-3 text-3xl">Diet and Nutrition Orders</h1>
        <p className="mt-2 text-sm text-foreground/70">Track diet prescriptions by diagnosis and recovery plans.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => (
          <article key={order.id} className="panel p-5 text-sm">
            <p className="font-semibold">{order.patientName}</p>
            <p className="mt-1 text-foreground/70">Diet: {order.dietType}</p>
            <p className="mt-1 text-foreground/70">Notes: {order.notes}</p>
            <p className="mt-1 text-foreground/70">Status: {order.status}</p>
          </article>
        ))}
      </section>
    </div>
  );
}