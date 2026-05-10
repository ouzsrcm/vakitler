import { memo, useCallback } from "react";
import TafsirAccordion from "@/components/quran/tafsir-accordion";
import { cx } from "@/utils/helper";
import useTranslation from "next-translate/useTranslation";

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
  showTafsirControls: boolean;
  tafsirOpen: boolean;
  tafsirHidden: boolean;
  onToggleTafsirForAyah: (ayahNo: number) => void;
  onTafsirUnavailableForAyah: (ayahNo: number) => void;
  onCloseTafsir: () => void;
}

function AyahItemInner({
  surahNumber,
  row,
  arabicFontPx,
  showMeal,
  showTafsirControls,
  tafsirOpen,
  tafsirHidden,
  onToggleTafsirForAyah,
  onTafsirUnavailableForAyah,
  onCloseTafsir,
}: Props) {
  const { t } = useTranslation("quran");
  const ayahNo = row.numberInSurah;

  const toggle = useCallback(() => {
    onToggleTafsirForAyah(ayahNo);
  }, [onToggleTafsirForAyah, ayahNo]);

  const handleUnavailable = useCallback(() => {
    onTafsirUnavailableForAyah(ayahNo);
  }, [onTafsirUnavailableForAyah, ayahNo]);

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

      {showTafsirControls && !tafsirHidden && (
        <>
          <button
            type="button"
            onClick={toggle}
            className="text-xs font-medium text-emerald-700 transition-colors hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            aria-expanded={tafsirOpen}
          >
            {tafsirOpen ? t("tafsirHide") : t("tafsirShow")}
          </button>

          <TafsirAccordion
            open={tafsirOpen}
            surahNumber={surahNumber}
            ayahNumber={ayahNo}
            onUnavailable={handleUnavailable}
            onClose={onCloseTafsir}
          />
        </>
      )}
    </article>
  );
}

const AyahItem = memo(AyahItemInner);
export default AyahItem;
