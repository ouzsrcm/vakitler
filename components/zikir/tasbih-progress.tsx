import { cx } from "@/utils/helper";

type Props = {
  count: number;
  target: number;
  complete: boolean;
};

export default function TasbihProgress({
  count,
  target,
  complete,
}: Props) {
  const pct = target > 0 ? Math.min(100, (count / target) * 100) : 0;

  return (
    <div className="w-full space-y-2">
      <div
        className={cx(
          "h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"
        )}
      >
        <div
          className={cx(
            "h-full rounded-full transition-all duration-200",
            complete ? "bg-emerald-500" : "bg-amber-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {count} / {target}
      </p>
    </div>
  );
}
