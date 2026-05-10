import { MessageSquareText } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { listPortalMessages } from "@/lib/hms-data";

export default async function PortalMessagesPage() {
  const session = await getServerSession(authOptions);
  const messages = await listPortalMessages(session?.user.patientUhid || "UHID-12091");

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand"><MessageSquareText className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.15em]">Messages</p></div>
        <h1 className="mt-3 text-3xl">Doctor chat and care updates</h1>
      </section>

      <section className="space-y-3">
        {messages.map((message: (typeof messages)[number]) => (
          <article key={message.id} className="panel p-4 text-sm">
            <p className="font-semibold">{message.senderName}</p>
            <p className="mt-1 text-foreground/70">{message.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
