'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardList,
  Clock3,
  FileText,
  Image as ImageIcon,
  LoaderCircle,
  Pill,
  ShieldAlert,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import { useIncident } from '@/app/context/incident-provider';
import { useIncidentRealtime } from '@/hooks/useIncidentRealtime';
import type { IncidentPayload } from '@/types/demoDataFromAgent';

type SoapSection = 'subjective' | 'objective' | 'assessment' | 'plan';

const AGENT_LABELS: Array<{ key: keyof IncidentPayload['agent_status']; label: string }> = [
  { key: 'verifier', label: 'Verifier' },
  { key: 'patient_id', label: 'Patient ID' },
  { key: 'hospital_finder', label: 'Hospital Finder' },
  { key: 'dispatch', label: 'Dispatch' },
  { key: 'comms', label: 'Communications' },
  { key: 'evac_router', label: 'Evac Router' },
];

function normalizeAgentStatus(status: string | undefined) {
  const value = (status || '').toLowerCase().trim();
  if (value === 'complete' || value === 'completed' || value === 'done' || value === 'success') {
    return 'complete' as const;
  }
  if (value === 'in_progress' || value === 'in progress' || value === 'running' || value === 'pending') {
    return 'in_progress' as const;
  }
  return 'idle' as const;
}

function BriefingUI({ incident }: { incident: IncidentPayload }) {
  const [soapNotes, setSoapNotes] = useState<Record<SoapSection, string>>({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });
  const [openSections, setOpenSections] = useState<Record<'ai' | 'soap', boolean>>({
    ai: true,
    soap: true,
  });
  const [confirmEscalate, setConfirmEscalate] = useState(false);

  const criticalItems = useMemo(() => {
    const items: Array<{ tone: 'danger' | 'brand' | 'warning'; label: string; value: string }> = [];

    (incident.patient?.allergies || []).forEach((entry) => {
      items.push({ tone: 'danger', label: 'Allergy', value: entry });
    });

    if (incident.patient?.blood_type) {
      items.push({ tone: 'brand', label: 'Blood Group', value: incident.patient.blood_type });
    }

    (incident.patient?.critical_flags || []).forEach((entry) => {
      items.push({ tone: 'warning', label: 'Critical', value: entry });
    });

    return items;
  }, [incident]);

  const vitals = useMemo(() => {
    const source = incident.patient?.vitals_history;
    return [
      { label: 'Blood Pressure', value: source?.last_bp || 'Not recorded' },
      { label: 'Blood Sugar', value: source?.last_sugar || 'Not recorded' },
      { label: 'Last Recorded', value: source?.last_recorded || 'Not recorded' },
      { label: 'Clinical State', value: incident.status || 'Under review' },
    ];
  }, [incident]);

  const aiSummary = `${incident.patient.name}, age ${incident.patient.age}, presents with ${incident.crisis.type.toLowerCase()} (${incident.crisis.subtype.toLowerCase()}). Priority concerns include ${incident.patient.critical_flags.length ? incident.patient.critical_flags.join(', ').toLowerCase() : 'no flagged conditions from current feed'}. Assigned consultant: ${incident.assigned_doctor.name} (${incident.assigned_doctor.specialty}). Ambulance ETA to ${incident.assigned_hospital.name} is ${incident.assigned_hospital.eta_ambulance}.`;

  return (
    <div className="space-y-6">
      {incident.patient.allergies.length > 0 ? (
        <section className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-danger" />
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-danger">Allergy Alert</p>
          </div>
          <p className="mt-1 text-sm font-semibold text-danger">
            Do not administer: {incident.patient.allergies.join(" | ")}
          </p>
        </section>
      ) : null}

      <section className="panel border-danger/30 bg-danger/5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-danger">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.15em]">Incoming Patient Briefing</p>
            </div>
            <h1 className="mt-3 text-3xl">Emergency Clinical Brief</h1>
            <p className="mt-2 text-sm text-foreground/75">
              Incident {incident.incident_id} · {incident.crisis.type} · {incident.crisis.subtype}
            </p>
          </div>
          <div className="panel border-danger/30 bg-white px-4 py-3 text-right">
            <p className="text-xs text-foreground/60">Ambulance ETA</p>
            <p className="mt-1 text-4xl font-semibold text-danger">{incident.assigned_hospital.eta_ambulance}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.08em] text-danger">Time to patient arrival</p>
          </div>
        </div>
      </section>

      <section className="panel p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground/80">
          <ShieldAlert className="h-4 w-4 text-warning" aria-hidden="true" />
          Critical Flags
        </div>
        <div className="flex flex-wrap gap-2">
          {criticalItems.length > 0 ? (
            criticalItems.map((item, idx) => {
              const toneClass =
                item.tone === 'danger'
                  ? 'border-danger/30 bg-danger/10 text-danger'
                  : item.tone === 'warning'
                    ? 'border-warning/40 bg-warning/10 text-warning'
                    : 'border-brand/30 bg-brand-soft text-brand';

              return (
                <span key={`${item.label}-${idx}`} className={`chip ${toneClass}`}>
                  {item.label}: {item.value}
                </span>
              );
            })
          ) : (
            <span className="text-sm text-foreground/60">No critical flags reported in this feed.</span>
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel p-5 xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <UserRound className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Patient Overview</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="text-xs text-foreground/60">Patient Name</p>
              <p className="mt-1 font-semibold">{incident.patient.name}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="text-xs text-foreground/60">Age</p>
              <p className="mt-1 font-semibold">{incident.patient.age}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="text-xs text-foreground/60">Patient ID</p>
              <p className="mt-1 font-semibold">{incident.patient.id}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="text-xs text-foreground/60">Location</p>
              <p className="mt-1 font-semibold">
                Floor {incident.location.floor}, Room {incident.location.room}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-line bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <Pill className="h-4 w-4 text-brand" aria-hidden="true" />
                <h3 className="text-sm font-semibold">Current Medications</h3>
              </div>
              <ul className="space-y-2 text-sm text-foreground/80">
                {incident.patient.medications.length > 0 ? (
                  incident.patient.medications.map((entry) => (
                    <li key={entry} className="rounded-md bg-background px-2 py-1">
                      {entry}
                    </li>
                  ))
                ) : (
                  <li className="text-foreground/60">No medications listed.</li>
                )}
              </ul>
            </div>

            <div className="rounded-xl border border-line bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-brand" aria-hidden="true" />
                <h3 className="text-sm font-semibold">Known Conditions</h3>
              </div>
              <ul className="space-y-2 text-sm text-foreground/80">
                {incident.patient.conditions.length > 0 ? (
                  incident.patient.conditions.map((entry) => (
                    <li key={entry} className="rounded-md bg-background px-2 py-1">
                      {entry}
                    </li>
                  ))
                ) : (
                  <li className="text-foreground/60">No conditions listed.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-line bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand" aria-hidden="true" />
              <h3 className="text-sm font-semibold">Latest Vitals</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {vitals.map((vital) => (
                <div key={vital.label} className="rounded-lg border border-line bg-background px-3 py-2">
                  <p className="text-xs text-foreground/60">{vital.label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground/90">{vital.value}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="space-y-4">
          <div className="panel p-5">
            <div className="mb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-brand" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Imaging</h2>
            </div>
            <div className="space-y-2">
              {incident.patient.imaging.length > 0 ? (
                incident.patient.imaging.map((item) => (
                  <div key={`${item.type}-${item.date}`} className="rounded-lg border border-line bg-white px-3 py-2">
                    <p className="text-sm font-medium text-foreground/85">{item.type}</p>
                    <p className="text-xs text-foreground/60">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-foreground/60">No imaging available.</p>
              )}
            </div>
          </div>

          <div className="panel p-5">
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-brand" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Hospital Assignment</h2>
            </div>
            <p className="text-sm font-semibold">{incident.assigned_hospital.name}</p>
            <p className="mt-1 text-xs text-foreground/70">Distance: {incident.assigned_hospital.distance}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-foreground/70">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              ETA: {incident.assigned_hospital.eta_ambulance}
            </p>
          </div>

          <div className="panel p-5">
            <div className="mb-3 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-brand" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Assigned Clinician</h2>
            </div>
            <p className="text-sm font-semibold">{incident.assigned_doctor.name}</p>
            <p className="mt-1 text-xs text-foreground/70">{incident.assigned_doctor.specialty}</p>
            <span
              className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                incident.assigned_doctor.available
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-warning/40 bg-warning/10 text-warning'
              }`}
            >
              {incident.assigned_doctor.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </article>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-semibold">Pre-Arrival Preparation Checklist</h2>
        <div className="mt-4 space-y-2">
          {[
            "Defibrillator on standby (AED in Bay 2)",
            "IV access kit prepared",
            "Cardiac monitor connected",
            "Notify ICU duty nurse",
            "Alert pharmacy for anticoagulant",
          ].map((item, index) => (
            <label key={`${item}-${index}`} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-3 py-2 text-sm">
              <input type="checkbox" className="rounded" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <button
          type="button"
          onClick={() => setOpenSections((prev) => ({ ...prev, ai: !prev.ai }))}
          className="flex w-full items-center justify-between"
        >
          <span className="inline-flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-4 w-4 text-brand" aria-hidden="true" />
            AI Clinical Summary
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.ai ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
        {openSections.ai && <p className="mt-3 text-sm leading-6 text-foreground/80">{aiSummary}</p>}
      </section>

      <section className="panel p-5">
        <h2 className="mb-4 text-lg font-semibold">Agent Pipeline Status</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AGENT_LABELS.map((step) => {
            const state = normalizeAgentStatus(incident.agent_status[step.key]);
            return (
              <div key={step.key} className="rounded-xl border border-line bg-white px-3 py-2">
                <div className="flex items-center gap-2">
                  {state === 'complete' && <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />}
                  {state === 'in_progress' && <LoaderCircle className="h-4 w-4 animate-spin text-brand" aria-hidden="true" />}
                  {state === 'idle' && <Circle className="h-4 w-4 text-foreground/40" aria-hidden="true" />}
                  <p className="text-sm font-medium text-foreground/85">{step.label}</p>
                </div>
                <p className="mt-1 text-xs text-foreground/60">{incident.agent_status[step.key]}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel p-5">
        <button
          type="button"
          onClick={() => setOpenSections((prev) => ({ ...prev, soap: !prev.soap }))}
          className="flex w-full items-center justify-between"
        >
          <span className="inline-flex items-center gap-2 text-lg font-semibold">
            <ClipboardList className="h-4 w-4 text-brand" aria-hidden="true" />
            SOAP Notes
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.soap ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>

        {openSections.soap && (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {(
              [
                { key: 'subjective', label: 'Subjective' },
                { key: 'objective', label: 'Objective' },
                { key: 'assessment', label: 'Assessment' },
                { key: 'plan', label: 'Plan' },
              ] as Array<{ key: SoapSection; label: string }>
            ).map((field) => (
              <label key={field.key} className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-foreground/65">
                  {field.label}
                </span>
                <textarea
                  value={soapNotes[field.key]}
                  onChange={(event) =>
                    setSoapNotes((prev) => ({
                      ...prev,
                      [field.key]: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none transition focus:border-brand"
                  placeholder={`Enter ${field.label.toLowerCase()} details`}
                />
              </label>
            ))}
            <div className="lg:col-span-2 flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-strong"
              >
                Save Notes
              </button>
              <button
                type="button"
                onClick={() =>
                  setSoapNotes({
                    subjective: '',
                    objective: '',
                    assessment: '',
                    plan: '',
                  })
                }
                className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground/80 hover:bg-surface-strong"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Mark as Received
        </button>
        {confirmEscalate ? (
          <>
            <button
              type="button"
              onClick={() => setConfirmEscalate(false)}
              className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Confirm Escalation
            </button>
            <button
              type="button"
              onClick={() => setConfirmEscalate(false)}
              className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground/80 hover:bg-surface-strong"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmEscalate(true)}
            className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Escalate to ICU
          </button>
        )}
        <button
          type="button"
          className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground/80 hover:bg-surface-strong"
        >
          Defer
        </button>
      </section>
    </div>
  );
}

export default function BriefingPage() {
  const params = useParams<{ incident_id: string }>();
  const { data: session } = useSession();
  const { currentIncident, setIncidentFromPayload } = useIncident();
  const assignedDoctorId = currentIncident ? currentIncident.assigned_doctor.id : undefined;

  const realtime = useIncidentRealtime({
    role: 'doctor',
    doctorId: assignedDoctorId ?? session?.user.id,
    incidentId: params?.incident_id,
    enabled: Boolean(session?.user.id),
    onIncidentLoaded: setIncidentFromPayload,
  });

  const incident = realtime.incident ?? currentIncident;

  if (realtime.isLoading && !incident) {
    return (
      <section className="panel p-8 text-center">
        <h1 className="text-2xl">Emergency Clinical Brief</h1>
        <p className="mt-2 text-sm text-foreground/70">Loading incident data...</p>
      </section>
    );
  }

  if (!incident) {
    return (
      <section className="panel p-8 text-center">
        <h1 className="text-2xl">Emergency Clinical Brief</h1>
        <p className="mt-2 text-sm text-foreground/70">No active incident was found. Accept a patient from Emergency Alerts to open this briefing.</p>
      </section>
    );
  }

  return (
    <div className="space-y-3">
      <p className="chip border-line bg-white text-foreground/70">
        Realtime: {realtime.connectionState || 'idle'}
        {realtime.reconnectCount > 0 ? ` · Reconnected ${realtime.reconnectCount}x` : ''}
      </p>
      {realtime.error ? (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">{realtime.error}</p>
      ) : null}
      <BriefingUI incident={incident} />
    </div>
  );
}
