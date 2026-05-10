"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock3,
  PhoneCall,
  Route,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { useIncident } from "@/app/context/incident-provider";

function getAuthorityStatus(dispatch: string, comms: string) {
  const d = dispatch.toLowerCase();
  const c = comms.toLowerCase();

  if ((d === "complete" || d === "completed") && (c === "complete" || c === "completed")) {
    return "Confirmed";
  }

  if (d.includes("progress") || c.includes("progress") || d === "pending" || c === "pending") {
    return "In Progress";
  }

  return "Not Contacted";
}

export default function ResponderFlashScreenPage() {
  const params = useParams<{ incident_id: string }>();
  const { currentIncident } = useIncident();

  const incident = currentIncident;
  const routeSegments = useMemo(() => {
    if (!incident?.responder.route) {
      return [];
    }

    return incident.responder.route
      .split("->")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [incident]);

  if (!incident) {
    return (
      <div className="space-y-5">
        <section className="panel p-6">
          <h1 className="text-3xl">Responder Flash Screen</h1>
          <p className="mt-2 text-sm text-foreground/70">
            No active incident available. Accept a patient from Emergency Alerts first.
          </p>
        </section>
      </div>
    );
  }

  const authorityStatus = getAuthorityStatus(incident.agent_status.dispatch, incident.agent_status.comms);

  return (
    <div className="space-y-5">
      <section className="panel border-danger/30 bg-danger/5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-danger">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.15em]">Responder Flash Screen</p>
            </div>
            <h1 className="mt-3 text-3xl">On-Site Emergency Handoff</h1>
            <p className="mt-2 text-sm text-foreground/75">
              Incident {params?.incident_id || incident.incident_id} · Severity {incident.crisis.severity}
            </p>
          </div>
          <span className="chip border-danger/30 bg-danger/10 text-danger">
            {incident.crisis.type.toUpperCase()} / {incident.crisis.subtype.toUpperCase()}
          </span>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel p-5 xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <UserRound className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Patient Identity</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-line bg-white p-3 text-sm">
              <p className="text-xs text-foreground/60">Name</p>
              <p className="mt-1 font-semibold">{incident.patient.name}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-3 text-sm">
              <p className="text-xs text-foreground/60">Blood Type</p>
              <p className="mt-1 font-semibold">{incident.patient.blood_type}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-3 text-sm">
              <p className="text-xs text-foreground/60">Room / Zone</p>
              <p className="mt-1 font-semibold">Room {incident.location.room}, Floor {incident.location.floor}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-3 text-sm">
              <p className="text-xs text-foreground/60">ETA</p>
              <p className="mt-1 inline-flex items-center gap-1 font-semibold">
                <Clock3 className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                {incident.assigned_hospital.eta_ambulance}
              </p>
            </div>
          </div>

          <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            Critical allergies: {incident.patient.allergies.length ? incident.patient.allergies.join(", ") : "No known allergies"}
          </p>

          <div className="mt-4 rounded-xl border border-line bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <Route className="h-4 w-4 text-brand" aria-hidden="true" />
              <h3 className="text-sm font-semibold">Live Evacuation Route</h3>
            </div>

            {routeSegments.length ? (
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {routeSegments.map((segment, index) => (
                  <div key={`${segment}-${index}`} className="rounded-lg border border-line bg-background px-3 py-2 text-sm">
                    <p className="text-xs text-foreground/60">Step {index + 1}</p>
                    <p className="mt-1 font-medium text-foreground/85">{segment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground/70">No route details available.</p>
            )}
          </div>
        </article>

        <article className="space-y-4">
          <div className="panel p-5">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-danger" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Crisis Severity</h2>
            </div>
            <span className="chip border-danger/30 bg-danger/10 text-danger">
              {incident.crisis.severity.toUpperCase()}
            </span>
            <p className="mt-2 text-sm text-foreground/70">
              Verified: {incident.crisis.verified ? "Yes" : "No"}
            </p>
          </div>

          <div className="panel p-5">
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-brand" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Handoff Assignment</h2>
            </div>
            <p className="text-sm font-semibold">Doctor: {incident.assigned_doctor.name}</p>
            <p className="mt-1 text-sm text-foreground/70">Specialty: {incident.assigned_doctor.specialty}</p>
            <p className="mt-1 text-sm text-foreground/70">Receiving Ward: Emergency Intake</p>
            <p className="mt-1 text-sm text-foreground/70">Hospital: {incident.assigned_hospital.name}</p>
          </div>

          <div className="panel p-5">
            <div className="mb-3 flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-brand" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Authority Contact</h2>
            </div>
            <p className="text-sm font-semibold">Status: {authorityStatus}</p>
            <div className="mt-2 text-sm text-foreground/70">
              <p>Dispatch: {incident.agent_status.dispatch}</p>
              <p>Comms: {incident.agent_status.comms}</p>
            </div>
            {authorityStatus === "Confirmed" ? (
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-success">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Contacts acknowledged and active
              </p>
            ) : null}
          </div>
        </article>
      </section>
    </div>
  );
}
