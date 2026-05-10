"use client";

import Link from "next/link";
import { AlertTriangle, Clock3, Hospital, Siren, UserRoundCheck } from "lucide-react";
import { useIncident } from "@/app/context/incident-provider";
import { useEffect, useMemo, useState } from "react";

type PatientEmergencySummaryProps = {
  compact?: boolean;
};

export function PatientEmergencySummary({ compact = false }: PatientEmergencySummaryProps) {
  const { currentIncident, isConnected, lastUpdated } = useIncident();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!currentIncident) return;
    const id = window.setInterval(() => setTick((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [currentIncident]);

  const etaCountdown = useMemo(() => {
    void tick;
    const eta = currentIncident?.assigned_hospital?.eta_ambulance;
    if (!eta) return null;
    const match = String(eta).match(/(\d+)/);
    if (!match) return eta;
    const minutes = Number(match[1]);
    if (!Number.isFinite(minutes)) return eta;

    const base = lastUpdated ? new Date(lastUpdated).getTime() : Date.now();
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - base) / 1000));
    const remainingSeconds = Math.max(0, minutes * 60 - elapsedSeconds);
    const mm = Math.floor(remainingSeconds / 60);
    const ss = remainingSeconds % 60;
    return `${mm}:${String(ss).padStart(2, "0")}`;
  }, [currentIncident?.assigned_hospital?.eta_ambulance, lastUpdated, tick]);

  if (!currentIncident) {
    return (
      <section className="panel p-5">
        <div className="flex items-center gap-2 text-foreground/80">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Emergency Status</h2>
        </div>
        <p className="mt-2 text-sm text-foreground/70">No active emergency incident linked to your account.</p>
        <Link
          href="/portal/emergency"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm font-semibold text-danger"
        >
          <Siren className="h-4 w-4" aria-hidden="true" />
          Open SOS
        </Link>
      </section>
    );
  }

  return (
    <section className="panel border-danger/30 bg-danger/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-danger">
          <Siren className="h-4 w-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Emergency Response Active — Ambulance on the way</h2>
        </div>
        <span className="chip border-danger/30 bg-danger/10 text-danger">{currentIncident.status}</span>
      </div>

      <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
        <p className="rounded-lg border border-line bg-white px-3 py-2">
          <Hospital className="mr-2 inline h-4 w-4 text-brand" aria-hidden="true" />
          Hospital: {currentIncident.assigned_hospital.name}
        </p>
        <p className="rounded-lg border border-line bg-white px-3 py-2">
          <UserRoundCheck className="mr-2 inline h-4 w-4 text-brand" aria-hidden="true" />
          Doctor: {currentIncident.assigned_doctor.name}
        </p>
        <p className="rounded-lg border border-line bg-white px-3 py-2">
          <Clock3 className="mr-2 inline h-4 w-4 text-brand" aria-hidden="true" />
          ETA: {etaCountdown ?? currentIncident.assigned_hospital.eta_ambulance}
        </p>
        <p className="rounded-lg border border-line bg-white px-3 py-2 text-foreground/70">
          Channel: {isConnected ? "Live" : "Mock mode"} · Updated {lastUpdated ?? "N/A"}
        </p>
      </div>

      {!compact && (
        <p className="mt-3 text-sm text-foreground/75">
          Help is on the way. Stay in a safe area and follow on-screen responder instructions.
        </p>
      )}

      <Link
        href="/portal/emergency"
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white"
      >
        <Siren className="h-4 w-4" aria-hidden="true" />
        Open SOS
      </Link>
    </section>
  );
}
