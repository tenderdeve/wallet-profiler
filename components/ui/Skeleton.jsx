/**
 * Skeleton loader primitives.
 * Use these during data fetch — never show blank space or spinners alone.
 */

/** Single skeleton line — width and height are Tailwind classes */
export function SkeletonLine({ className = 'h-4 w-full' }) {
  return <div className={`animate-pulse rounded bg-gray-800 ${className}`} />;
}

/** Skeleton block for chart placeholders */
export function SkeletonBlock({ className = 'h-48 w-full' }) {
  return <div className={`animate-pulse rounded-xl bg-gray-800 ${className}`} />;
}

/** Skeleton for a stat card (icon + two lines) */
export function SkeletonStatCard() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-800 bg-gray-900 p-4">
      <SkeletonLine className="h-3 w-1/2" />
      <SkeletonLine className="h-6 w-3/4" />
    </div>
  );
}

/** Skeleton for a single activity feed item */
export function SkeletonFeedItem() {
  return (
    <div className="flex items-center gap-4 border-b border-gray-800 py-4">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-800 shrink-0" />
      <div className="flex flex-1 flex-col gap-2">
        <SkeletonLine className="h-4 w-2/3" />
        <SkeletonLine className="h-3 w-1/3" />
      </div>
      <SkeletonLine className="h-4 w-16 shrink-0" />
    </div>
  );
}
