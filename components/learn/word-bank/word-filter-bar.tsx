import useTranslation from "next-translate/useTranslation";
import { CURRICULUM_SURAHS } from "@/data/learn-curriculum";
import surahs from "@/data/surahs";
import { cx } from "@/utils/helper";

export default function WordFilterBar({
  activeSurah,
  onChange,
}: {
  activeSurah: number | null;
  onChange: (surah: number | null) => void;
}) {
  const { t, lang } = useTranslation("learn");

  const label = (num: number) => {
    const s = surahs.find(x => x.number === num);
    if (!s) return String(num);
    return lang === "tr" ? s.nameTr : s.nameEn;
  };

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 pt-1">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cx(
          "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
          activeSurah === null
            ? "bg-violet-500 text-white dark:bg-violet-600"
            : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        )}
      >
        {t("words.filterAll")}
      </button>
      {CURRICULUM_SURAHS.map(num => (
        <button
          key={num}
          type="button"
          onClick={() => onChange(num)}
          className={cx(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
            activeSurah === num
              ? "bg-violet-500 text-white dark:bg-violet-600"
              : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          )}
        >
          {label(num)}
        </button>
      ))}
    </div>
  );
}
