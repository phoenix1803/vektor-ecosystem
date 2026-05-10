"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  PhoneCall,
  Route,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { useIncident } from "@/app/context/incident-provider";
import { useIncidentRealtime } from "@/hooks/useIncidentRealtime";

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

export default function ResponderFlashPage() {
  const params = useParams<{ incident_id: string }>();
  const { currentIncident, setIncidentFromPayload } = useIncident();

  const realtime = useIncidentRealtime({
    role: "responder",
    incidentId: params?.incident_id,
    enabled: Boolean(params?.incident_id),
    onIncidentLoaded: setIncidentFromPayload,
  });

  const incident = realtime.incident ?? currentIncident;

  const routeSegments = useMemo(() => {
    if (!incident?.responder.route) {
      return [];
    }

    return incident.responder.route
      .split("->")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [incident]);

  if (realtime.isLoading && !incident) {
    return (
      <div className="space-y-5">
        <section className="panel p-6">
          <h1 className="text-3xl">Responder Flash Screen</h1>
          <p className="mt-2 text-sm text-foreground/70">Loading incident feed...</p>
        </section>
      </div>
    );
  }

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
      <p className="chip border-line bg-white text-foreground/70">
        Realtime: {realtime.connectionState || "idle"}
        {realtime.reconnectCount > 0 ? ` · Reconnected ${realtime.reconnectCount}x` : ""}
      </p>
      {realtime.error ? (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">{realtime.error}</p>
      ) : null}

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
              <div className="flex flex-wrap items-center gap-2">
                {routeSegments.map((segment, index) => (
                  <div key={`${segment}-${index}`} className="flex items-center gap-2">
                    <div className="rounded-xl border border-brand/30 bg-brand-soft px-3 py-2 text-sm font-medium text-brand">
                      {segment}
                    </div>
                    {index < routeSegments.length - 1 ? (
                      <ChevronRight className="h-4 w-4 text-foreground/40" aria-hidden="true" />
                    ) : null}
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

          <div className="panel p-4">
            <p className="mb-3 text-sm font-semibold">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white">Patient Reached</button>
              <button className="rounded-xl bg-warning px-3 py-2 text-xs font-semibold text-white">Request Backup</button>
              <button className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold">Vitals Stable</button>
              <button className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger">Escalate</button>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
