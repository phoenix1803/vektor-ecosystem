"use client";

import { useState } from "react";
import { BedDouble } from "lucide-react";
import { useEffect } from "react";
import { EmergencyAdmitModal } from "@/components/emergency-admit-modal";
import { toast } from "sonner";

interface Admission {
  id: string;
  patientName: string;
  uhid: string;
  ward: string;
  bedCode: string;
  status: string;
  admittedAt: string;
}

interface Bed {
  id: string;
  ward: string;
  bedCode: string;
  status: string;
  patientName: string | null;
}

interface Patient {
  id: string;
  uhid: string;
  fullName: string;
}

function admissionStatusChip(status: string) {
  const key = (status || "").toUpperCase();
  if (key === "ADMITTED") {
    return <span className="chip border-danger/30 bg-danger/10 text-danger">{status}</span>;
  }
  if (key === "TRANSFERRED") {
    return <span className="chip border-warning/30 bg-warning/10 text-warning">{status}</span>;
  }
  if (key === "DISCHARGED") {
    return <span className="chip border-success/30 bg-success/10 text-success">{status}</span>;
  }
  return <span className="chip border-line bg-surface-strong text-foreground/70">{status}</span>;
}

export default function Page() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [admissionsRes, bedsRes, patientsRes] = await Promise.all([
          fetch("/api/v1/ward/admissions"),
          fetch("/api/v1/ward/beds"),
          fetch("/api/v1/patients"),
        ]);

        if (admissionsRes.ok) setAdmissions(await admissionsRes.json());
        if (bedsRes.ok) setBeds(await bedsRes.json());
        if (patientsRes.ok) setPatients(await patientsRes.json());
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleEmergencyAdmit = async (patientId: string, bedId: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/ward/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          bedId,
          type: "EMERGENCY",
        }),
      });

      if (response.ok) {
        // Refresh data
        const admissionsRes = await fetch("/api/v1/ward/admissions");
        if (admissionsRes.ok) {
          setAdmissions(await admissionsRes.json());
        }

        setIsModalOpen(false);
        toast.success("Patient admitted successfully");
      } else {
        toast.error("Failed to admit patient");
      }
    } catch (error) {
      console.error("Error admitting patient:", error);
      toast.error("Error admitting patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <section className="panel p-6">
          <p className="text-foreground/60">Loading...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand">
            <BedDouble className="h-4 w-4" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em]">Inpatient and Ward</p>
              <h1 className="mt-3 text-3xl">Admissions Workflow</h1>
              <p className="mt-2 text-sm text-foreground/70">
                Admit, transfer, and discharge operations for IPD workflow.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            Emergency Admit
          </button>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">UHID</th>
              <th className="px-4 py-3">Ward</th>
              <th className="px-4 py-3">Bed</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((admission) => (
              <tr key={admission.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{admission.patientName}</td>
                <td className="px-4 py-3">{admission.uhid}</td>
                <td className="px-4 py-3">{admission.ward}</td>
                <td className="px-4 py-3">{admission.bedCode}</td>
                <td className="px-4 py-3">{admissionStatusChip(admission.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <EmergencyAdmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdmit={handleEmergencyAdmit}
        beds={beds}
        patients={patients}
        isLoading={isSubmitting}
      />
    </div>
  );
}