import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <section className="panel mx-auto w-full max-w-md p-7">
      <h1 className="text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-foreground/70">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
