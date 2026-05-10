import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { jsonOk } from "@/lib/mock";
import { listMyPatients } from "@/lib/hms-data";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const doctorUserId = session?.user?.id;
  const role = session?.user?.role;
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;

  if (!doctorUserId || role !== "DOCTOR") {
    return jsonOk({ data: [] });
  }

  const patients = await listMyPatients(doctorUserId, search);
  return jsonOk({ data: patients });
}
