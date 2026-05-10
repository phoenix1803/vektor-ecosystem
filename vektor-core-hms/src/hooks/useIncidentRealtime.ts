"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPusherClient, subscribeChannel, unsubscribeChannel } from "@/lib/realtime/pusherClient";
import type { IncidentPayload } from "@/types/demoDataFromAgent";
import { extractIncidentId, normalizeIncident } from "@/types/incident";

type RealtimeRole = "patient" | "doctor" | "responder";

type UseIncidentRealtimeOptions = {
  role: RealtimeRole;
  incidentId?: string;
  doctorId?: string;
  patientUhid?: string;
  backendBaseUrl?: string;
  enabled?: boolean;
  onIncidentLoaded?: (incident: IncidentPayload) => void;
};

type UseIncidentRealtimeState = {
  incident: IncidentPayload | null;
  isLoading: boolean;
  isRefreshing: boolean;
  connectionState: string;
  reconnectCount: number;
  error: string | null;
  refreshIncident: (incidentId?: string) => Promise<void>;
};

const DEFAULT_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

function resolveChannel(role: RealtimeRole, ids: { incidentId?: string; doctorId?: string; patientUhid?: string }) {
  if (role === "patient" && ids.patientUhid) {
    return `patient-${ids.patientUhid}`;
  }

  if (role === "doctor" && ids.doctorId) {
    return `doctor-${ids.doctorId}`;
  }

  if (role === "responder" && ids.incidentId) {
    return `incident-${ids.incidentId}`;
  }

  return null;
}

function eventsForRole(role: RealtimeRole) {
  if (role === "patient") {
    return ["sos_activated"];
  }

  if (role === "doctor") {
    return ["patient_incoming", "doctor_available"];
  }

  return ["incident_update"];
}

export function useIncidentRealtime(options: UseIncidentRealtimeOptions): UseIncidentRealtimeState {
  const {
    role,
    incidentId,
    doctorId,
    patientUhid,
    backendBaseUrl = DEFAULT_BACKEND_BASE_URL,
    enabled = true,
    onIncidentLoaded,
  } = options;

  const [incident, setIncident] = useState<IncidentPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(incidentId));
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [connectionState, setConnectionState] = useState<string>("idle");
  const [reconnectCount, setReconnectCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const activeIncidentIdRef = useRef<string | undefined>(incidentId);
  const wasConnectedRef = useRef<boolean>(false);

  const normalizedBaseUrl = useMemo(() => backendBaseUrl.replace(/\/$/, ""), [backendBaseUrl]);

  const fetchLatestIncident = useCallback(
    async (targetIncidentId?: string, refresh = false) => {
      const idToFetch = targetIncidentId || activeIncidentIdRef.current;
      if (!idToFetch) {
        return;
      }

      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const response = await fetch(`${normalizedBaseUrl}/api/incidents/${idToFetch}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch incident ${idToFetch}: ${response.status}`);
        }

        const json = (await response.json()) as { incident?: unknown };
        if (!json.incident) {
          throw new Error("Incident payload missing in API response");
        }

        const next = normalizeIncident(json.incident);
        setIncident(next);
        activeIncidentIdRef.current = next.incident_id;
        onIncidentLoaded?.(next);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown realtime fetch error";
        setError(message);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [normalizedBaseUrl, onIncidentLoaded]
  );

  useEffect(() => {
    activeIncidentIdRef.current = incidentId;
  }, [incidentId]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const channelName = resolveChannel(role, { incidentId, doctorId, patientUhid });
    if (!channelName) {
      setError("Realtime channel could not be resolved for current role context");
      return;
    }

    const pusher = getPusherClient();
    if (!pusher) {
      setError("Pusher client is not configured. Set NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER.");
      if (incidentId) {
        void fetchLatestIncident(incidentId, false);
      }
      return;
    }

    setError(null);
    const channel = subscribeChannel(channelName);
    if (!channel) {
      setError(`Failed to subscribe to channel ${channelName}`);
      return;
    }

    const connectionHandler = (states: { previous: string; current: string }) => {
      setConnectionState(states.current);

      if (states.current === "connected" && wasConnectedRef.current) {
        setReconnectCount((count) => count + 1);
        void fetchLatestIncident(undefined, true);
      }

      wasConnectedRef.current = states.current === "connected";
    };

    const errorHandler = () => {
      setError("Realtime connection error");
      setConnectionState("error");
    };

    pusher.connection.bind("state_change", connectionHandler);
    pusher.connection.bind("error", errorHandler);

    const eventNames = eventsForRole(role);
    const eventHandlers = eventNames.map((eventName) => {
      const handler = (payload: unknown) => {
        const nextIncidentId = extractIncidentId(payload, activeIncidentIdRef.current);
        if (!nextIncidentId) {
          return;
        }

        activeIncidentIdRef.current = nextIncidentId;
        void fetchLatestIncident(nextIncidentId, true);
      };

      channel.bind(eventName, handler);
      return { eventName, handler };
    });

    if (incidentId) {
      void fetchLatestIncident(incidentId, false);
    }

    return () => {
      eventHandlers.forEach(({ eventName, handler }) => {
        channel.unbind(eventName, handler);
      });

      pusher.connection.unbind("state_change", connectionHandler);
      pusher.connection.unbind("error", errorHandler);
      unsubscribeChannel(channelName);
    };
  }, [enabled, role, incidentId, doctorId, patientUhid, fetchLatestIncident]);

  return {
    incident,
    isLoading,
    isRefreshing,
    connectionState,
    reconnectCount,
    error,
    refreshIncident: async (id?: string) => {
      await fetchLatestIncident(id, true);
    },
  };
}
