import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// ─────────────────────────────────────────────────────────────────────────────
// TABLE SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export function TableSkeleton({
  rows = 8,
  columns = 5,
  showHeader = true,
  className,
}: TableSkeletonProps) {
  const columnWidths = [
    "w-32",
    "w-full",
    "w-24",
    "w-20",
    "w-28",
    "w-16",
    "w-36",
  ];

  return (
    <div
      className={cn("w-full overflow-hidden rounded-xl border border-slate-200 bg-white", className)}
      role="status"
      aria-label="Loading table data"
      aria-busy="true"
    >
      {/* Header */}
      {showHeader && (
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 bg-slate-50">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn("h-3.5", columnWidths[i % columnWidths.length])}
            />
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-4 px-4 py-3.5">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton
                key={colIdx}
                className={cn(
                  "h-4",
                  columnWidths[colIdx % columnWidths.length],
                  rowIdx % 3 === 1 && "opacity-60",
                  rowIdx % 5 === 4 && "opacity-40"
                )}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
        <Skeleton className="h-3.5 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded" />
          <Skeleton className="h-7 w-7 rounded" />
          <Skeleton className="h-7 w-7 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export interface CardSkeletonProps {
  count?: number;
  variant?: "stat" | "content" | "list-item";
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-11 w-11 rounded-xl" />
      </div>
    </div>
  );
}

function ContentCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="ml-auto h-3 w-16" />
      </div>
    </div>
  );
}

function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 last:border-0 animate-pulse">
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

export function CardSkeleton({
  count = 4,
  variant = "stat",
  columns = 4,
  className,
}: CardSkeletonProps) {
  const gridCols: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  if (variant === "list-item") {
    return (
      <div
        className={cn("rounded-xl border border-slate-200 bg-white overflow-hidden", className)}
        role="status"
        aria-label="Loading"
        aria-busy="true"
      >
        {Array.from({ length: count }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("grid gap-4", gridCols[columns], className)}
      role="status"
      aria-label="Loading cards"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) =>
        variant === "stat" ? (
          <StatCardSkeleton key={i} />
        ) : (
          <ContentCardSkeleton key={i} />
        )
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIST SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export interface ListSkeletonProps {
  rows?: number;
  showAvatar?: boolean;
  showActions?: boolean;
  className?: string;
}

export function ListSkeleton({
  rows = 6,
  showAvatar = true,
  showActions = true,
  className,
}: ListSkeletonProps) {
  return (
    <div
      className={cn("space-y-2", className)}
      role="status"
      aria-label="Loading list"
      aria-busy="true"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-3 animate-pulse",
            i % 2 === 1 && "opacity-75"
          )}
        >
          {showAvatar && (
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          )}
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton className={cn("h-3.5", i % 3 === 0 ? "w-3/4" : i % 3 === 1 ? "w-1/2" : "w-2/3")} />
            <Skeleton className="h-3 w-1/3" />
          </div>
          {showActions && (
            <div className="flex items-center gap-1.5 shrink-0">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-7 w-7 rounded" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE SKELETON (full page loading state)
// ─────────────────────────────────────────────────────────────────────────────

export function PageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading page" aria-busy="true">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Stat cards */}
      <CardSkeleton count={4} variant="stat" columns={4} />

      {/* Table */}
      <TableSkeleton rows={6} columns={5} />
    </div>
  );
}
