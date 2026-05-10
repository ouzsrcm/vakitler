import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { cx } from "@/utils/helper";

export default function WordStatsHeader({
  total,
  learned,
  className,
}: {
  total: number;
  learned: number;
  className?: string;
}) {
  const { t } = useTranslation("learn");
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <div className={cx("flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            <span aria-hidden className="mr-1.5">
              🔤
            </span>
            {t("words.bankTitle")}
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {t("words.statsLine", { total, learned })}
          </p>
        </div>
        <Link
          href="/learn/words/practice"
          className="shrink-0 rounded-full bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-500"
        >
          {t("words.practiceCta")}
        </Link>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full bg-violet-500 transition-[width] duration-500 dark:bg-violet-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">
        %{pct}
      </p>
    </div>
  );
}
