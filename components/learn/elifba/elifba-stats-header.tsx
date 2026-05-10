import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { ARABIC_LETTERS } from "@/data/arabic-alphabet";

export default function ElifbaStatsHeader({
  learnedCount,
}: {
  learnedCount: number;
}) {
  const { t } = useTranslation("learn");
  const total = ARABIC_LETTERS.length;
  const pct = Math.round((learnedCount / total) * 100);

  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            <span className="font-arabic mr-1.5" dir="rtl">
              ﺍ
            </span>
            {t("elifba.overviewTitle")}
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {t("elifba.overviewSubtitle")}
          </p>
          <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {t("elifba.learnedLine", { learned: learnedCount, total })}
          </p>
        </div>
        <Link
          href="/learn/elifba/practice"
          className="shrink-0 rounded-full bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-500"
        >
          {t("elifba.practiceCta")}
        </Link>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full bg-violet-500 transition-[width] duration-500 dark:bg-violet-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
