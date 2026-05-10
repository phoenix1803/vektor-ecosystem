"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShieldAlert } from "lucide-react";
import { getPusherClient, subscribeChannel, unsubscribeChannel } from "@/lib/realtime/pusherClient";
import { parseIncidentPayload, type IncidentPayload } from "@/types/demoDataFromAgent";
import { useIncidentRealtime } from "@/hooks/useIncidentRealtime";

type IncomingPatientBanner = {
  incidentId: string;
  patientName: string;
  crisisType: string;
  severity: string;
  receivedAt: string;
};

type AdminIncidentItem = {
  incidentId: string;
  status: "active" | "resolved";
  patientName: string;
  crisisType: string;
  severity: string;
  hospitalId: string;
  hospitalName: string;
  doctorId: string;
  doctorName: string;
  etaMinutes: number | null;
  timestamp: string;
};

type IncidentContextValue = {
  currentIncident: IncidentPayload | null;
  isConnected: boolean;
  lastUpdated: string | null;
  setIncidentFromPayload: (payload: unknown) => void;
  dismissIncomingBanner: () => void;
  adminIncidents: AdminIncidentItem[];
  isAlertsPulsing: boolean;
  isIncidentNew: (incidentId: string) => boolean;
  doctorIncomingIncident: IncomingPatientBanner | null;
};

const IncidentContext = createContext<IncidentContextValue | null>(null);

function normalizeIncomingPatient(payload: unknown): IncomingPatientBanner | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const data = payload as Record<string, unknown>;
  const incidentId =
    typeof data.incidentId === "string"
      ? data.incidentId
      : typeof data.incident_id === "string"
      ? data.incident_id
      : null;

  if (!incidentId) {
    return null;
  }

  return {
    incidentId,
    patientName:
      typeof data.patientName === "string"
        ? data.patientName
        : typeof data.patient_name === "string"
        ? data.patient_name
        : "Unknown Patient",
    crisisType:
      typeof data.crisisType === "string"
        ? data.crisisType
        : typeof data.crisis_type === "string"
        ? data.crisis_type
        : "Emergency",
    severity: typeof data.severity === "string" ? data.severity : "elevated",
    receivedAt: new Date().toISOString(),
  };
}

function normalizeAdminIncident(payload: unknown): AdminIncidentItem | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const data = payload as Record<string, unknown>;
  const incidentId =
    typeof data.incidentId === "string"
      ? data.incidentId
      : typeof data.incident_id === "string"
      ? data.incident_id
      : typeof data.event_id === "string"
      ? data.event_id
      : null;

  if (!incidentId) {
    return null;
  }

  const statusRaw = typeof data.status === "string" ? data.status.toLowerCase() : "active";
  const status: "active" | "resolved" = statusRaw === "resolved" ? "resolved" : "active";

  return {
    incidentId,
    status,
    patientName: typeof data.patientName === "string" ? data.patientName : "Unknown Patient",
    crisisType: typeof data.crisisType === "string" ? data.crisisType : "Emergency",
    severity: typeof data.severity === "string" ? data.severity.toLowerCase() : "high",
    hospitalId: typeof data.hospitalId === "string" ? data.hospitalId : "unknown-hospital",
    hospitalName: typeof data.hospitalName === "string" ? data.hospitalName : "Unknown Hospital",
    doctorId: typeof data.doctorId === "string" ? data.doctorId : "UNASSIGNED",
    doctorName: typeof data.doctorName === "string" ? data.doctorName : "Doctor unavailable",
    etaMinutes: typeof data.etaMinutes === "number" ? data.etaMinutes : null,
    timestamp: typeof data.timestamp === "string" ? data.timestamp : new Date().toISOString(),
  };
}

