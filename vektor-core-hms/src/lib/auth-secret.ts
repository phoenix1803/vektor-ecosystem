const FALLBACK_DEV_SECRET = "vektor-core-dev-secret";

export function getAuthSecret() {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || FALLBACK_DEV_SECRET;
}
