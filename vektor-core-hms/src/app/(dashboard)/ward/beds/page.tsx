import { BedDouble, Layers3 } from "lucide-react";
import { listWardBeds } from "@/lib/hms-data";

export default async function BedsPage() {
  const beds = await listWardBeds();
  const groupedBeds = Object.values(
    beds.reduce<Record<string, { ward: string; beds: typeof beds }>>((acc, bed) => {
      const current = acc[bed.ward] ?? { ward: bed.ward, beds: [] };
      current.beds.push(bed);
      acc[bed.ward] = current;
      return acc;
    }, {})
  );

  const dischargeQueue = [
    { name: "Rakesh Saini", ward: "Stepdown", bed: "SD-03", since: "2 hrs" },
    { name: "Ananya Pillai", ward: "General", bed: "GW-12", since: "45 min" },
  ];

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <BedDouble className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Ward Workflow</p>
        </div>
        <h1 className="mt-3 text-3xl">Bed Occupancy Map</h1>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Transfer Workflow</h2>
          <div className="mt-4 space-y-3">
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Patient UHID" />
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="From bed" />
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="To bed" />
            <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">Transfer Bed</button>
          </div>
        </article>

        <article className="panel p-5 xl:col-span-2">
          <div className="flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Ward Board</h2>
          </div>
          <div className="mt-4 space-y-4">
            {groupedBeds.map((group) => {
              const occupied = group.beds.filter((bed) => (bed.status || "").toLowerCase().includes("occupied")).length;
              const occupancyPercent = group.beds.length > 0 ? Math.round((occupied / group.beds.length) * 100) : 0;

              return (
                <div key={group.ward} className="rounded-2xl border border-line bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{group.ward}</h3>
                    <span className="chip border-line bg-surface-strong text-foreground/70">Occupancy {occupancyPercent}%</span>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
                    {group.beds.map((bed) => (
                      <div
                        key={bed.id}
                        title={`${bed.bedCode}: ${bed.status}${bed.patientName ? ` (${bed.patientName})` : ""}`}
                        className={`flex h-10 items-center justify-center rounded-lg border text-xs font-medium ${
                          (bed.status || "").toLowerCase().includes("occupied")
                            ? "border-danger/30 bg-danger/20 text-danger"
                            : (bed.status || "").toLowerCase().includes("cleaning")
                              ? "border-warning/30 bg-warning/20 text-warning"
                              : "border-success/30 bg-success/20 text-success"
                        }`}
                      >
                        {bed.bedCode}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="panel mt-5 p-5">
        <h2 className="text-lg font-semibold">Discharge Ready Queue</h2>
        <p className="mt-1 text-sm text-foreground/70">Patients cleared for discharge pending documentation.</p>
        <div className="mt-4 space-y-2">
          {dischargeQueue.map((patient) => (
            <div key={patient.name} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm">
              <span className="font-medium">{patient.name}</span>
              <span className="text-foreground/60">{patient.ward} | {patient.bed}</span>
              <span className="chip border-warning/30 bg-warning/10 text-warning">Pending {patient.since}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
