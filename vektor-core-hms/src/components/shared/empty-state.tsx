import type { LucideIcon } from "lucide-react";

export function EmptyState({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <div className="panel p-12 text-center">
      <Icon className="mx-auto h-12 w-12 text-foreground/20" />
      <p className="mt-4 text-lg font-semibold text-foreground/50">{title}</p>
      <p className="mt-1 text-sm text-foreground/40">{subtitle}</p>
    </div>
  );
}
