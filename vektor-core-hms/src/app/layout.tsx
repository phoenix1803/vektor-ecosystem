import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";
import { IncidentProvider } from "./context/incident-provider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vektor Core | Hospital Operations Platform",
  description:
    "Vektor Core is a clean, high-performance hospital operations platform for modern care teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <IncidentProvider>
            {children}
            <Toaster position="top-right" richColors />
          </IncidentProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
