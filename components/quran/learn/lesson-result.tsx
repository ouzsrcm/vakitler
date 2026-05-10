import Link from "next/link";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { IconStarFilled } from "@tabler/icons-react";
import { cx } from "@/utils/helper";

export default function LessonResult({
  surahName,
  stars,
  lessonXp,
  correctCount,
  mistakeCount,
}: {
  surahName: string;
  stars: 1 | 2 | 3;
  lessonXp: number;
  correctCount: number;
  mistakeCount: number;
}) {
  const { t } = useTranslation("quran");

  const starContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.22, delayChildren: 0.15 },
    },
  };

  const starItem = {
    hidden: { opacity: 0, scale: 0.3, y: 16 },
    show: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <div className="flex flex-col items-center rounded-2xl border border-emerald-100 bg-white p-6 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <p className="text-2xl" aria-hidden>
        🎉
      </p>
      <h2 className="mt-2 text-xl font-bold text-emerald-700 dark:text-emerald-400">
        {t("learnCongrats")}
      </h2>
      <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {t("learnSurahComplete", { name: surahName })}
      </p>

      <motion.div
        className="mt-6 flex gap-2"
        variants={starContainer}
        initial="hidden"
        animate="show"
      >
        {[1, 2, 3].map(i => (
          <motion.span key={i} variants={starItem}>
            <IconStarFilled
              size={36}
              className={cx(
                i <= stars
                  ? "text-amber-400 drop-shadow-sm"
                  : "text-zinc-200 dark:text-zinc-600"
              )}
            />
          </motion.span>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="mt-4 text-lg font-semibold text-amber-700 dark:text-amber-400"
      >
        +{lessonXp} XP
      </motion.p>

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        {t("learnResultStats", { correct: correctCount, wrong: mistakeCount })}
      </p>

      <div className="mt-8 flex w-full flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className="flex-1 rounded-xl border border-emerald-200 bg-white py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-emerald-400 dark:hover:bg-zinc-700"
          onClick={() => window.location.reload()}
        >
          {t("learnPlayAgain")}
        </button>
        <Link
          href="/learn"
          className="flex flex-1 items-center justify-center rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
        >
          {t("learnContinueMap")}
        </Link>
      </div>
    </div>
  );
}
