"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CheckCircle2, Clock3, Hospital, ShieldAlert, Siren, Stethoscope } from "lucide-react";
import { PatientEmergencySummary } from "@/components/portal/patient-emergency-summary";
import { useIncident } from "@/app/context/incident-provider";
import { useIncidentRealtime } from "@/hooks/useIncidentRealtime";

export default function PortalEmergencyPage() {
  const { data: session } = useSession();
  const { currentIncident, setIncidentFromPayload } = useIncident();
  const [sending, setSending] = useState(false);
  const [sosPayload, setSosPayload] = useState<{
    sentAt: string;
    gps: { lat: number; lng: number } | null;
    summary: string;
  } | null>(null);
  const [sosError, setSosError] = useState<string | null>(null);

  const patientUhid = session?.user.patientUhid;
  const incidentMatchesPatient =
    Boolean(patientUhid) && Boolean(currentIncident) && (currentIncident?.patient?.id === patientUhid);
  const isEmergencyActive = Boolean(currentIncident) && currentIncident?.status === "active" && incidentMatchesPatient;

  const realtime = useIncidentRealtime({
    role: "patient",
    patientUhid,
    incidentId: currentIncident?.incident_id,
    enabled: Boolean(patientUhid),
    onIncidentLoaded: setIncidentFromPayload,
  });

  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!isEmergencyActive) return;
    const id = window.setInterval(() => setTick((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [isEmergencyActive]);

  const etaCountdown = useMemo(() => {
    void tick;
    const eta = currentIncident?.assigned_hospital?.eta_ambulance;
    if (!eta) return null;
    const match = String(eta).match(/(\d+)/);
    if (!match) return eta;
    const minutes = Number(match[1]);
    if (!Number.isFinite(minutes)) return eta;
    const remainingSeconds = Math.max(0, minutes * 60 - tick);
    const mm = Math.floor(remainingSeconds / 60);
    const ss = remainingSeconds % 60;
    return `${mm}:${String(ss).padStart(2, "0")}`;
  }, [currentIncident?.assigned_hospital?.eta_ambulance, tick]);

  const agentDots = useMemo(() => {
    const status = currentIncident?.agent_status;
    if (!status) return [];
    return [
      { key: "verifier", label: "Verifier", value: status.verifier },
      { key: "patient_id", label: "Patient ID", value: status.patient_id },
      { key: "hospital_finder", label: "Hospital", value: status.hospital_finder },
      { key: "dispatch", label: "Dispatch", value: status.dispatch },
      { key: "comms", label: "Comms", value: status.comms },
      { key: "evac_router", label: "Router", value: status.evac_router },
    ].map((item) => {
      const value = String(item.value || "").toLowerCase();
      const complete = value === "complete" || value === "completed" || value === "done" || value === "success";
      return { ...item, complete };
    });
  }, [currentIncident?.agent_status]);

  const sendSos = () => {
    const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

    setSending(true);
    setSosError(null);

    const finish = async (gps: { lat: number; lng: number } | null) => {
      const summary = currentIncident
        ? `${currentIncident.patient.name} | Blood ${currentIncident.patient.blood_type} | Allergies: ${
            currentIncident.patient.allergies.join(", ") || "None"
          } | Conditions: ${currentIncident.patient.conditions.join(", ") || "None"}`
        : "No active incident medical summary available";

      try {
        const response = await fetch(`${backendBaseUrl.replace(/\/$/, "")}/api/emergency`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "portal",
            timestamp: new Date().toISOString(),
            idempotency_key: `portal-${Date.now()}`,
            location: {
              lat: gps?.lat ?? currentIncident?.location.gps.lat ?? 0,
              lng: gps?.lng ?? currentIncident?.location.gps.lng ?? 0,
            },
            patient: {
              uhid: patientUhid || currentIncident?.patient.id || "UNKNOWN-UHID",
              name: currentIncident?.patient.name || session?.user.name || "Unknown Patient",
              spo2: 92,
              heart_rate: 118,
              symptoms: ["Emergency SOS triggered"],
              blood_type: currentIncident?.patient.blood_type,
              allergies: currentIncident?.patient.allergies || [],
              medications: currentIncident?.patient.medications || [],
              conditions: currentIncident?.patient.conditions || [],
              critical_flags: currentIncident?.patient.critical_flags || [],
              imaging: currentIncident?.patient.imaging || [],
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`SOS trigger failed: ${response.status}`);
        }

        const payload = await response.json();
        const incidentId = payload?.incident_id;

        setSosPayload({
          sentAt: new Date().toISOString(),
          gps,
          summary: incidentId ? `${summary} | Incident ${incidentId}` : summary,
        });
      } catch (error) {
        setSosError(error instanceof Error ? error.message : "SOS trigger failed");
      }

      setSending(false);
    };

    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => finish({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => finish(null),
        { enableHighAccuracy: true, timeout: 5000 }
      );
      return;
    }

    void finish(null);
  };

  return (
    <div className="space-y-5">
      <section className="panel border-danger/30 bg-danger/5 p-6">
        <div className="flex items-center gap-2 text-danger"><ShieldAlert className="h-5 w-5" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Emergency SOS</p></div>
        <h1 className="mt-3 text-3xl">One-touch emergency contact</h1>
        <p className="mt-2 text-sm text-foreground/75">This triggers emergency workflow with GPS and your latest medical summary for faster triage.</p>
      </section>

      {isEmergencyActive ? (
        <section className="panel border-success/30 bg-success/10 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.15em]">Emergency Response Initiated</p>
              </div>
              <h2 className="mt-3 text-2xl">Help is dispatched. Stay calm.</h2>
              <p className="mt-2 text-sm text-foreground/75">
                Your medical summary has been shared with Dr. {currentIncident?.assigned_doctor?.name || "assigned clinician"}.
              </p>
            </div>
            <span className="chip border-success/30 bg-white text-success">
              Live · {realtime.connectionState || "idle"}
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-line bg-white p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                <Hospital className="h-4 w-4 text-brand" aria-hidden="true" />
                {currentIncident?.assigned_hospital?.name || "Assigned hospital"}
              </div>
              <p className="mt-1 text-foreground/70">
                Distance: {currentIncident?.assigned_hospital?.distance || "Updating"}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                <Stethoscope className="h-4 w-4 text-brand" aria-hidden="true" />
                {currentIncident?.assigned_doctor?.name || "Assigned doctor"}
              </div>
              <p className="mt-1 text-foreground/70">
                Specialty: {currentIncident?.assigned_doctor?.specialty || "General"}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white p-4 text-sm md:col-span-2">
              <div className="flex items-center gap-2 font-semibold">
                <Clock3 className="h-4 w-4 text-brand" aria-hidden="true" />
                Ambulance ETA
              </div>
              <p className="mt-1 text-2xl font-semibold text-success">{etaCountdown ?? currentIncident?.assigned_hospital?.eta_ambulance}</p>
              <p className="mt-1 text-xs text-foreground/60">Countdown updates live.</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-white p-4">
            <p className="text-sm font-semibold">Agent status</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {agentDots.map((dot) => (
                <span
                  key={dot.key}
                  className={`chip border ${dot.complete ? "border-success/30 bg-success/10 text-success" : "border-line bg-background text-foreground/70"}`}
                >
                  {dot.label}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="panel p-5">
            <div className="relative flex items-center justify-center py-10">
              <span className="absolute h-44 w-44 animate-ping rounded-full bg-danger/10" style={{ animationDuration: "2s" }} />
              <span className="absolute h-36 w-36 animate-ping rounded-full bg-danger/15" style={{ animationDuration: "1.5s" }} />
              <button
                onClick={() => {
                  void sendSos();
                }}
                disabled={sending}
                className="relative h-28 w-28 rounded-full bg-danger text-base font-bold text-white shadow-lg transition-transform hover:bg-danger/90 active:scale-95 disabled:opacity-70"
              >
                {sending ? "Sending..." : "SOS"}
              </button>
            </div>

            <div className="mt-1 space-y-2 text-sm">
              {[
                { step: "1", text: "Location detected via GPS" },
                { step: "2", text: "Medical summary transmitted" },
                { step: "3", text: "AI pipeline dispatches help (about 2.5s)" },
                { step: "4", text: "Doctor briefed before you arrive" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3 text-foreground/70">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">{item.step}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-2 rounded-2xl border border-line bg-white p-4">
              <p className="text-sm font-semibold">Your critical medical summary</p>
              <p className="mt-1 text-xs text-foreground/60">This information will be shared with responders.</p>
              <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                <p className="rounded-xl border border-line bg-background px-3 py-2">
                  <span className="text-foreground/60">Blood type:</span> {currentIncident?.patient?.blood_type || "Unknown"}
                </p>
                <p className="rounded-xl border border-line bg-background px-3 py-2">
                  <span className="text-foreground/60">Allergies:</span>{" "}
                  {(currentIncident?.patient?.allergies || []).join(", ") || "None listed"}
                </p>
                <p className="rounded-xl border border-line bg-background px-3 py-2">
                  <span className="text-foreground/60">Medications:</span>{" "}
                  {(currentIncident?.patient?.medications || []).join(", ") || "None listed"}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-foreground/65">
              Realtime: {realtime.connectionState || "idle"}
              {realtime.reconnectCount > 0 ? ` · Reconnected ${realtime.reconnectCount}x` : ""}
            </p>

            {realtime.error || sosError ? (
              <p className="mt-3 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                {realtime.error || sosError}
              </p>
            ) : null}

            {sosPayload ? (
              <div className="mt-4 rounded-xl border border-line bg-white p-3 text-sm">
                <p className="font-semibold">Emergency payload sent</p>
                <p className="mt-1 text-foreground/70">Time: {new Date(sosPayload.sentAt).toLocaleString()}</p>
                <p className="mt-1 text-foreground/70">
                  GPS: {sosPayload.gps ? `${sosPayload.gps.lat.toFixed(5)}, ${sosPayload.gps.lng.toFixed(5)}` : "Unavailable"}
                </p>
                <p className="mt-1 text-foreground/70">Medical summary: {sosPayload.summary}</p>
              </div>
            ) : null}

            <div className="mt-4">
              <Link href="/emergency/demo-trigger" className="text-xs font-semibold text-brand hover:underline">
                Open local demo trigger utility
              </Link>
            </div>
          </section>

          <PatientEmergencySummary />
        </>
      )}

    </div>
  );
}
