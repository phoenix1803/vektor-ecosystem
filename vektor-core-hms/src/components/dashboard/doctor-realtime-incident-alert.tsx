"use client";

import Link from "next/link";
import { useIncident } from "@/app/context/incident-provider";

export function DoctorRealtimeIncidentAlert() {
  const { doctorIncomingIncident } = useIncident();

  if (!doctorIncomingIncident) {
    return (
      <p className="rounded-xl border border-line bg-white px-3 py-2 text-foreground/70">
        No active RCR incident assigned right now.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-danger">
      <p className="font-semibold">
        Incoming emergency patient - {doctorIncomingIncident.patientName} | {doctorIncomingIncident.crisisType}
      </p>
      <p className="mt-1 text-sm">Severity: {doctorIncomingIncident.severity}</p>
      <Link
        href={`/emergency/briefing/${doctorIncomingIncident.incidentId}`}
        className="mt-2 inline-block text-sm font-semibold underline underline-offset-2"
      >
        Open Briefing
      </Link>
    </div>
  );
}
