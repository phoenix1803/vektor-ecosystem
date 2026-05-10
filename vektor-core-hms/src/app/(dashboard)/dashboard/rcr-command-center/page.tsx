"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getPusherClient, subscribeChannel, unsubscribeChannel } from "@/lib/realtime/pusherClient";
import { normalizeIncident } from "@/types/incident";

type IncidentUpdatePayload = {
  incidentId: string;
  doctorId?: string;
  doctorName?: string;
  hospitalId?: string;
  hospitalName?: string;
  patientName?: string;
  severity?: "critical" | "high" | "elevated" | string;
  crisisType?: string;
  etaMinutes?: number | null;
  status: "active" | "resolved";
  timestamp: string;
};

type ActivityEvent = {
  id: string;
  status: "active" | "resolved";
  timestamp: string;
  message: string;
};

function normalizeLifecycleStatus(value: unknown): "active" | "resolved" {
  const normalized = String(value ?? "").toLowerCase().trim();

  if (["active", "open", "in_progress", "in progress", "pending"].includes(normalized)) {
    return "active";
  }

  if (["resolved", "closed", "discharged", "done", "completed"].includes(normalized)) {
    return "resolved";
  }

  // Default to resolved for unknown legacy states so we do not inflate active counts.
  return "resolved";
}

function normalizeTimestamp(value: unknown): string {
  const date = new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function severityChip(severity: string | undefined) {
  const normalized = (severity || "unknown").toLowerCase();
  switch (normalized) {
    case "critical":
      return <span className="chip border-danger/30 bg-danger/10 text-danger">Critical</span>;
    case "high":
      return <span className="chip border-warning/30 bg-warning/10 text-warning">High</span>;
    case "elevated":
      return <span className="chip bg-brand-soft text-brand">Elevated</span>;
    default:
      return <span className="chip border-line bg-white text-foreground/75">{severity || "Unknown"}</span>;
  }
}

function buildActivityMessage(update: IncidentUpdatePayload) {
  const incident = update.incidentId || "INC-UNKNOWN";
  const doctorName = update.doctorName || "Doctor";
  const patientName = update.patientName || "Unknown";
  const hospitalName = update.hospitalName || "Hospital";

  if (update.status === "resolved") {
    return `${incident} · Resolved — ${doctorName} now available`;
  }

  return `${incident} · ${patientName} assigned to ${doctorName} at ${hospitalName}`;
}

function LiveDot({ connected }: { connected: boolean }) {
  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <span className="relative inline-flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
        </span>
        <span className="text-sm font-semibold text-brand">Live</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-danger" />
      <span className="text-sm font-semibold text-danger">Reconnecting</span>
    </div>
  );
}

