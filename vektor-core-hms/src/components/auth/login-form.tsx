"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { DEMO_LOGIN } from "@/lib/demo-credentials";

type LoginFormProps = {
  nextPath: string;
  initialError?: string;
};

export function LoginForm({ nextPath, initialError }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hint = useMemo(() => `Demo access: ${DEMO_LOGIN.email} / ${DEMO_LOGIN.password}`, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsSubmitting(true);
    setError(null);

    try {
      const signInPromise = signIn("credentials", {
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        otp: String(formData.get("otp") || ""),
        redirect: false,
        callbackUrl: nextPath,
      });
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("SIGN_IN_TIMEOUT")), 12000);
      });

      const result = await Promise.race([signInPromise, timeoutPromise]);

      if (!result || result.error) {
        setError("Invalid login. Use the demo credentials shown below.");
        return;
      }

      router.push(result.url || nextPath);
      router.refresh();
    } catch {
      setError("Sign-in timed out or failed. Retry, and include OTP 000000 for admin demo login.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          required
          defaultValue={DEMO_LOGIN.email}
          className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          defaultValue={DEMO_LOGIN.password}
          className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm font-medium">
        OTP (if MFA enforced)
        <input
          name="otp"
          type="text"
          inputMode="numeric"
          placeholder="000000"
          defaultValue="000000"
          className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-strong"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="flex items-center justify-between text-xs text-foreground/70">
        <Link href="/forgot-password" className="hover:text-brand">
          Forgot password
        </Link>
        <Link href="/register" className="hover:text-brand">
          Onboard hospital
        </Link>
      </div>

      <div className="rounded-xl border border-brand/30 bg-brand-soft p-3 text-xs text-brand-strong">
        {hint}
      </div>
    </form>
  );
}
