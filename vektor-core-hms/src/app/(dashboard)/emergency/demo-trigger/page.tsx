"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bolt } from "lucide-react";

type EmergencyCreateResponse = {
  incident_id?: string;
  assigned_doctor?: {
    id?: string;
    name?: string;
  };
};

export default function EmergencyDemoTriggerPage() {
  const router = useRouter();
  const backendBaseUrl = useMemo(
    () => (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3002").replace(/\/$/, ""),
    []
  );

  const [loading, setLoading] = useState(false);
  const [incidentId, setIncidentId] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerDemo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backendBaseUrl}/api/emergency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "frontend-demo",
          timestamp: new Date().toISOString(),
          idempotency_key: `demo-${Date.now()}`,
          location: {
            lat: 28.6139,
            lng: 77.209,
            floor: "2",
            room: "204",
            venue: "Apollo North Campus",
          },
          patient: {
            uhid: "UHID-12091",
            name: "Demo Patient",
            age: 54,
            blood_type: "B+",
            allergies: ["Penicillin"],
            medications: ["Metformin"],
            conditions: ["Hypertension"],
            critical_flags: ["Arrhythmia history"],
            spo2: 91,
            heart_rate: 122,
            symptoms: ["Chest pain", "Breathlessness"],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Emergency trigger failed: ${response.status}`);
      }

      const payload = (await response.json()) as EmergencyCreateResponse;
      if (!payload.incident_id) {
        throw new Error("Backend did not return incident_id");
      }

      setIncidentId(payload.incident_id);
      setDoctorId(payload.assigned_doctor?.id || null);

      router.push(`/emergency/briefing/${payload.incident_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to trigger demo incident");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Bolt className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Local Demo Trigger</p>
        </div>
        <h1 className="mt-3 text-3xl">Trigger RCR Incident</h1>
        <p className="mt-2 text-sm text-foreground/75">
          Calls backend POST /api/emergency and navigates to doctor and responder flows.
        </p>
      </section>

      <section className="panel p-5 space-y-3">
        <button
          type="button"
          onClick={() => {
            void triggerDemo();
          }}
          disabled={loading}
          className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
        >
          {loading ? "Triggering incident..." : "Trigger Demo Incident"}
        </button>

        {error ? (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p>
        ) : null}

        {incidentId ? (
          <div className="rounded-xl border border-line bg-white p-3 text-sm space-y-2">
            <p>
              Incident: <span className="font-semibold">{incidentId}</span>
            </p>
            <p>
              Assigned Doctor: <span className="font-semibold">{doctorId || "UNASSIGNED"}</span>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => router.push(`/emergency/briefing/${incidentId}`)}
                className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white"
              >
                Open Doctor Briefing
              </button>
              <button
                type="button"
                onClick={() => router.push(`/emergency/flash/${incidentId}`)}
                className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger"
              >
                Open Responder Flash
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
