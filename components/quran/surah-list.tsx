import Link from "next/link";
import { ISurah } from "@/data/surahs";
import { cx } from "@/utils/helper";
import useTranslation from "next-translate/useTranslation";

interface Props {
  surahs: ISurah[];
  selectedNumber: number | null;
  /** Used when rows are buttons (dinle / notlar). Ignored if getItemHref is set. */
  onSelect?: (surah: ISurah) => void;
  /** When set, rows navigate with Next Link instead of calling onSelect. */
  getItemHref?: (surah: ISurah) => string;
}

export default function SurahList({
  surahs,
  selectedNumber,
  onSelect,
  getItemHref,
}: Props) {
  const { lang } = useTranslation("common");
  const isTr = lang === "tr";

  return (
    <div className="divide-y divide-emerald-100 dark:divide-zinc-800">
      {surahs.map(surah => {
        const isSelected = surah.number === selectedNumber;
        const href = getItemHref?.(surah);
        const rowClass = cx(
          "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
          "hover:bg-emerald-100 dark:hover:bg-zinc-800",
          isSelected && "bg-emerald-100 dark:bg-zinc-800"
        );
        const inner = (
          <>
            <span
              className={cx(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                isSelected
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-100 text-emerald-700 dark:bg-zinc-700 dark:text-zinc-300"
              )}
            >
              {surah.number}
            </span>

            <div className="min-w-0 grow">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={cx(
                    "truncate font-medium",
                    isSelected && "text-emerald-700 dark:text-emerald-400"
                  )}
                >
                  {isTr ? surah.nameTr : surah.nameEn}
                </span>
                <span className="shrink-0 font-arabic text-xl text-zinc-500 dark:text-zinc-400">
                  {surah.name}
                </span>
              </div>
              <div className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                {isTr ? surah.meaningTr : surah.meaning} · {surah.verses} ayet
              </div>
            </div>
          </>
        );

        if (href) {
          return (
            <Link
              key={surah.number}
              href={href}
              className={rowClass}
              scroll
            >
              {inner}
            </Link>
          );
        }

        return (
          <button
            key={surah.number}
            type="button"
            onClick={() => onSelect?.(surah)}
            className={rowClass}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}
