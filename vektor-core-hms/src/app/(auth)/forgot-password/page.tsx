import { AuthCard } from "@/components/auth/auth-card";

export default function ForgotPasswordPage() {
  return (
    <main className="soft-grid flex min-h-screen items-center px-4 py-10">
      <AuthCard title="Reset Access" subtitle="Send a secure recovery link to your registered email">
        <form className="space-y-4">
          <input
            type="email"
            required
            placeholder="Registered work email"
            className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
          />
          <button
            type="button"
            className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            Send Reset Link
          </button>
        </form>
      </AuthCard>
    </main>
  );
}
