import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message: "This route is deprecated. Use NextAuth signIn on /login.",
    },
    { status: 410 },
  );
}
