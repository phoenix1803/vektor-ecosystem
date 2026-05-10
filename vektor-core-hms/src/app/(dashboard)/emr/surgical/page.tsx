import { Stethoscope } from "lucide-react";
import { listSurgicalNotes } from "@/lib/hms-data";

export default async function Page() {
  const notes = await listSurgicalNotes();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Stethoscope className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Perioperative Documentation</p>
        </div>
        <h1 className="mt-3 text-3xl">Surgical Notes</h1>
        <p className="mt-2 text-sm text-foreground/70">Capture pre-op, intra-op, and post-op notes with status-aware review.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Procedure</th>
              <th className="px-4 py-3">Surgeon</th>
              <th className="px-4 py-3">Phase</th>
              <th className="px-4 py-3">Note Status</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{note.patientName}</td>
                <td className="px-4 py-3">{note.procedure}</td>
                <td className="px-4 py-3">{note.surgeon}</td>
                <td className="px-4 py-3">{note.phase}</td>
                <td className="px-4 py-3">{note.noteStatus}</td>
                <td className="px-4 py-3">{new Date(note.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}