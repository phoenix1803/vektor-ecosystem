"use client";

import { Ambulance, BellRing, MapPin, ShieldAlert } from "lucide-react";
import { useIncident } from "@/app/context/incident-provider";
import { AgentPipelineBar } from "@/components/rcr/agent-pipeline-bar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { toast } from "sonner";

function severityChipClasses(severity: string) {
  const normalized = severity.toLowerCase();
  if (normalized === "critical") {
    return "chip border-danger/30 bg-danger/10 text-danger";
  }

  if (normalized === "high") {
    return "chip border-warning/30 bg-warning/10 text-warning";
  }

  return "chip border-line bg-white text-foreground/70";
}

export default function EmergencyPage() {
  const { data: session } = useSession();
  const { adminIncidents, isConnected, isIncidentNew } = useIncident();
  const router = useRouter();

  const role = session?.user?.role;
  const hospitalId = session?.user?.hospitalId;
  const isAdminLikeRole = role === "HOSPITAL_ADMIN" || role === "SUPER_ADMIN";

  const scopedIncidents = useMemo(() => {
    if (!isAdminLikeRole) {
      return [];
    }

    return adminIncidents.filter((incident) =>
      role === "SUPER_ADMIN" || !hospitalId ? true : incident.hospitalId === hospitalId
    );
  }, [adminIncidents, hospitalId, isAdminLikeRole, role]);

  const activeIncidents = scopedIncidents.filter((incident) => incident.status === "active");
  const latestIncident = activeIncidents[0] ?? scopedIncidents[0] ?? null;
  const resolvedToday = scopedIncidents.filter((incident) => incident.status === "resolved").length;
  const pipelineSteps = latestIncident ? 4 : 1;

  const timeline = [
    { time: "09:22", id: "INC-2026-0417-001", type: "Cardiac", severity: "Critical", hospital: "Apollo North", doctor: "Dr. Vikram Singh" },
    { time: "08:44", id: "INC-2026-0417-002", type: "Respiratory", severity: "High", hospital: "City Care", doctor: "Dr. Rajesh Kumar" },
    { time: "07:11", id: "INC-2026-0417-003", type: "Trauma", severity: "Elevated", hospital: "Skyline CC", doctor: "Dr. Priya Nair" },
  ];

  return (
    <div className="space-y-5">
      <section className="panel border-danger/30 bg-danger/5 p-6">
        <div className="flex items-center gap-2 text-danger">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Critical Channel</p>
        </div>
        <h1 className="mt-3 text-3xl">Emergency Alert Panel</h1>
        <p className="mt-2 max-w-2xl text-sm text-foreground/75">
          Real-time events from emergency intake with route assignment and rapid admission controls.
        </p>
        <p className="mt-2 text-xs text-foreground/60">
          Connection: {isConnected ? "Live" : "Offline"} | Last update: {latestIncident?.timestamp ?? "N/A"}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm font-semibold text-danger">
            {activeIncidents.length} Active
          </div>
          <div className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-foreground/70">
            {resolvedToday} Resolved Today
          </div>
          <div className="rounded-xl border border-brand/30 bg-brand-soft px-3 py-2 text-sm font-semibold text-brand">
            Pipeline: about 2.5s avg
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-foreground/60">Agent Pipeline</p>
          <AgentPipelineBar completedSteps={pipelineSteps} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel p-5 xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <BellRing className="h-4 w-4 text-danger" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Live Alert Feed</h2>
            {activeIncidents.length > 0 ? (
              <span className="ml-1 inline-flex items-center gap-1 text-xs text-danger">
                <span className="h-2 w-2 rounded-full bg-danger animate-pulse" />
                Active
              </span>
            ) : null}
          </div>

          <div className="space-y-3">
            {scopedIncidents.length > 0 ? (
              scopedIncidents.map((incident) => {
                const isActive = incident.status === "active";
                const isNew = isIncidentNew(incident.incidentId);

                return (
                  <div
                    key={incident.incidentId}
                    className={`rounded-xl border border-line p-4 text-sm transition-colors duration-1500 ${
                      isNew ? "alert-card-enter bg-brand-soft" : "bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{incident.patientName}</p>
                      <div className="flex items-center gap-2">
                        <span className={severityChipClasses(incident.severity)}>{incident.severity.toUpperCase()}</span>
                        {!isActive ? (
                          <span className="chip border-success/30 bg-success/10 text-success">Resolved</span>
                        ) : null}
                      </div>
                    </div>

                    <p className="mt-2 text-foreground/75">
                      {incident.crisisType} | {incident.hospitalName}
                    </p>
                    <p className="mt-1 text-foreground/75">Assigned doctor: {incident.doctorName}</p>
                    <p className="mt-1 text-foreground/75">
                      ETA: {incident.etaMinutes !== null ? `${incident.etaMinutes} mins` : "Pending"}
                    </p>

                    {isActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Patient accepted. Opening briefing screen.");
                          router.push(`/emergency/briefing/${incident.incidentId}`);
                        }}
                        className="mt-3 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white"
                      >
                        Accept Patient
                      </button>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl border border-line bg-white p-4 text-sm text-foreground/70">
                <div className="flex items-center gap-2 text-success">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span className="font-medium">All clear</span>
                </div>
                <p className="mt-2">No active emergencies.</p>
              </div>
            )}
          </div>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Route Snapshot</h2>
          </div>

          <div className="mt-4 rounded-2xl border border-line bg-linear-to-br from-brand-soft to-white p-4">
            <p className="text-sm font-semibold text-foreground/85">
              {latestIncident
                ? `${latestIncident.hospitalName} - ${latestIncident.crisisType}`
                : "No route available until an incident is active."}
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              {latestIncident
                ? `Incoming patient: ${latestIncident.patientName}`
                : "Waiting for incident feed."}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-line bg-white p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Ambulance className="h-4 w-4 text-brand" aria-hidden="true" />
              Incoming Unit
            </div>
            <p className="mt-2 text-foreground/70">
              {latestIncident
                ? `ETA ${latestIncident.etaMinutes !== null ? latestIncident.etaMinutes : "-"} mins | Doctor ${latestIncident.doctorName}`
                : "No active ambulance dispatch."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-foreground/80">
                Acknowledge
              </button>
              <button
                type="button"
                onClick={() => {
                  if (latestIncident) {
                    toast.success("Opening responder flash view.");
                    router.push(`/emergency/flash/${latestIncident.incidentId}`);
                  }
                }}
                className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger"
              >
                Responder Flash
              </button>
              <button
                type="button"
                onClick={() => {
                  if (latestIncident) {
                    toast.success("Incident accepted.");
                    router.push(`/emergency/briefing/${latestIncident.incidentId}`);
                  }
                }}
                className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white"
              >
                Accept Incident
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-semibold">Today's Incident Timeline</h2>
        <div className="mt-4 space-y-3">
          {timeline.map((incident) => (
            <div key={incident.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm">
              <span className="w-12 text-foreground/60">{incident.time}</span>
              <span className="w-40 font-medium">{incident.id}</span>
              <span>{incident.type}</span>
              <span className="text-foreground/70">{incident.hospital}</span>
              <span className="text-foreground/70">{incident.doctor}</span>
              <span className="chip border-success/30 bg-success/10 text-success">Resolved</span>
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
        @keyframes alertSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .alert-card-enter {
          animation: alertSlideIn 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}
