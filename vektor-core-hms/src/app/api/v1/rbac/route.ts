import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { rolePolicies } from "@/lib/rbac";

export async function GET() {
  return NextResponse.json({ data: rolePolicies });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const role = String(payload.role || "").toUpperCase() as Role;
  const policy = rolePolicies.find((entry) => entry.role === role);

  if (!policy) {
    return NextResponse.json({ ok: false, message: "Unknown role" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, policy });
}
