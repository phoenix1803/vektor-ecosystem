import { cookies } from "next/headers";

export const SESSION_COOKIE = "vektor_session";

export function createSessionToken(email: string) {
  const stamp = Date.now().toString(36);
  return Buffer.from(`${email}:${stamp}`).toString("base64url");
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(SESSION_COOKIE)?.value);
}