export function IncidentProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [currentIncident, setCurrentIncident] = useState<IncidentPayload | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [incomingBanner, setIncomingBanner] = useState<IncomingPatientBanner | null>(null);
  const [adminIncidents, setAdminIncidents] = useState<AdminIncidentItem[]>([]);
  const [isAlertsPulsing, setIsAlertsPulsing] = useState(false);
  const [newIncidentIds, setNewIncidentIds] = useState<string[]>([]);

  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const highlightTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const incomingBannerRef = useRef<IncomingPatientBanner | null>(null);

  useEffect(() => {
    incomingBannerRef.current = incomingBanner;
  }, [incomingBanner]);

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) {
        clearTimeout(pulseTimerRef.current);
      }
      Object.values(highlightTimersRef.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const triggerAlertPulse = () => {
    setIsAlertsPulsing(true);
    if (pulseTimerRef.current) {
      clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = setTimeout(() => setIsAlertsPulsing(false), 3000);
  };

  const markIncidentAsNew = (incidentId: string) => {
    setNewIncidentIds((prev) => (prev.includes(incidentId) ? prev : [incidentId, ...prev]));

    if (highlightTimersRef.current[incidentId]) {
      clearTimeout(highlightTimersRef.current[incidentId]);
    }

    highlightTimersRef.current[incidentId] = setTimeout(() => {
      setNewIncidentIds((prev) => prev.filter((id) => id !== incidentId));
      delete highlightTimersRef.current[incidentId];
    }, 1500);
  };

  const setIncidentFromPayload = (payload: unknown) => {
    const parsed = parseIncidentPayload(payload);
    setCurrentIncident(parsed);
    setLastUpdated(new Date().toISOString());
  };

  const dismissIncomingBanner = () => {
    setIncomingBanner(null);
  };

  const patientUhid = session?.user?.patientUhid;
  const isPatient = status === "authenticated" && session?.user?.role === "PATIENT";

  useIncidentRealtime({
    role: "patient",
    patientUhid,
    enabled: Boolean(isPatient && patientUhid),
    onIncidentLoaded: setIncidentFromPayload,
  });

  useEffect(() => {
    if (status !== "authenticated") {
      setIncomingBanner(null);
      return;
    }

    const role = session?.user?.role;
    const doctorId = session?.user?.id;

    if (role !== "DOCTOR" || !doctorId) {
      setIncomingBanner(null);
      return;
    }

    const pusher = getPusherClient();
    if (!pusher) {
      setIsConnected(false);
      return;
    }

    const channelName = `doctor-${doctorId}`;
    const channel = subscribeChannel(channelName);
    if (!channel) {
      setIsConnected(false);
      return;
    }

    const onConnected = () => setIsConnected(true);
    const onDisconnected = () => setIsConnected(false);
    pusher.connection.bind("connected", onConnected);
    pusher.connection.bind("disconnected", onDisconnected);

    const onIncoming = (payload: unknown) => {
      const next = normalizeIncomingPatient(payload);
      if (!next) return;

      const current = incomingBannerRef.current;
      if (current?.incidentId === next.incidentId) {
        return;
      }

      setIncomingBanner(next);
    };

    channel.bind("patient_incoming", onIncoming);

    return () => {
      channel.unbind("patient_incoming", onIncoming);
      pusher.connection.unbind("connected", onConnected);
      pusher.connection.unbind("disconnected", onDisconnected);
      unsubscribeChannel(channelName);
    };
  }, [session?.user?.id, session?.user?.role, status]);

  useEffect(() => {
    if (status !== "authenticated") {
      setAdminIncidents([]);
      setIsAlertsPulsing(false);
      setNewIncidentIds([]);
      return;
    }

    const role = session?.user?.role;
    const isAdminLikeRole = role === "HOSPITAL_ADMIN" || role === "SUPER_ADMIN";

    if (!isAdminLikeRole) {
      setAdminIncidents([]);
      setIsAlertsPulsing(false);
      setNewIncidentIds([]);
      return;
    }

    const pusher = getPusherClient();
    if (!pusher) {
      setIsConnected(false);
      return;
    }

    const channelName = "admin-dashboard";
    const channel = subscribeChannel(channelName);
    if (!channel) {
      setIsConnected(false);
      return;
    }

    const onConnected = () => setIsConnected(true);
    const onDisconnected = () => setIsConnected(false);
    pusher.connection.bind("connected", onConnected);
    pusher.connection.bind("disconnected", onDisconnected);

    const onIncidentUpdate = (payload: unknown) => {
      const next = normalizeAdminIncident(payload);
      if (!next) {
        return;
      }

      setAdminIncidents((prev) => {
        const existingIndex = prev.findIndex((item) => item.incidentId === next.incidentId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...next,
          };
          return updated.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
        }

        if (next.status === "active") {
          triggerAlertPulse();
          markIncidentAsNew(next.incidentId);
        }

        return [next, ...prev].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
      });
    };

    channel.bind("incident_update", onIncidentUpdate);

    return () => {
      channel.unbind("incident_update", onIncidentUpdate);
      pusher.connection.unbind("connected", onConnected);
      pusher.connection.unbind("disconnected", onDisconnected);
      unsubscribeChannel(channelName);
    };
  }, [session?.user?.role, status]);

  const value = useMemo(
    () => ({
      currentIncident,
      isConnected,
      lastUpdated,
      setIncidentFromPayload,
      dismissIncomingBanner,
      adminIncidents,
      isAlertsPulsing,
      isIncidentNew: (incidentId: string) => newIncidentIds.includes(incidentId),
      doctorIncomingIncident: incomingBanner,
    }),
    [currentIncident, isConnected, lastUpdated, adminIncidents, isAlertsPulsing, newIncidentIds, incomingBanner]
  );

  return (
    <IncidentContext.Provider value={value}>
      {incomingBanner ? (
        <div className="fixed inset-x-0 top-0 z-60 border-b border-danger/30 bg-danger/10">
          <div className="mx-auto flex max-w-350 flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
            <div className="flex min-w-0 items-center gap-3 text-danger">
              <ShieldAlert className="h-5 w-5 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  New Patient Incoming - {incomingBanner.crisisType} - {incomingBanner.severity}
                </p>
                <p className="truncate text-xs text-danger/80">{incomingBanner.patientName}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const incidentId = incomingBanner.incidentId;
                  dismissIncomingBanner();
                  router.push(`/emergency/briefing/${incidentId}`);
                }}
                className="rounded-xl bg-danger px-3 py-2 text-xs font-semibold text-white hover:opacity-95"
              >
                Accept Patient
              </button>
              <button
                type="button"
                onClick={dismissIncomingBanner}
                className="rounded-xl border border-danger/30 bg-white px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/5"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={incomingBanner ? "pt-15" : undefined}>{children}</div>
    </IncidentContext.Provider>
  );
}

export function useIncident() {
  const ctx = useContext(IncidentContext);
  if (!ctx) {
    throw new Error("useIncident must be used inside IncidentProvider");
  }

  return ctx;
}
