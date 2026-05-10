import type { Role } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-secret";
import type { PermissionAction, PermissionResource } from "@/lib/rbac";
import { canPerform } from "@/lib/rbac";

type ApiAuthOptions = {
  requireMfa?: boolean;
  disallowedRoles?: Role[];
};

type ApiAccessDecision = {
  allowed: boolean;
  status: number;
  reason: string;
};

export function evaluateApiAccess(
  role: Role | undefined,
  mfaVerified: boolean,
  resource: PermissionResource,
  action: PermissionAction,
  options?: ApiAuthOptions,
): ApiAccessDecision {
  if (!role) {
    return { allowed: false, status: 401, reason: "Authentication required" };
  }

  if (options?.disallowedRoles?.includes(role)) {
    return { allowed: false, status: 403, reason: "Role not allowed" };
  }

  if (options?.requireMfa && !mfaVerified) {
    return { allowed: false, status: 403, reason: "MFA verification required" };
  }

  if (!canPerform(role, resource, action)) {
    return { allowed: false, status: 403, reason: "Insufficient permissions" };
  }

  return { allowed: true, status: 200, reason: "ok" };
}

export async function requireApiPermission(
  request: NextRequest,
  resource: PermissionResource,
  action: PermissionAction,
  options?: ApiAuthOptions,
) {
  const token = await getToken({ req: request, secret: getAuthSecret() });
  const role = (token?.role as Role | undefined) ?? undefined;
  const mfaVerified = Boolean(token?.mfaVerified);

  const decision = evaluateApiAccess(role, mfaVerified, resource, action, options);
  if (!decision.allowed) {
    return {
      ok: false as const,
      response: NextResponse.json({ ok: false, message: decision.reason }, { status: decision.status }),
    };
  }

  return {
    ok: true as const,
    role: role as Role,
  };
}
