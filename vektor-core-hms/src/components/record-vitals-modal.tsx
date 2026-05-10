"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface RecordVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vitals: VitalsData) => void;
  patientName: string;
  isLoading?: boolean;
}

export interface VitalsData {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  spo2: number;
  temperature: number;
  weightKg?: number;
}

export function RecordVitalsModal({
  isOpen,
  onClose,
  onSubmit,
  patientName,
  isLoading = false,
}: RecordVitalsModalProps) {
  const [vitals, setVitals] = useState<VitalsData>({
    bloodPressureSystolic: 0,
    bloodPressureDiastolic: 0,
    heartRate: 0,
    spo2: 0,
    temperature: 0,
    weightKg: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(vitals);
    setVitals({
      bloodPressureSystolic: 0,
      bloodPressureDiastolic: 0,
      heartRate: 0,
      spo2: 0,
      temperature: 0,
      weightKg: undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Record Vitals</h2>
            <p className="mt-1 text-sm text-foreground/60">{patientName}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-surface-strong" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Blood Pressure */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="systolic" className="text-sm font-medium text-foreground/80">
                BP Systolic
              </label>
              <input
                id="systolic"
                type="number"
                min="0"
                max="250"
                value={vitals.bloodPressureSystolic}
                onChange={(e) => setVitals({ ...vitals, bloodPressureSystolic: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="120"
                required
              />
            </div>
            <div>
              <label htmlFor="diastolic" className="text-sm font-medium text-foreground/80">
                BP Diastolic
              </label>
              <input
                id="diastolic"
                type="number"
                min="0"
                max="150"
                value={vitals.bloodPressureDiastolic}
                onChange={(e) => setVitals({ ...vitals, bloodPressureDiastolic: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="80"
                required
              />
            </div>
          </div>

          {/* Heart Rate */}
          <div>
            <label htmlFor="heartRate" className="text-sm font-medium text-foreground/80">
              Heart Rate (bpm)
            </label>
            <input
              id="heartRate"
              type="number"
              min="0"
              max="200"
              value={vitals.heartRate}
              onChange={(e) => setVitals({ ...vitals, heartRate: parseInt(e.target.value) || 0 })}
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="72"
              required
            />
          </div>

          {/* SpO2 */}
          <div>
            <label htmlFor="spo2" className="text-sm font-medium text-foreground/80">
              SpO₂ (%)
            </label>
            <input
              id="spo2"
              type="number"
              min="0"
              max="100"
              value={vitals.spo2}
              onChange={(e) => setVitals({ ...vitals, spo2: parseInt(e.target.value) || 0 })}
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="98"
              required
            />
          </div>

          {/* Temperature */}
          <div>
            <label htmlFor="temperature" className="text-sm font-medium text-foreground/80">
              Temperature (°C)
            </label>
            <input
              id="temperature"
              type="number"
              step="0.1"
              min="35"
              max="45"
              value={vitals.temperature}
              onChange={(e) => setVitals({ ...vitals, temperature: parseFloat(e.target.value) || 0 })}
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="37.0"
              required
            />
          </div>

          {/* Weight (Optional) */}
          <div>
            <label htmlFor="weight" className="text-sm font-medium text-foreground/80">
              Weight (kg) - Optional
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              max="300"
              value={vitals.weightKg || ""}
              onChange={(e) =>
                setVitals({ ...vitals, weightKg: e.target.value ? parseFloat(e.target.value) : undefined })
              }
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="70"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-strong"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Vitals"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
