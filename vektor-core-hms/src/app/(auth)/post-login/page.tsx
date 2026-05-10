import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";

export default async function PostLoginRedirectPage() {
  const session = await getServerSession(authOptions);
  const landingPath = session?.landingPath || "/dashboard";
  redirect(landingPath);
}

