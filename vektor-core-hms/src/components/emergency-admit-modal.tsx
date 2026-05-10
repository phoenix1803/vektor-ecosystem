"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";

type Patient = { id: string; uhid: string; fullName: string };
type Bed = { id: string; ward: string; bedCode: string; status: string };

interface EmergencyAdmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdmit: (patientId: string, bedId: string) => void;
  beds: Bed[];
  patients: Patient[];
  isLoading?: boolean;
}

export function EmergencyAdmitModal({
  isOpen,
  onClose,
  onAdmit,
  beds,
  patients,
  isLoading = false,
}: EmergencyAdmitModalProps) {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedBed, setSelectedBed] = useState<string>("");
  const [searchPatient, setSearchPatient] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  const filteredPatients = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchPatient.toLowerCase()) ||
      p.uhid.toLowerCase().includes(searchPatient.toLowerCase()),
  );

  const availableBeds = beds.filter((bed) => bed.status === "Vacant");

  const handleAdmit = () => {
    if (!selectedPatient || !selectedBed) {
      alert("Please select both patient and bed");
      return;
    }
    onAdmit(selectedPatient, selectedBed);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Emergency Admission</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-surface-strong"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Patient Search */}
          <div>
            <label className="text-sm font-medium text-foreground/80">Select Patient</label>
            <div className="relative mt-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                <input
                  type="text"
                  placeholder="Search by name or UHID"
                  value={searchPatient}
                  onChange={(e) => {
                    setSearchPatient(e.target.value);
                    setShowPatientDropdown(true);
                  }}
                  onFocus={() => setShowPatientDropdown(true)}
                  className="w-full rounded-xl border border-line bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              {/* Patient Dropdown */}
              {showPatientDropdown && searchPatient && (
                <div className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-line bg-white">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatient(patient.id);
                          setSearchPatient(patient.fullName);
                          setShowPatientDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-surface-strong"
                      >
                        <div className="font-medium">{patient.fullName}</div>
                        <div className="text-xs text-foreground/60">{patient.uhid}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-sm text-foreground/60">
                      No patients found
                    </div>
                  )}
                </div>
              )}

              {selectedPatient && (
                <div className="mt-2 rounded-lg bg-brand/10 px-3 py-2 text-sm">
                  <span className="font-medium text-brand">
                    {patients.find((p) => p.id === selectedPatient)?.fullName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bed Selection */}
          <div>
            <label htmlFor="bed-select" className="text-sm font-medium text-foreground/80">
              Select Bed
            </label>
            <select
              id="bed-select"
              value={selectedBed}
              onChange={(e) => setSelectedBed(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="">-- Choose vacant bed --</option>
              {availableBeds.map((bed) => (
                <option key={bed.id} value={bed.id}>
                  {bed.ward} • Bed {bed.bedCode}
                </option>
              ))}
            </select>

            {availableBeds.length === 0 && (
              <p className="mt-2 text-xs text-danger">No vacant beds available</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-strong"
            >
              Cancel
            </button>
            <button
              onClick={handleAdmit}
              disabled={isLoading || !selectedPatient || !selectedBed}
              className="flex-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isLoading ? "Admitting..." : "Confirm Admission"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
