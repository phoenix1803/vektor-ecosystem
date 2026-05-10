import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    callbackUrl?: string;
    error?: string;
  }>;
};

function getLoginErrorMessage(errorCode?: string) {
  if (errorCode === "CredentialsSignin") {
    return "Invalid login details. If MFA is enabled, enter your OTP as well.";
  }

  if (errorCode === "AccessDenied") {
    return "Access denied for this account.";
  }

  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next || params.callbackUrl || "/post-login";
  const initialError = getLoginErrorMessage(params.error);

  return (
    <main className="soft-grid flex min-h-screen items-center px-4 py-10">
      <AuthCard
        title="Hospital Staff Login"
        subtitle="Authenticate with secure server session and role-based access"
      >
        <LoginForm nextPath={nextPath} initialError={initialError} />
      </AuthCard>
    </main>
  );
}