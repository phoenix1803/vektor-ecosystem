import { getServerSession } from "next-auth";
import type { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import type { PermissionAction, PermissionResource } from "@/lib/rbac";
import { canPerform } from "@/lib/rbac";

type PageAuthOptions = {
  requireMfa?: boolean;
  disallowedRoles?: Role[];
};

export async function requirePagePermission(
  resource: PermissionResource,
  action: PermissionAction,
  options?: PageAuthOptions,
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user?.role as Role | undefined) ?? undefined;

  if (!session || !role) {
    redirect("/login");
  }

  if (options?.disallowedRoles?.includes(role)) {
    redirect(`/access-denied?reason=route-blocked`);
  }

  if (options?.requireMfa && !session.user?.mfaVerified) {
    redirect("/access-denied?reason=mfa-required");
  }

  if (!canPerform(role, resource, action)) {
    redirect("/access-denied?reason=insufficient-permission");
  }

  return { session, role };
}
