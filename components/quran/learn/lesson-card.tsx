import Link from "next/link";
import { motion } from "framer-motion";
import { IconLock, IconStarFilled } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import type { ILesson } from "@/data/learn-curriculum";
import type { LessonProgressEntry } from "@/lib/learn/progress";
import { cx } from "@/utils/helper";
import surahs from "@/data/surahs";

export default function LessonCard({
  lesson,
  progress,
  locked,
  levelLocked,
}: {
  lesson: ILesson;
  progress: LessonProgressEntry | null;
  locked: boolean;
  levelLocked: boolean;
}) {
  const { t, lang } = useTranslation("quran");
  const surah = surahs.find(s => s.number === lesson.surahNumber);
  const name =
    lang === "tr" ? surah?.nameTr ?? "" : surah?.nameEn ?? surah?.nameTr ?? "";
  const isLocked = locked || levelLocked;
  const stars = progress?.stars ?? 0;
  const completed = stars > 0;

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 truncate font-medium">{name}</span>
        {isLocked ? (
          <motion.span
            whileTap={{ rotate: [-8, 8, -8, 0], transition: { duration: 0.35 } }}
          >
            <IconLock size={18} className="shrink-0 opacity-70" aria-hidden />
          </motion.span>
        ) : completed ? (
          <div className="flex shrink-0 gap-0.5" aria-label={t("learnStarsEarned")}>
            {[1, 2, 3].map(i => (
              <IconStarFilled
                key={i}
                size={14}
                className={
                  i <= stars
                    ? "text-amber-200 drop-shadow-sm"
                    : "text-emerald-100/45 dark:text-emerald-900/30"
                }
              />
            ))}
          </div>
        ) : (
          <span
            className="inline-flex h-7 w-7 shrink-0 rounded-full border-2 border-emerald-400 dark:border-emerald-500"
            aria-label={t("learnNotStarted")}
          />
        )}
      </div>
      <p className="mt-1 truncate text-[11px] text-zinc-500 dark:text-zinc-400">
        {surah?.name}
      </p>
      {!isLocked && completed && (
        <span className="mt-2 text-[11px] font-medium text-emerald-50 dark:text-emerald-100">
          {t("learnStarsCount", { count: stars })}
        </span>
      )}
    </>
  );

  const cardClass = cx(
    "relative block rounded-2xl border p-3 text-left transition-colors min-h-[92px]",
    isLocked &&
      "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500",
    !isLocked &&
      completed &&
      "border-emerald-500 bg-emerald-500 text-white shadow-md dark:border-emerald-600 dark:bg-emerald-600",
    !isLocked &&
      !completed &&
      "border-emerald-200 bg-white hover:border-emerald-400 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-emerald-500"
  );

  if (isLocked) {
    return (
      <div className={cardClass} role="group" aria-disabled>
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/learn/${lesson.surahNumber}`}
      className={cx(cardClass, "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500")}
    >
      {inner}
    </Link>
  );
}