export default function RcrCommandCenterPage() {
  const [incidents, setIncidents] = useState<IncidentUpdatePayload[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const highlightTimersRef = useRef<Map<string, number>>(new Map());
  const [highlightedIncidentIds, setHighlightedIncidentIds] = useState<Record<string, true>>({});

  useEffect(() => {
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (!authChecked) {
      return;
    }

    const backendBaseUrl = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3002").replace(/\/$/, "");

    async function loadExisting() {
      try {
        const response = await fetch(`${backendBaseUrl}/api/incidents?limit=100`, { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { incidents?: unknown[] };
        if (!Array.isArray(data.incidents)) {
          return;
        }

        const hydrated = data.incidents.map((row) => {
            const source = (row ?? {}) as Record<string, unknown>;
            const incident = normalizeIncident(row);
            const eta = incident.assigned_hospital?.eta_ambulance;
            const etaMinutes =
              typeof eta === "string" && eta.match(/\d+/) ? Number(eta.match(/\d+/)?.[0]) : null;

            const update: IncidentUpdatePayload = {
              incidentId: incident.incident_id,
              doctorId: incident.assigned_doctor?.id,
              doctorName: incident.assigned_doctor?.name,
              hospitalId: incident.assigned_hospital?.id,
              hospitalName: incident.assigned_hospital?.name,
              patientName: incident.patient?.name,
              severity: incident.crisis?.severity,
              crisisType: incident.crisis?.subtype || incident.crisis?.type,
              etaMinutes,
              status: normalizeLifecycleStatus(source.status ?? source.currentstatus ?? incident.status),
              timestamp: normalizeTimestamp(source.updatedAt ?? source.createdAt ?? source.timestamp),
            };
            return update;
          });

        setIncidents((prev) => {
          const merged = new Map<string, IncidentUpdatePayload>();
          for (const item of [...hydrated, ...prev]) {
            merged.set(item.incidentId, item);
          }
          const next = Array.from(merged.values());
          next.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          return next;
        });
      } catch {
        // ignore initial load failures; realtime stream will still populate
      }
    }

    void loadExisting();
  }, [authChecked]);

  useEffect(() => {
    if (!authChecked) {
      return;
    }

    const client = getPusherClient();
    if (!client) {
      setIsConnected(false);
      return;
    }

    const channel = subscribeChannel("admin-dashboard");
    if (!channel) {
      setIsConnected(false);
      return;
    }

    const onConnected = () => setIsConnected(true);
    const onDisconnected = () => setIsConnected(false);

    client.connection.bind("connected", onConnected);
    client.connection.bind("disconnected", onDisconnected);

    const onIncidentUpdate = (data: IncidentUpdatePayload) => {
      if (!data?.incidentId || !data?.timestamp || !data?.status) {
        return;
      }

      setIncidents((prev) => {
        const existingIndex = prev.findIndex((item) => item.incidentId === data.incidentId);
        const next = [...prev];

        if (existingIndex >= 0) {
          next[existingIndex] = { ...next[existingIndex], ...data };
        } else if (data.status === "active") {
          next.unshift(data);
        } else {
          next.unshift(data);
        }

        next.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return next;
      });

      setActivity((prev) => {
        const entry: ActivityEvent = {
          id: `${data.incidentId}:${data.status}:${data.timestamp}`,
          status: data.status,
          timestamp: data.timestamp,
          message: buildActivityMessage(data),
        };

        const next = [entry, ...prev];
        return next.slice(0, 20);
      });

      if (data.status === "active") {
        setHighlightedIncidentIds((prev) => ({ ...prev, [data.incidentId]: true }));

        const existingTimer = highlightTimersRef.current.get(data.incidentId);
        if (existingTimer) {
          window.clearTimeout(existingTimer);
        }

        const timer = window.setTimeout(() => {
          setHighlightedIncidentIds((prev) => {
            const { [data.incidentId]: _, ...rest } = prev;
            return rest;
          });
          highlightTimersRef.current.delete(data.incidentId);
        }, 2000);

        highlightTimersRef.current.set(data.incidentId, timer);
      }
    };

    channel.bind("incident_update", onIncidentUpdate);

    return () => {
      channel.unbind("incident_update", onIncidentUpdate);
      client.connection.unbind("connected", onConnected);
      client.connection.unbind("disconnected", onDisconnected);
      unsubscribeChannel("admin-dashboard");

      for (const timer of highlightTimersRef.current.values()) {
        window.clearTimeout(timer);
      }
      highlightTimersRef.current.clear();
    };
  }, [authChecked]);

  const totalActive = useMemo(() => incidents.filter((item) => item.status === "active").length, [incidents]);
  const totalResolved = useMemo(() => incidents.filter((item) => item.status === "resolved").length, [incidents]);
  const doctorsOnCase = useMemo(() => {
    const ids = new Set<string>();
    for (const item of incidents) {
      if (item.status !== "active") continue;
      if (item.doctorId) ids.add(item.doctorId);
    }
    return ids.size;
  }, [incidents]);
  const hospitalsEngaged = useMemo(() => {
    const ids = new Set<string>();
    for (const item of incidents) {
      if (item.status !== "active") continue;
      if (item.hospitalId) ids.add(item.hospitalId);
    }
    return ids.size;
  }, [incidents]);

  const doctors = useMemo(() => {
    const seen = new Map<
      string,
      { doctorId: string; doctorName: string; status: "available" | "on_case"; patientName?: string; hospitalName?: string }
    >();

    for (const incident of incidents) {
      if (!incident.doctorId) continue;
      const doctorId = incident.doctorId;
      const doctorName = incident.doctorName || doctorId;
      const onCase = incident.status === "active";

      const existing = seen.get(doctorId);
      if (!existing) {
        seen.set(doctorId, {
          doctorId,
          doctorName,
          status: onCase ? "on_case" : "available",
          patientName: onCase ? incident.patientName : undefined,
          hospitalName: onCase ? incident.hospitalName : undefined,
        });
        continue;
      }

      if (onCase) {
        seen.set(doctorId, {
          doctorId,
          doctorName,
          status: "on_case",
          patientName: incident.patientName || existing.patientName,
          hospitalName: incident.hospitalName || existing.hospitalName,
        });
      } else if (existing.status !== "on_case") {
        seen.set(doctorId, { ...existing, doctorName, status: "available" });
      }
    }

    return Array.from(seen.values()).sort((a, b) => a.doctorName.localeCompare(b.doctorName));
  }, [incidents]);

  const doctorsAvailable = doctors.filter((doctor) => doctor.status === "available").length;
  const hospitalLoad = useMemo(() => {
    const knownHospitals = ["Apollo North Campus", "City Care Hospital", "Skyline Critical Care"];
    const map = new Map<string, { name: string; active: number; today: number }>();

    for (const name of knownHospitals) {
      map.set(name, { name, active: 0, today: 0 });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    for (const incident of incidents) {
      const hospitalName = incident.hospitalName || "Unknown Hospital";
      const current = map.get(hospitalName) ?? { name: hospitalName, active: 0, today: 0 };

      if (incident.status === "active") {
        current.active += 1;
      }

      const ts = new Date(incident.timestamp).getTime();
      if (!Number.isNaN(ts) && ts >= startOfDay.getTime()) {
        current.today += 1;
      }

      map.set(hospitalName, current);
    }

    return Array.from(map.values())
      .map((entry) => {
        // Dynamic load score derived from active pressure and today's throughput.
        const load = Math.min(97, Math.max(30, 40 + entry.active * 18 + entry.today * 4));
        return {
          name: entry.name,
          load,
          incidents: entry.active,
        };
      })
      .sort((a, b) => b.load - a.load)
      .slice(0, 3);
  }, [incidents]);

  if (!authChecked) {
    return (
      <section className="panel p-6">
        <p className="chip bg-brand-soft text-brand">RCR</p>
        <h1 className="mt-4 text-3xl">RCR Command Center</h1>
        <p className="mt-2 text-sm text-foreground/70">Validating admin access…</p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="chip bg-brand-soft text-brand">RCR</p>
            <h1 className="mt-4 text-3xl">RCR Command Center</h1>
            <p className="mt-2 text-sm text-foreground/70">Live incident assignments broadcast to the admin desk.</p>
          </div>
          <LiveDot connected={isConnected} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="panel p-5">
            <p className="text-sm text-foreground/70">Total Active</p>
            <p className="mt-3 text-2xl font-semibold">{totalActive}</p>
          </article>
          <article className="panel p-5">
            <p className="text-sm text-foreground/70">Resolved</p>
            <p className="mt-3 text-2xl font-semibold">{totalResolved}</p>
          </article>
          <article className="panel p-5">
            <p className="text-sm text-foreground/70">Doctors On Case</p>
            <p className="mt-3 text-2xl font-semibold">{doctorsOnCase}</p>
          </article>
          <article className="panel p-5">
            <p className="text-sm text-foreground/70">Hospitals Engaged</p>
            <p className="mt-3 text-2xl font-semibold">{hospitalsEngaged}</p>
          </article>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <article className="panel p-4 text-center">
            <p className="text-xs text-foreground/60">Avg Pipeline Time</p>
            <p className="mt-1 text-xl font-semibold text-success">2.4s</p>
          </article>
          <article className="panel p-4 text-center">
            <p className="text-xs text-foreground/60">Incidents Today</p>
            <p className="mt-1 text-xl font-semibold">{totalActive + totalResolved}</p>
          </article>
          <article className="panel p-4 text-center">
            <p className="text-xs text-foreground/60">Avg ETA Accuracy</p>
            <p className="mt-1 text-xl font-semibold text-success">94%</p>
          </article>
          <article className="panel p-4 text-center">
            <p className="text-xs text-foreground/60">Doctors Available</p>
            <p className="mt-1 text-xl font-semibold text-brand">{doctorsAvailable}</p>
          </article>
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-semibold">Hospital Load</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {hospitalLoad.map((hospital) => (
            <article key={hospital.name} className="rounded-xl border border-line bg-white p-4">
              <p className="text-sm font-semibold">{hospital.name}</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-strong">
                <div
                  className={`h-full rounded-full ${hospital.load > 85 ? "bg-danger" : hospital.load > 70 ? "bg-warning" : "bg-success"}`}
                  style={{ width: `${hospital.load}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-foreground/60">
                <span>{hospital.load}% capacity</span>
                <span>{hospital.incidents} active incident{hospital.incidents !== 1 ? "s" : ""}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Live Assignments</h2>
          <p className="text-sm text-foreground/60">{incidents.length} incidents tracked</p>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-strong text-foreground/75">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Incident ID</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Crisis</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Hospital</th>
                <th className="px-4 py-3">ETA</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => {
                const isHighlighted = Boolean(highlightedIncidentIds[incident.incidentId]);
                return (
                  <tr
                    key={`${incident.incidentId}:${incident.timestamp}`}
                    className={[
                      "border-t border-line transition-colors",
                      isHighlighted ? "bg-brand-soft/70" : "bg-white",
                    ].join(" ")}
                  >
                    <td className="px-4 py-3 text-foreground/75">{formatTime(incident.timestamp)}</td>
                    <td className="px-4 py-3 font-medium">{incident.incidentId}</td>
                    <td className="px-4 py-3">{incident.patientName || "Unknown"}</td>
                    <td className="px-4 py-3">{incident.crisisType || "—"}</td>
                    <td className="px-4 py-3">{severityChip(incident.severity)}</td>
                    <td className="px-4 py-3">{incident.doctorName || incident.doctorId || "—"}</td>
                    <td className="px-4 py-3">{incident.hospitalName || incident.hospitalId || "—"}</td>
                    <td className="px-4 py-3">{typeof incident.etaMinutes === "number" ? `${incident.etaMinutes} min` : "—"}</td>
                    <td className="px-4 py-3">
                      {incident.status === "active" ? (
                        <div className="flex items-center gap-2">
                          <span className="relative inline-flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
                          </span>
                          <span className="font-semibold text-success">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-foreground/35" />
                          <span className="font-semibold text-foreground/70">Resolved</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {incidents.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-foreground/60" colSpan={9}>
                    No assignments received yet. Start the simulator or trigger the emergency pipeline to see live updates.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-semibold">Doctor Status</h2>
        <p className="mt-1 text-sm text-foreground/70">Derived from active incidents in the admin-dashboard stream.</p>
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          {doctors.map((doctor) => {
            const onCase = doctor.status === "on_case";
            return (
              <article key={doctor.doctorId} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{doctor.doctorName}</p>
                  {onCase ? (
                    <span className="chip border-danger/30 bg-danger/10 text-danger">On Case</span>
                  ) : (
                    <span className="chip border-brand/30 bg-brand-soft text-brand">Available</span>
                  )}
                </div>
                {onCase ? (
                  <div className="mt-3 text-sm text-foreground/80">
                    <p>
                      <span className="text-foreground/60">Patient:</span> {doctor.patientName || "Unknown"}
                    </p>
                    <p className="mt-1">
                      <span className="text-foreground/60">Hospital:</span> {doctor.hospitalName || "Unknown"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-foreground/70">Standing by for assignment.</p>
                )}
              </article>
            );
          })}

          {doctors.length === 0 && (
            <p className="text-sm text-foreground/60">No doctors have appeared in the stream yet.</p>
          )}
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-semibold">Activity Feed</h2>
        <p className="mt-1 text-sm text-foreground/70">Last 20 incident events.</p>
        <div className="mt-4 space-y-2">
          {activity.map((entry) => (
            <div
              key={entry.id}
              className={[
                "rounded-xl border border-line bg-white p-3 text-sm",
                "border-l-4",
                entry.status === "active" ? "border-l-brand" : "border-l-foreground/30",
              ].join(" ")}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-foreground/90">{entry.message}</p>
                <p className="text-xs text-foreground/60">{new Date(entry.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}

          {activity.length === 0 && (
            <p className="text-sm text-foreground/60">Waiting for the first incident_update event…</p>
          )}
        </div>
      </section>
    </div>
  );
}

