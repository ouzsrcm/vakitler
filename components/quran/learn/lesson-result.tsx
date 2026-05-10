import Link from "next/link";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { IconStarFilled } from "@tabler/icons-react";
import { cx } from "@/utils/helper";

export default function LessonResult({
  surahName,
  stars,
  xpBreakdown,
  correctCount,
  mistakeCount,
  flawless,
}: {
  surahName: string;
  stars: 1 | 2 | 3;
  xpBreakdown: {
    base: number;
    flawless: number;
    firstComplete: number;
    total: number;
  };
  correctCount: number;
  mistakeCount: number;
  flawless: boolean;
}) {
  const { t } = useTranslation("learn");

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
    <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 p-6 text-center text-white shadow-lg">
      <p className="text-2xl" aria-hidden>
        🎉
      </p>
      <h2 className="mt-2 text-xl font-bold">{t("lessonComplete")}</h2>
      <p className="mt-1 text-sm font-medium text-white/95">
        {t("lessonCompleteSubtitle")}
      </p>
      <p className="mt-2 text-sm font-semibold text-white/90">
        {t("surahDoneLine", { name: surahName })}
      </p>

      <motion.div
        className="mt-6 flex justify-center gap-3"
        variants={starContainer}
        initial="hidden"
        animate="show"
      >
        {[1, 2, 3].map(i => (
          <motion.span key={i} variants={starItem} className="text-4xl leading-none">
            <IconStarFilled
              size={44}
              className={cx(
                i <= stars
                  ? "text-amber-400 drop-shadow-md"
                  : "text-white/25"
              )}
            />
          </motion.span>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="mt-5 text-lg font-semibold text-violet-100"
      >
        +{xpBreakdown.total} XP
      </motion.p>

      <p className="mt-2 max-w-full break-words text-xs leading-relaxed text-white/85">
        {t("xpBreakdownLine", {
          base: xpBreakdown.base,
          flawless: xpBreakdown.flawless,
          first: xpBreakdown.firstComplete,
          total: xpBreakdown.total,
        })}
      </p>

      <p className="mt-4 text-sm text-white/90">
        {t("resultStats", { correct: correctCount, wrong: mistakeCount })}
      </p>

      <p className="mt-3 text-sm font-medium text-white/95">
        {flawless ? t("perfectLesson") : t("keepGoing")}
      </p>

      <div className="mt-8 flex w-full flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className="flex-1 rounded-xl border border-white/30 bg-white/20 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          onClick={() => window.location.reload()}
        >
          {t("playAgain")}
        </button>
        <Link
          href="/learn"
          className="flex flex-1 items-center justify-center rounded-xl bg-white py-3 text-sm font-semibold text-violet-600 shadow-sm transition-colors hover:bg-white/95"
        >
          {t("nextLesson")}
        </Link>
      </div>
    </div>
  );
}
