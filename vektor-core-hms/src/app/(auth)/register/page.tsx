import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";

export default function RegisterPage() {
  return (
    <main className="soft-grid flex min-h-screen items-center px-4 py-10">
      <AuthCard title="Hospital Onboarding" subtitle="Create your Vektor Core workspace in minutes">
        <form className="space-y-3">
          <input
            type="text"
            placeholder="Hospital name"
            className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Hospital type"
            className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="GST number"
            className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Preferred subdomain"
            className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
          />
          <button
            type="button"
            className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            Request Provisioning
          </button>
        </form>
        <p className="mt-4 text-xs text-foreground/70">
          Already onboarded? <Link href="/login" className="text-brand">Return to login</Link>
        </p>
      </AuthCard>
    </main>
  );
}
