"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Department {
  id: string;
  name: string;
}

interface BookFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentBookingData) => void;
  departments: Department[];
  isLoading?: boolean;
}

export interface AppointmentBookingData {
  departmentId: string;
  preferredDate: string;
  reason: string;
}

export function BookFollowUpModal({
  isOpen,
  onClose,
  onSubmit,
  departments,
  isLoading = false,
}: BookFollowUpModalProps) {
  const [data, setData] = useState<AppointmentBookingData>({
    departmentId: "",
    preferredDate: "",
    reason: "Post-emergency follow-up",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.departmentId || !data.preferredDate) {
      alert("Please fill all required fields");
      return;
    }
    onSubmit(data);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Book Follow-up Appointment</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-surface-strong" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Department */}
          <div>
            <label htmlFor="department" className="text-sm font-medium text-foreground/80">
              Department
            </label>
            <select
              id="department"
              value={data.departmentId}
              onChange={(e) => setData({ ...data, departmentId: e.target.value })}
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              required
            >
              <option value="">-- Select department --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Date */}
          <div>
            <label htmlFor="date" className="text-sm font-medium text-foreground/80">
              Preferred Date
            </label>
            <input
              id="date"
              type="date"
              min={minDate}
              value={data.preferredDate}
              onChange={(e) => setData({ ...data, preferredDate: e.target.value })}
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="text-sm font-medium text-foreground/80">
              Reason for Visit
            </label>
            <textarea
              id="reason"
              value={data.reason}
              onChange={(e) => setData({ ...data, reason: e.target.value })}
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              rows={3}
              placeholder="Post-emergency follow-up"
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
              {isLoading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
