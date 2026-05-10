import { cx } from "@/utils/helper";

/** One ayah placeholder: 3 Arabic lines + 2 meal lines (pulse). */
function AyahSkeletonBlock() {
  return (
    <div
      className={cx(
        "border-b border-emerald-100 py-5 last:border-0 dark:border-zinc-700/60",
        "animate-pulse"
      )}
    >
      <div className="mb-3 h-6 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50" />
      <div className="mb-2 ms-auto h-7 w-full rounded-lg bg-emerald-100/90 dark:bg-zinc-700/90" />
      <div className="mb-2 ms-auto h-7 w-[94%] rounded-lg bg-emerald-100/90 dark:bg-zinc-700/90" />
      <div className="mb-2 ms-auto h-7 w-[88%] rounded-lg bg-emerald-100/90 dark:bg-zinc-700/90" />
      <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-700" />
      <div className="mt-2 h-3 w-4/5 rounded bg-zinc-100 dark:bg-zinc-700" />
    </div>
  );
}

export default function AyahSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-0" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <AyahSkeletonBlock key={i} />
      ))}
    </div>
  );
}
