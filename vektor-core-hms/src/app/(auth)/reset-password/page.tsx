import { AuthCard } from "@/components/auth/auth-card";

export default function ResetPasswordPage() {
  return (
    <main className="soft-grid flex min-h-screen items-center px-4 py-10">
      <AuthCard title="Set New Password" subtitle="Choose a strong password to complete recovery">
        <form className="space-y-4">
          <input
            type="password"
            required
            minLength={8}
            placeholder="New password"
            className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Confirm password"
            className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
          />
          <button
            type="button"
            className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            Update Password
          </button>
        </form>
      </AuthCard>
    </main>
  );
}
