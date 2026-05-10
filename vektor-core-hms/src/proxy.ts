import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { Role } from "@prisma/client";
import { getAuthSecret } from "@/lib/auth-secret";
import { canAccessRoute } from "@/lib/rbac";

const protectedPaths = [
  "/portal",
  "/dashboard",
  "/emergency",
  "/patients",
  "/appointments",
  "/emr",
  "/lab",
  "/pharmacy",
  "/ward",
  "/billing",
  "/inventory",
  "/maintenance",
  "/hr",
  "/analytics",
  "/settings",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (process.env.NODE_ENV === "production" && forwardedProto === "http") {
    const secureUrl = request.nextUrl.clone();
    secureUrl.protocol = "https:";
    return NextResponse.redirect(secureUrl);
  }

  const token = await getToken({ req: request, secret: getAuthSecret() });
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (token.role as Role) || "HOSPITAL_ADMIN";
  if (!canAccessRoute(role, pathname)) {
    const deniedUrl = new URL("/access-denied", request.url);
    deniedUrl.searchParams.set("reason", "route-blocked");
    deniedUrl.searchParams.set("blocked", pathname);
    return NextResponse.redirect(deniedUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portal/:path*",
    "/emergency/:path*",
    "/patients/:path*",
    "/appointments/:path*",
    "/emr/:path*",
    "/lab/:path*",
    "/pharmacy/:path*",
    "/ward/:path*",
    "/billing/:path*",
    "/inventory/:path*",
    "/maintenance/:path*",
    "/hr/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
};
