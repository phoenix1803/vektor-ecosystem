import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-secret";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: getAuthSecret() });

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    role: token.role || "HOSPITAL_ADMIN",
    hospital: token.hospitalName || "Apollo North Campus",
    mfaVerified: Boolean(token.mfaVerified),
  });
}
