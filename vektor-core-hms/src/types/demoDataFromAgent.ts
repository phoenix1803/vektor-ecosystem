
import { z } from "zod";

const imagingSchema = z.object({
    type: z.string(),
    date: z.string(),
    url: z.string(),
});

const vitalsHistorySchema = z.object({
    last_bp: z.string(),
    last_sugar: z.string(),
    last_recorded: z.string(),
});

export const incidentPayloadSchema = z.object({
    incident_id: z.string(),
    status: z.string(),
    location: z.object({
        venue: z.string(),
        room: z.string(),
        floor: z.string(),
        gps: z.object({
            lat: z.number(),
            lng: z.number(),
        }),
    }),
    crisis: z.object({
        type: z.string(),
        subtype: z.string(),
        severity: z.string(),
        verified: z.boolean(),
    }),
    patient: z.object({
        id: z.string(),
        name: z.string(),
        age: z.number(),
        blood_type: z.string(),
        allergies: z.array(z.string()),
        medications: z.array(z.string()),
        conditions: z.array(z.string()),
        critical_flags: z.array(z.string()),
        vitals_history: vitalsHistorySchema,
        imaging: z.array(imagingSchema),
    }),
    assigned_hospital: z.object({
        id: z.string(),
        name: z.string(),
        distance: z.string(),
        eta_ambulance: z.string(),
    }),
    assigned_doctor: z.object({
        id: z.string(),
        name: z.string(),
        specialty: z.string(),
        available: z.boolean(),
    }),
    responder: z.object({
        route: z.string(),
        instructions: z.string(),
    }),
    agent_status: z.object({
        verifier: z.string(),
        patient_id: z.string(),
        hospital_finder: z.string(),
        dispatch: z.string(),
        comms: z.string(),
        evac_router: z.string(),
    }),
});

export type IncidentPayload = z.infer<typeof incidentPayloadSchema>;

export function parseIncidentPayload(input: unknown): IncidentPayload {
    return incidentPayloadSchema.parse(input);
}







