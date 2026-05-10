import { useState } from "react";
import { motion } from "framer-motion";
import { IconVolume } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import type { ILetter } from "@/data/arabic-alphabet";
import { speakArabic, canUseSpeechSynthesis } from "@/lib/learn/elifba-speech";
import type { ElifbaMastery } from "@/lib/learn/elifba-progress";
import { cx } from "@/utils/helper";
import LetterExamples from "./letter-examples";
import LetterForms from "./letter-forms";

export default function LetterDetailContent({
  letter,
  mastery,
  onMasteryToggle,
}: {
  letter: ILetter;
  mastery: ElifbaMastery;
  onMasteryToggle: () => void;
}) {
  const { t } = useTranslation("learn");
  const [pulse, setPulse] = useState(false);
  const speech = canUseSpeechSynthesis();

  const play = () => {
    speakArabic(letter.nameAr);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 600);
  };

  const tip = letter.learningTipKey
    ? (() => {
        const k = `elifba.${letter.learningTipKey}`;
        const tr = t(k);
        return tr === k ? null : tr;
      })()
    : null;

  return (
    <div className="flex flex-col gap-5 pb-4">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50/90 to-white px-5 py-10 text-center shadow-sm dark:border-zinc-700 dark:from-violet-950/40 dark:to-zinc-900"
      >
        <p
          className="font-arabic text-8xl font-bold leading-none text-zinc-900 dark:text-zinc-50"
          dir="rtl"
        >
          {letter.arabic}
        </p>
        <p className="mt-4 text-sm font-bold uppercase tracking-wide text-violet-800 dark:text-violet-200">
          {letter.name} ·{" "}
          <span className="font-arabic font-semibold normal-case" dir="rtl">
            {letter.nameAr}
          </span>
        </p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {letter.pronunciation}
        </p>
        {speech ? (
          <button
            type="button"
            onClick={play}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-600"
          >
            <motion.span
              animate={pulse ? { scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 0.45 }}
            >
              <IconVolume size={18} aria-hidden />
            </motion.span>
            <span>{t("elifba.listen")}</span>
          </button>
        ) : null}
      </motion.div>

      <button
        type="button"
        onClick={onMasteryToggle}
        className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white py-3 text-sm font-semibold text-violet-800 dark:border-zinc-600 dark:bg-zinc-800 dark:text-violet-200"
        aria-label={t("elifba.masteryToggle")}
      >
        <motion.span
          key={mastery}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="text-2xl"
        >
          {mastery >= 3 ? "★" : "☆"}
        </motion.span>
        {t("elifba.masteryLabel", { level: mastery })}
      </button>

      <div
        className={cx(
          "rounded-lg border-l-4 border-violet-400 bg-violet-50 px-3 py-3 text-xs leading-relaxed text-violet-950 dark:border-violet-500 dark:bg-violet-900/20 dark:text-violet-100"
        )}
      >
        {tip ? <p className="mb-2 font-medium">{tip}</p> : null}
        <p className="text-zinc-700 dark:text-zinc-200">
          {letter.category === "güneş"
            ? t("elifba.categorySunShort")
            : t("elifba.categoryMoonShort")}
        </p>
      </div>

      <LetterForms letter={letter} />
      <LetterExamples letter={letter} />
    </div>
  );
}
