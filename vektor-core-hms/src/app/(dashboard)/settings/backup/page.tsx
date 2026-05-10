import { DatabaseBackup } from "lucide-react";
import { getBackupSnapshot } from "@/lib/settings-data";

export default async function Page() {
  const backup = await getBackupSnapshot();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <DatabaseBackup className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Settings</p>
        </div>
        <h1 className="mt-3 text-3xl">Backup and Recovery</h1>
        <p className="mt-2 text-sm text-foreground/70">Operational status for backup continuity and restore readiness.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <article className="panel p-5 text-sm"><p className="text-foreground/70">Status</p><p className="mt-2 text-2xl font-semibold capitalize">{backup.status}</p></article>
        <article className="panel p-5 text-sm"><p className="text-foreground/70">Provider</p><p className="mt-2 text-2xl font-semibold">{backup.provider}</p></article>
        <article className="panel p-5 text-sm"><p className="text-foreground/70">Last backup</p><p className="mt-2 text-lg font-semibold">{new Date(backup.lastBackupAt).toLocaleString()}</p></article>
        <article className="panel p-5 text-sm"><p className="text-foreground/70">RTO</p><p className="mt-2 text-2xl font-semibold">{backup.rtoMinutes}m</p></article>
        <article className="panel p-5 text-sm"><p className="text-foreground/70">RPO</p><p className="mt-2 text-2xl font-semibold">{backup.rpoMinutes}m</p></article>
      </section>

      <section className="panel p-5 text-sm">
        <p className="font-semibold">Restore readiness: {backup.restoreReady ? "Ready" : "Pending"}</p>
        <p className="mt-2 text-foreground/70">Use POST /api/v1/settings/backup to trigger manual backup and record audit event.</p>
      </section>
    </div>
  );
}