export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="panel overflow-hidden">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex gap-4 border-t border-line px-4 py-3 first:border-t-0">
          <div className="h-4 w-32 animate-pulse rounded bg-surface-strong" />
          <div className="h-4 w-24 animate-pulse rounded bg-surface-strong" />
          <div className="h-4 w-20 animate-pulse rounded bg-surface-strong" />
        </div>
      ))}
    </div>
  );
}
