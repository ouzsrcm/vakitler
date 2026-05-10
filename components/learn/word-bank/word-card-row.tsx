import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import surahs from "@/data/surahs";
import type { IWord } from "@/lib/learn/words";
import { cx } from "@/utils/helper";

function MasteryDots({ mastery }: { mastery: number }) {
  return (
    <div className="flex shrink-0 gap-1" aria-hidden>
      {[0, 1, 2, 3].map(i => (
        <motion.span
          key={i}
          initial={false}
          animate={{
            scale: i < mastery ? [1, 1.15, 1] : 1,
          }}
          transition={{ delay: i * 0.06 }}
          className={cx(
            "h-2 w-2 rounded-full",
            i < mastery
              ? "bg-violet-500 dark:bg-violet-400"
              : "bg-zinc-200 dark:bg-zinc-600"
          )}
        />
      ))}
    </div>
  );
}

export default function WordCardRow({
  word,
  onOpen,
}: {
  word: IWord;
  onOpen: (w: IWord) => void;
}) {
  const { lang } = useTranslation("learn");

  const surahLabels = word.surahNumbers
    .map(n => {
      const s = surahs.find(x => x.number === n);
      if (!s) return String(n);
      return lang === "tr" ? s.nameTr : s.nameEn;
    })
    .join(", ");

  return (
    <button
      type="button"
      onClick={() => onOpen(word)}
      className="flex w-full flex-row items-start justify-between gap-3 rounded-2xl border border-violet-100 bg-white p-4 text-left shadow-sm transition-colors hover:border-violet-200 hover:bg-violet-50/40 dark:border-zinc-700 dark:bg-zinc-800/80 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
    >
      <div className="min-w-0 flex-1">
        <p className="text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {word.turkish}
        </p>
        <p className="mt-2 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
          {surahLabels}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <MasteryDots mastery={word.mastery} />
        <p
          className="max-w-[min(52%,11rem)] text-right text-lg font-semibold leading-snug text-zinc-900 dark:text-zinc-50"
          dir="rtl"
        >
          {word.arabic}
        </p>
      </div>
    </button>
  );
}
