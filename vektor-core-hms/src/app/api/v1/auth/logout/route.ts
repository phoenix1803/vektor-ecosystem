import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message: "This route is deprecated. Use NextAuth signOut on the client.",
    },
    { status: 410 },
  );
}
