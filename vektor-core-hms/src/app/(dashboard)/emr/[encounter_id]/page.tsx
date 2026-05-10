type EncounterPageProps = {
  params: Promise<{ encounter_id: string }>;
};

export default async function EncounterPage({ params }: EncounterPageProps) {
  const { encounter_id } = await params;

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <p className="chip bg-brand-soft text-brand">Encounter Editor</p>
        <h1 className="mt-4 text-3xl">EMR Encounter {encounter_id}</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Structured SOAP notes with vitals, diagnosis coding, and medication workflow.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">SOAP Builder</h2>
          <textarea rows={4} placeholder="Subjective" className="mt-3 w-full rounded-xl border border-line bg-white p-3 text-sm" />
          <textarea rows={4} placeholder="Objective" className="mt-3 w-full rounded-xl border border-line bg-white p-3 text-sm" />
          <textarea rows={4} placeholder="Assessment" className="mt-3 w-full rounded-xl border border-line bg-white p-3 text-sm" />
          <textarea rows={4} placeholder="Plan" className="mt-3 w-full rounded-xl border border-line bg-white p-3 text-sm" />
        </article>

        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Orders and Prescriptions</h2>
          <p className="mt-3 text-sm text-foreground/75">Drug interaction checker and lab order panel can be attached here.</p>
          <button className="mt-4 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white">
            Save Encounter
          </button>
        </article>
      </section>
    </div>
  );
}
