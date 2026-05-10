import { parseIncidentPayload, type IncidentPayload } from "@/types/demoDataFromAgent";

export type BackendIncidentPayload = {
  incident_id?: string;
  incidentId?: string;
  status?: string;
  location?: {
    venue?: string;
    room?: string;
    floor?: string;
    gps?: { lat?: number; lng?: number };
  };
  crisis?: {
    type?: string;
    subtype?: string;
    severity?: string;
    verified?: boolean;
  };
  patient?: {
    id?: string;
    uhid?: string;
    name?: string;
    age?: number | null;
    blood_type?: string;
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    critical_flags?: string[];
    vitals_history?: {
      last_bp?: string;
      last_sugar?: string;
      last_spo2?: number;
      last_heart_rate?: number;
      last_recorded?: string;
    };
    imaging?: Array<{ type?: string; date?: string; url?: string }>;
  };
  assigned_hospital?: {
    id?: string;
    name?: string;
    distance?: string;
    eta_ambulance?: string;
  };
  assignedHospital?: {
    id?: string;
    name?: string;
    distance?: string;
    etaAmbulance?: string;
  };
  assigned_doctor?: {
    id?: string;
    name?: string;
    specialty?: string;
    available?: boolean;
  };
  assignedDoctor?: {
    id?: string;
    name?: string;
    specialty?: string;
    available?: boolean;
  };
  responder?: {
    route?: string;
    instructions?: string;
  };
  agent_status?: {
    verifier?: string;
    patient_id?: string;
    hospital_finder?: string;
    dispatch?: string;
    comms?: string;
    evac_router?: string;
  };
  agentStatus?: {
    verifier?: string;
    patient_id?: string;
    hospital_finder?: string;
    dispatch?: string;
    comms?: string;
    evac_router?: string;
  };
};

export type IncidentEventPayload = {
  incident_id?: string;
  incidentId?: string;
  doctorId?: string;
  status?: string;
};

export function extractIncidentId(input: unknown, fallback?: string): string | null {
  if (typeof input === "object" && input !== null) {
    const value = input as Record<string, unknown>;
    const direct = value.incident_id ?? value.incidentId;
    if (typeof direct === "string" && direct.length > 0) {
      return direct;
    }
  }

  return fallback ?? null;
}

export function normalizeIncident(input: unknown): IncidentPayload {
  const source = (input || {}) as BackendIncidentPayload;

  const incidentId = source.incident_id || source.incidentId || "INC-UNKNOWN";
  const patient = source.patient || {};
  const assignedHospital = source.assigned_hospital || source.assignedHospital || {};
  const assignedDoctor = source.assigned_doctor || source.assignedDoctor || {};
  const agentStatus = source.agent_status || source.agentStatus || {};
  const vitals = patient.vitals_history || {};

  const synthesizedBp =
    vitals.last_bp ||
    ((vitals.last_spo2 || vitals.last_heart_rate)
      ? `SpO2 ${vitals.last_spo2 ?? "N/A"}% | HR ${vitals.last_heart_rate ?? "N/A"}`
      : "Not recorded");

  return parseIncidentPayload({
    incident_id: incidentId,
    status: source.status || "active",
    location: {
      venue: source.location?.venue || "Unknown Venue",
      room: source.location?.room || "N/A",
      floor: source.location?.floor || "N/A",
      gps: {
        lat: source.location?.gps?.lat ?? 0,
        lng: source.location?.gps?.lng ?? 0,
      },
    },
    crisis: {
      type: source.crisis?.type || "medical",
      subtype: source.crisis?.subtype || "unknown",
      severity: source.crisis?.severity || "unknown",
      verified: source.crisis?.verified ?? true,
    },
    patient: {
      id: patient.uhid || patient.id || "PAT-UNKNOWN",
      name: patient.name || "Unknown Patient",
      age: typeof patient.age === "number" ? patient.age : 0,
      blood_type: patient.blood_type || "Unknown",
      allergies: patient.allergies || [],
      medications: patient.medications || [],
      conditions: patient.conditions || [],
      critical_flags: patient.critical_flags || [],
      vitals_history: {
        last_bp: synthesizedBp,
        last_sugar: vitals.last_sugar || "Not recorded",
        last_recorded: vitals.last_recorded || "Not recorded",
      },
      imaging: (patient.imaging || []).map((item) => ({
        type: item.type || "Image",
        date: item.date || new Date().toISOString(),
        url: item.url || "",
      })),
    },
    assigned_hospital: {
      id: assignedHospital.id || "UNASSIGNED",
      name: assignedHospital.name || "Unassigned Hospital",
      distance: assignedHospital.distance || "Unknown",
      eta_ambulance: assignedHospital.eta_ambulance || assignedHospital.etaAmbulance || "Unknown",
    },
    assigned_doctor: {
      id: assignedDoctor.id || "UNASSIGNED",
      name: assignedDoctor.name || "Doctor unavailable",
      specialty: assignedDoctor.specialty || "General",
      available: assignedDoctor.available ?? false,
    },
    responder: {
      route: source.responder?.route || "Follow nearest safe path",
      instructions: source.responder?.instructions || "Await dispatcher instructions",
    },
    agent_status: {
      verifier: agentStatus.verifier || "pending",
      patient_id: agentStatus.patient_id || "pending",
      hospital_finder: agentStatus.hospital_finder || "pending",
      dispatch: agentStatus.dispatch || "pending",
      comms: agentStatus.comms || "pending",
      evac_router: agentStatus.evac_router || "pending",
    },
  });
}
