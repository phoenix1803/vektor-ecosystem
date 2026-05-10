import type { ReactNode } from "react";
import { PortalNav } from "@/components/portal/portal-nav";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <PortalNav />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-5 md:px-8">{children}</main>
    </div>
  );
}
