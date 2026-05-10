import { memo } from "react";
import { cx } from "@/utils/helper";

export type AyahRow = {
  numberInSurah: number;
  arabic: string;
  translation: string;
};

const arabicFontStyle = {
  fontFamily:
    'Amiri, "Amiri Quran", "Scheherazade New", "Traditional Arabic", serif',
} as const;

interface Props {
  surahNumber: number;
  row: AyahRow;
  arabicFontPx: number;
  showMeal: boolean;
}

function AyahItemInner({
  surahNumber,
  row,
  arabicFontPx,
  showMeal,
}: Props) {
  const ayahNo = row.numberInSurah;

  return (
    <article
      className="border-b border-emerald-100/80 py-5 last:border-0 dark:border-zinc-700/60"
      aria-labelledby={`ayah-label-${surahNumber}-${ayahNo}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          id={`ayah-label-${surahNumber}-${ayahNo}`}
          className={cx(
            "inline-flex h-7 min-w-[1.75rem] shrink-0 items-center justify-center rounded-full px-1.5",
            "bg-emerald-100 text-xs font-semibold text-emerald-700",
            "dark:bg-emerald-900 dark:text-emerald-300"
          )}
        >
          {ayahNo}
        </span>
      </div>

      <p
        dir="rtl"
        className={cx(
          "font-arabic mb-3 text-right leading-loose text-zinc-900 dark:text-zinc-100"
        )}
        style={{ ...arabicFontStyle, fontSize: `${arabicFontPx}px` }}
      >
        {row.arabic}
      </p>

      {showMeal && row.translation && (
        <p className="mb-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {row.translation}
        </p>
      )}
    </article>
  );
}

const AyahItem = memo(AyahItemInner);
export default AyahItem;
