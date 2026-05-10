import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import surahs from "@/data/surahs";
import type { IWord, WordMastery } from "@/lib/learn/words";
import { setMasteryForArabic } from "@/lib/learn/words";
import { cx } from "@/utils/helper";

const MASTERY_CHOICES: { value: WordMastery; labelKey: string }[] = [
  { value: 0, labelKey: "words.masteryUnknown" },
  { value: 1, labelKey: "words.masteryBit" },
  { value: 2, labelKey: "words.masteryGood" },
  { value: 3, labelKey: "words.masteryDone" },
];

export default function WordDetailModal({
  word,
  open,
  onClose,
  onMasteryChange,
}: {
  word: IWord | null;
  open: boolean;
  onClose: () => void;
  onMasteryChange: (w: IWord) => void;
}) {
  const { t, lang } = useTranslation("learn");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const pickMastery = (value: WordMastery) => {
    if (!word) return;
    setMasteryForArabic(word.arabic, value);
    onMasteryChange({ ...word, mastery: value });
  };

  return (
    <AnimatePresence>
      {open && word ? (
        <>
          <motion.button
            key="word-modal-backdrop"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label={t("words.closeModal")}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[1px]"
            onClick={onClose}
          />
          <motion.div
            key="word-modal-sheet"
            role="dialog"
            aria-modal
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[61] mx-auto max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-violet-100 bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-zinc-200 dark:bg-zinc-600" />

            <p
              className="mb-4 text-center text-5xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50"
              dir="rtl"
            >
              {word.arabic}
            </p>
            <p className="mb-6 text-center text-base text-zinc-600 dark:text-zinc-300">
              {word.turkish}
            </p>

            {word.root ? (
              <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {t("words.rootLabel")}{" "}
                </span>
                {word.root}
              </p>
            ) : null}

            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              {t("words.surahsHeading")}
            </p>
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {word.surahNumbers.map(n => {
                const s = surahs.find(x => x.number === n);
                const name = s
                  ? lang === "tr"
                    ? s.nameTr
                    : s.nameEn
                  : String(n);
                return (
                  <span
                    key={n}
                    className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-800 dark:bg-violet-900/40 dark:text-violet-200"
                  >
                    {name}
                  </span>
                );
              })}
            </div>

            <p className="mb-2 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {t("words.masteryPick")}
            </p>
            <div className="mb-6 grid grid-cols-2 gap-2">
              {MASTERY_CHOICES.map(({ value, labelKey }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => pickMastery(value)}
                  className={cx(
                    "rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors",
                    word.mastery === value
                      ? "border-violet-500 bg-violet-500 text-white dark:border-violet-500 dark:bg-violet-600"
                      : "border-violet-100 bg-violet-50/60 text-violet-900 hover:bg-violet-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  )}
                >
                  {t(labelKey)}
                </button>
              ))}
            </div>

            <div className="mb-2 flex justify-center gap-1.5" aria-hidden>
              {[0, 1, 2, 3].map(i => (
                <motion.span
                  key={i}
                  layout
                  initial={false}
                  animate={{
                    scale: i < word.mastery ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ delay: i * 0.08 }}
                  className={cx(
                    "h-2.5 w-2.5 rounded-full",
                    i < word.mastery
                      ? "bg-violet-500 dark:bg-violet-400"
                      : "bg-zinc-200 dark:bg-zinc-600"
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {t("words.close")}
            </button>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
